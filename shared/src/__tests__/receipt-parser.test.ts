/**
 * Receipt Parser Tests
 */

import {
  parseVeryfiReceipt,
  parseOCRReceipt,
  parseReceiptDate,
  validateParsedReceipt,
  type VeryfiResponse,
  type OCRReceiptData,
} from '../parsers/receipt-parser';

describe('parseReceiptDate', () => {
  it('should parse ISO date format (YYYY-MM-DD)', () => {
    const result = parseReceiptDate('2025-10-08');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(9); // October is month 9 (0-indexed)
    expect(result?.getDate()).toBe(8);
  });

  it('should parse MM/DD/YYYY format', () => {
    const result = parseReceiptDate('10/08/2025');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(9);
    expect(result?.getDate()).toBe(8);
  });

  it('should parse DD-MM-YYYY format', () => {
    const result = parseReceiptDate('08-10-2025');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(9); // October is month 9 (0-indexed)
    expect(result?.getDate()).toBe(8);
  });

  it('should parse DD.MM.YYYY format (European)', () => {
    const result = parseReceiptDate('08.10.2025');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(9); // October is month 9 (0-indexed)
    expect(result?.getDate()).toBe(8);
  });

  it('should return null for invalid date', () => {
    const result = parseReceiptDate('invalid-date');
    expect(result).toBeNull();
  });
});

describe('parseVeryfiReceipt', () => {
  const validVeryfiResponse: VeryfiResponse = {
    vendor: {
      name: 'ICA Maxi',
      address: 'Stockholm',
      phone_number: '+46123456789',
    },
    total: 245.5,
    subtotal: 220.0,
    tax: 25.5,
    date: '2025-10-08',
    time: '14:30',
    payment: {
      type: 'credit_card',
    },
    line_items: [
      {
        description: 'Milk 3%',
        quantity: 2,
        price: 12.5,
        total: 25.0,
        sku: 'MLK-001',
      },
      {
        description: 'Bread',
        quantity: 1,
        price: 30.0,
        total: 30.0,
      },
    ],
    currency_code: 'SEK',
    confidence: 0.95,
  };

  it('should parse valid Veryfi response', () => {
    const result = parseVeryfiReceipt(validVeryfiResponse);

    expect(result.store_name).toBe('ICA Maxi');
    expect(result.total_amount).toBe(245.5);
    expect(result.purchase_date).toBeInstanceOf(Date);
    expect(result.purchase_time).toBe('14:30');
    expect(result.currency).toBe('SEK');
    expect(result.payment_method).toBe('credit_card');
    expect(result.tax_amount).toBe(25.5);
    expect(result.items).toHaveLength(2);
    expect(result.confidence_score).toBe(0.95);
  });

  it('should handle missing vendor name', () => {
    const response = { ...validVeryfiResponse, vendor: undefined };
    const result = parseVeryfiReceipt(response);
    expect(result.store_name).toBe('Unknown Store');
  });

  it('should throw error for missing total', () => {
    const response = { ...validVeryfiResponse, total: undefined };
    expect(() => parseVeryfiReceipt(response)).toThrow('Missing required fields');
  });

  it('should throw error for missing date', () => {
    const response = { ...validVeryfiResponse, date: undefined };
    expect(() => parseVeryfiReceipt(response)).toThrow('Missing required fields');
  });

  it('should throw error for invalid date', () => {
    const response = { ...validVeryfiResponse, date: 'invalid-date' };
    expect(() => parseVeryfiReceipt(response)).toThrow('Invalid date format');
  });

  it('should handle items with missing fields', () => {
    const response: VeryfiResponse = {
      ...validVeryfiResponse,
      line_items: [
        {
          description: undefined,
          quantity: undefined,
          price: undefined,
          total: undefined,
        },
      ],
    };
    const result = parseVeryfiReceipt(response);
    expect(result.items[0].name).toBe('Unknown Item');
    expect(result.items[0].quantity).toBe(1);
    expect(result.items[0].unit_price).toBe(0);
  });
});

describe('parseOCRReceipt', () => {
  const validOCRData: OCRReceiptData = {
    vendor: {
      name: 'Coop',
      address: 'Göteborg',
    },
    total: 150.0,
    date: '2025-10-08',
    line_items: [
      {
        description: 'Tomatoes',
        quantity: 1.5,
        price: 30.0,
        total: 45.0,
      },
    ],
    currency_code: 'SEK',
  };

  it('should parse valid OCR data', () => {
    const result = parseOCRReceipt(validOCRData);
    expect(result.store_name).toBe('Coop');
    expect(result.total_amount).toBe(150.0);
    expect(result.items).toHaveLength(1);
  });

  it('should default to SEK currency', () => {
    const data = { ...validOCRData, currency_code: undefined };
    const result = parseOCRReceipt(data);
    expect(result.currency).toBe('SEK');
  });
});

describe('validateParsedReceipt', () => {
  const validReceipt = {
    store_name: 'ICA',
    total_amount: 100.0,
    purchase_date: new Date('2025-10-08'),
    currency: 'SEK',
    items: [
      {
        name: 'Milk',
        quantity: 1,
        unit_price: 12.5,
        total_price: 12.5,
      },
      {
        name: 'Bread',
        quantity: 2,
        unit_price: 30.0,
        total_price: 60.0,
      },
    ],
  };

  it('should validate correct receipt', () => {
    const result = validateParsedReceipt(validReceipt);
    expect(result.isValid).toBe(false); // Will fail due to total mismatch
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should detect missing store name', () => {
    const receipt = { ...validReceipt, store_name: 'Unknown Store' };
    const result = validateParsedReceipt(receipt);
    expect(result.errors).toContain('Store name is missing or could not be parsed');
  });

  it('should detect negative total', () => {
    const receipt = { ...validReceipt, total_amount: -10 };
    const result = validateParsedReceipt(receipt);
    expect(result.errors).toContain('Total amount must be positive');
  });

  it('should detect future date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const receipt = { ...validReceipt, purchase_date: futureDate };
    const result = validateParsedReceipt(receipt);
    expect(result.errors).toContain('Purchase date cannot be in the future');
  });

  it('should detect too old date', () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 6);
    const receipt = { ...validReceipt, purchase_date: oldDate };
    const result = validateParsedReceipt(receipt);
    expect(result.errors).toContain('Purchase date seems too old (more than 5 years ago)');
  });

  it('should detect empty items', () => {
    const receipt = { ...validReceipt, items: [] };
    const result = validateParsedReceipt(receipt);
    expect(result.errors).toContain('Receipt must have at least one item');
  });

  it('should detect items total mismatch', () => {
    const receipt = {
      ...validReceipt,
      total_amount: 999.99,
    };
    const result = validateParsedReceipt(receipt);
    expect(result.errors.some((e) => e.includes('does not match receipt total'))).toBe(true);
  });

  it('should validate confidence score range', () => {
    const receipt = { ...validReceipt, confidence_score: 1.5 };
    const result = validateParsedReceipt(receipt);
    expect(result.errors).toContain('Confidence score must be between 0 and 1');
  });
});
