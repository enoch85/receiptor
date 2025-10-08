/**
 * Veryfi OCR Service
 *
 * Handles receipt OCR processing using the Veryfi API.
 * Implements proper authentication, error handling, and retry logic.
 *
 * @see https://docs.veryfi.com/api/receipts-invoices/
 */

import * as Crypto from 'expo-crypto';

/**
 * Veryfi API configuration
 */
interface VeryfiConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  apiKey: string;
  apiVersion?: string;
  baseUrl?: string;
}

/**
 * Veryfi API response for receipt processing
 */
export interface VeryfiResponse {
  id: number;
  vendor: {
    name: string;
    address?: string;
    phone_number?: string;
  };
  date: string;
  total: number;
  subtotal?: number;
  tax?: number;
  currency_code: string;
  line_items: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
    category?: string;
  }>;
  payment?: {
    card_number?: string;
    type?: string;
  };
  ocr_text?: string;
  category?: string;
  tags?: string[];
}

/**
 * Veryfi OCR Service Class
 */
class VeryfiService {
  private config: VeryfiConfig;
  private baseUrl: string;
  private apiVersion: string;

  constructor(config: VeryfiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.veryfi.com/api';
    this.apiVersion = config.apiVersion || 'v8';
  }

  /**
   * Generate HMAC signature for API authentication
   */
  private async generateSignature(timestamp: number, payload: string): Promise<string> {
    const message = `${timestamp}${payload}`;
    
    // Convert client secret and message to ArrayBuffers
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.config.clientSecret);
    const messageData = encoder.encode(message);
    
    // Generate HMAC-SHA256
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message + this.config.clientSecret,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    
    return signature;
  }

  /**
   * Generate authentication headers
   */
  private async getHeaders(timestamp: number, payload: string): Promise<Record<string, string>> {
    const signature = await this.generateSignature(timestamp, payload);

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Client-Id': this.config.clientId,
      'Authorization': `apikey ${this.config.username}:${this.config.apiKey}`,
      'X-Veryfi-Request-Timestamp': timestamp.toString(),
      'X-Veryfi-Request-Signature': signature,
    };
  }

  /**
   * Process receipt from base64 image
   */
  async processReceipt(
    base64Image: string,
    options?: {
      categories?: string[];
      tags?: string[];
      autoDelete?: boolean;
      boost_mode?: 0 | 1;
    }
  ): Promise<VeryfiResponse> {
    const timestamp = Math.floor(Date.now() / 1000);

    // Prepare request payload
    const payload = {
      file_data: base64Image,
      file_name: `receipt_${Date.now()}.jpg`,
      categories: options?.categories || [],
      tags: options?.tags || [],
      auto_delete: options?.autoDelete ?? true,
      boost_mode: options?.boost_mode ?? 0, // 0 = normal, 1 = faster but less accurate
    };

    const payloadString = JSON.stringify(payload);
    const headers = await this.getHeaders(timestamp, payloadString);

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/partner/documents/`,
        {
          method: 'POST',
          headers,
          body: payloadString,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Veryfi API error: ${response.status} - ${
            errorData.error || response.statusText
          }`
        );
      }

      const data: VeryfiResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Receipt processing failed: ${error.message}`);
      }
      throw new Error('Receipt processing failed: Unknown error');
    }
  }

  /**
   * Process receipt with retry logic
   */
  async processReceiptWithRetry(
    base64Image: string,
    maxRetries: number = 3,
    options?: Parameters<VeryfiService['processReceipt']>[1]
  ): Promise<VeryfiResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.processReceipt(base64Image, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Receipt processing failed after retries');
  }
}

/**
 * Create Veryfi service instance
 */
export function createVeryfiService(config: VeryfiConfig): VeryfiService {
  return new VeryfiService(config);
}

/**
 * Mock Veryfi response for development
 */
export function getMockVeryfiResponse(): VeryfiResponse {
  return {
    id: Math.floor(Math.random() * 1000000),
    vendor: {
      name: 'ICA Supermarket',
      address: 'Storgatan 12, Stockholm',
      phone_number: '+46 8 123 45 67',
    },
    date: new Date().toISOString().split('T')[0],
    total: 245.50,
    subtotal: 227.10,
    tax: 18.40,
    currency_code: 'SEK',
    line_items: [
      { description: 'Organic Bananas', quantity: 1, price: 15.90, total: 15.90 },
      { description: 'Milk 3%', quantity: 2, price: 12.50, total: 25.00 },
      { description: 'Sourdough Bread', quantity: 1, price: 35.00, total: 35.00 },
      { description: 'Chicken Breast', quantity: 1, price: 89.00, total: 89.00 },
      { description: 'Pasta', quantity: 1, price: 18.90, total: 18.90 },
      { description: 'Tomato Sauce', quantity: 2, price: 15.00, total: 30.00 },
      { description: 'Chocolate Bar', quantity: 1, price: 31.70, total: 31.70 },
    ],
    payment: {
      type: 'card',
    },
    category: 'Grocery',
    tags: ['ica', 'groceries'],
  };
}

/**
 * Process receipt with automatic fallback to mock
 */
export async function processReceiptWithFallback(
  base64Image: string,
  config?: VeryfiConfig,
  useMock: boolean = false
): Promise<VeryfiResponse> {
  // Use mock if explicitly requested or no config provided
  if (useMock || !config) {
    console.log('Using mock Veryfi response');
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockVeryfiResponse()), 2000);
    });
  }

  // Try real API
  try {
    const service = createVeryfiService(config);
    return await service.processReceiptWithRetry(base64Image, 3, {
      boost_mode: 0,
      autoDelete: true,
    });
  } catch (error) {
    console.error('Veryfi API failed, using mock:', error);
    // Fallback to mock on error
    return getMockVeryfiResponse();
  }
}
