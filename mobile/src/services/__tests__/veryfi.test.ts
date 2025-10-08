/**
 * Veryfi Service Tests
 */

import { getMockVeryfiResponse, processReceiptWithFallback } from '../veryfi';

describe('Veryfi Service', () => {
  describe('getMockVeryfiResponse', () => {
    it('should return valid mock data', () => {
      const mockData = getMockVeryfiResponse();
      
      expect(mockData.vendor.name).toBeDefined();
      expect(mockData.total).toBeGreaterThan(0);
      expect(mockData.currency_code).toBe('SEK');
      expect(Array.isArray(mockData.line_items)).toBe(true);
    });
  });

  describe('processReceiptWithFallback', () => {
    it('should return mock data as fallback', async () => {
      const result = await processReceiptWithFallback('test.jpg');
      
      expect(result.vendor.name).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });
  });
});
