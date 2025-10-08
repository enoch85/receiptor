import { calculateBudgetProgress, calculateByCategory, calculateOrganicPercentage } from '../utils/calculations';
import type { Receipt, ReceiptItem } from '../types/entities';

describe('Budget Calculations', () => {
  describe('calculateBudgetProgress', () => {
    it('should calculate progress correctly', () => {
      const receipts: Receipt[] = [
        { total_amount: 100 } as Receipt,
        { total_amount: 200 } as Receipt,
      ];
      const budget = 500;

      const result = calculateBudgetProgress(receipts, budget);

      expect(result.spent).toBe(300);
      expect(result.percentage).toBe(60);
      expect(result.remaining).toBe(200);
      expect(result.is_exceeded).toBe(false);
    });

    it('should cap percentage at 100%', () => {
      const receipts: Receipt[] = [{ total_amount: 600 } as Receipt];
      const budget = 500;

      const result = calculateBudgetProgress(receipts, budget);

      expect(result.percentage).toBe(100);
      expect(result.is_exceeded).toBe(true);
    });

    it('should handle empty receipts', () => {
      const result = calculateBudgetProgress([], 500);

      expect(result.spent).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.remaining).toBe(500);
    });
  });

  describe('calculateByCategory', () => {
    it('should group spending by category', () => {
      const items: ReceiptItem[] = [
        { category: 'meat_fish', total_price: 150 } as ReceiptItem,
        { category: 'meat_fish', total_price: 100 } as ReceiptItem,
        { category: 'dairy_eggs', total_price: 50 } as ReceiptItem,
      ];

      const result = calculateByCategory(items);

      expect(result.meat_fish).toBe(250);
      expect(result.dairy_eggs).toBe(50);
    });
  });

  describe('calculateOrganicPercentage', () => {
    it('should calculate organic percentage correctly', () => {
      const items: ReceiptItem[] = [
        { is_organic: true, total_price: 50 } as ReceiptItem,
        { is_organic: false, total_price: 150 } as ReceiptItem,
      ];

      const result = calculateOrganicPercentage(items);

      expect(result).toBe(25); // 50/200 = 25%
    });

    it('should handle all organic items', () => {
      const items: ReceiptItem[] = [
        { is_organic: true, total_price: 100 } as ReceiptItem,
        { is_organic: true, total_price: 100 } as ReceiptItem,
      ];

      const result = calculateOrganicPercentage(items);

      expect(result).toBe(100);
    });

    it('should handle empty items', () => {
      const result = calculateOrganicPercentage([]);

      expect(result).toBe(0);
    });
  });
});
