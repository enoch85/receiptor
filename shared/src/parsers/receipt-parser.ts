/**
 * Receipt Parser
 *
 * Utilities for parsing OCR results from various receipt scanning services.
 * Supports Veryfi and extensible for other providers.
 */

/**
 * Standard OCR receipt data structure
 */
export interface OCRReceiptData {
  vendor?: {
    name?: string;
    address?: string;
    phone?: string;
  };
  total?: number;
  subtotal?: number;
  tax?: number;
  date?: string;
  time?: string;
  payment_method?: string;
  line_items?: Array<{
    description?: string;
    quantity?: number;
    price?: number;
    total?: number;
    sku?: string;
  }>;
  currency_code?: string;
  confidence?: number;
}

/**
 * Veryfi-specific response structure
 */
export interface VeryfiResponse {
  vendor?: {
    name?: string;
    address?: string;
    phone_number?: string;
  };
  total?: number;
  subtotal?: number;
  tax?: number;
  date?: string;
  time?: string;
  payment?: {
    type?: string;
  };
  line_items?: Array<{
    description?: string;
    quantity?: number;
    price?: number;
    total?: number;
    sku?: string;
  }>;
  currency_code?: string;
  confidence?: number;
}

/**
 * Parsed receipt result
 */
export interface ParsedReceipt {
  store_name: string;
  total_amount: number;
  purchase_date: Date;
  purchase_time?: string;
  currency: string;
  payment_method?: string;
  tax_amount?: number;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sku?: string;
  }>;
  confidence_score?: number;
  raw_data?: unknown;
}

/**
 * Parse Veryfi OCR response into standardized format
 */
export function parseVeryfiReceipt(response: VeryfiResponse): ParsedReceipt {
  // Validate required fields
  if (!response.total || !response.date) {
    throw new Error('Missing required fields: total and date are required');
  }

  // Parse date
  const purchaseDate = parseReceiptDate(response.date);
  if (!purchaseDate) {
    throw new Error(`Invalid date format: ${response.date}`);
  }

  // Parse line items
  const items = (response.line_items || []).map((item) => ({
    name: item.description || 'Unknown Item',
    quantity: item.quantity || 1,
    unit_price: item.price || 0,
    total_price: item.total || item.price || 0,
    sku: item.sku,
  }));

  return {
    store_name: response.vendor?.name || 'Unknown Store',
    total_amount: response.total,
    purchase_date: purchaseDate,
    purchase_time: response.time,
    currency: response.currency_code || 'SEK',
    payment_method: response.payment?.type,
    tax_amount: response.tax,
    items,
    confidence_score: response.confidence,
    raw_data: response,
  };
}

/**
 * Parse generic OCR response into standardized format
 */
export function parseOCRReceipt(data: OCRReceiptData): ParsedReceipt {
  if (!data.total || !data.date) {
    throw new Error('Missing required fields: total and date are required');
  }

  const purchaseDate = parseReceiptDate(data.date);
  if (!purchaseDate) {
    throw new Error(`Invalid date format: ${data.date}`);
  }

  const items = (data.line_items || []).map((item) => ({
    name: item.description || 'Unknown Item',
    quantity: item.quantity || 1,
    unit_price: item.price || 0,
    total_price: item.total || item.price || 0,
    sku: item.sku,
  }));

  return {
    store_name: data.vendor?.name || 'Unknown Store',
    total_amount: data.total,
    purchase_date: purchaseDate,
    purchase_time: data.time,
    currency: data.currency_code || 'SEK',
    payment_method: data.payment_method,
    tax_amount: data.tax,
    items,
    confidence_score: data.confidence,
    raw_data: data,
  };
}

/**
 * Parse receipt date from various formats
 */
export function parseReceiptDate(dateStr: string): Date | null {
  // Try common formats with regex first (more reliable)
  const formats = [
    { regex: /^(\d{4})-(\d{2})-(\d{2})$/, order: 'YMD' }, // YYYY-MM-DD
    { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, order: 'MDY' }, // MM/DD/YYYY
    { regex: /^(\d{2})-(\d{2})-(\d{4})$/, order: 'DMY' }, // DD-MM-YYYY
    { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, order: 'DMY' }, // DD.MM.YYYY (European)
  ];

  for (const format of formats) {
    const match = dateStr.match(format.regex);
    if (match) {
      let date: Date;

      // Parse based on order
      switch (format.order) {
        case 'YMD': {
          date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
          break;
        }
        case 'MDY': {
          date = new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
          break;
        }
        case 'DMY': {
          date = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
          break;
        }
        default:
          continue;
      }

      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  // Fallback to ISO format
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
}

/**
 * Validate parsed receipt data
 */
export function validateParsedReceipt(receipt: ParsedReceipt): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate store name
  if (!receipt.store_name || receipt.store_name === 'Unknown Store') {
    errors.push('Store name is missing or could not be parsed');
  }

  // Validate total amount
  if (receipt.total_amount <= 0) {
    errors.push('Total amount must be positive');
  }

  // Validate date
  if (!receipt.purchase_date || isNaN(receipt.purchase_date.getTime())) {
    errors.push('Invalid purchase date');
  } else {
    // Check if date is not in the future
    const now = new Date();
    if (receipt.purchase_date > now) {
      errors.push('Purchase date cannot be in the future');
    }

    // Check if date is not too old (e.g., more than 5 years)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);
    if (receipt.purchase_date < fiveYearsAgo) {
      errors.push('Purchase date seems too old (more than 5 years ago)');
    }
  }

  // Validate items
  if (!receipt.items || receipt.items.length === 0) {
    errors.push('Receipt must have at least one item');
  } else {
    // Validate each item
    receipt.items.forEach((item, index) => {
      if (!item.name || item.name === 'Unknown Item') {
        errors.push(`Item ${index + 1}: Missing item name`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be positive`);
      }
      if (item.unit_price < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      }
      if (item.total_price < 0) {
        errors.push(`Item ${index + 1}: Total price cannot be negative`);
      }
    });

    // Validate items total matches receipt total (with some tolerance for rounding)
    const itemsTotal = receipt.items.reduce((sum, item) => sum + item.total_price, 0);
    const tolerance = 0.01; // Allow 1 cent difference
    if (Math.abs(itemsTotal - receipt.total_amount) > tolerance) {
      errors.push(
        `Items total (${itemsTotal}) does not match receipt total (${receipt.total_amount})`
      );
    }
  }

  // Validate confidence score if present
  if (receipt.confidence_score !== undefined) {
    if (receipt.confidence_score < 0 || receipt.confidence_score > 1) {
      errors.push('Confidence score must be between 0 and 1');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Store-specific parser registry
 */
const storeSpecificParsers: Record<string, (receipt: ParsedReceipt) => ParsedReceipt> = {
  // Add store-specific parsing logic here
  // Example: 'ICA': parseICAReceipt,
};

/**
 * Apply store-specific parsing rules if available
 */
export function applyStoreSpecificParsing(receipt: ParsedReceipt): ParsedReceipt {
  const storeName = receipt.store_name.toLowerCase();

  for (const [key, parser] of Object.entries(storeSpecificParsers)) {
    if (storeName.includes(key.toLowerCase())) {
      return parser(receipt);
    }
  }

  return receipt;
}
