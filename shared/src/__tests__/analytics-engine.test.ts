/**
 * Analytics Engine Tests
 */

import {
  calculateSpendingTrend,
  analyzeCategorySpending,
  assessBudgetHealth,
  comparePrices,
  generateSpendingInsights,
} from '../analytics/analytics-engine';
import type { Receipt, ReceiptItem, Budget } from '../types/entities';

const mockReceipts: Receipt[] = [
  {
    id: '1',
    household_id: 'h1',
    store_id: 's1',
    store_name: 'ICA',
    total_amount: 100,
    purchase_date: new Date('2025-10-01'),
    currency: 'SEK',
    source: 'manual',
    items: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    household_id: 'h1',
    store_id: 's2',
    store_name: 'Coop',
    total_amount: 150,
    purchase_date: new Date('2025-10-05'),
    currency: 'SEK',
    source: 'manual',
    items: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    household_id: 'h1',
    store_id: 's1',
    store_name: 'ICA',
    total_amount: 200,
    purchase_date: new Date('2025-10-10'),
    currency: 'SEK',
    source: 'manual',
    items: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockItems: ReceiptItem[] = [
  {
    id: '1',
    receipt_id: '1',
    name: 'Banana',
    quantity: 2,
    unit_price: 10,
    total_price: 20,
    category: 'fruits_vegetables',
    is_organic: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    receipt_id: '1',
    name: 'Milk',
    quantity: 1,
    unit_price: 15,
    total_price: 15,
    category: 'dairy_eggs',
    is_organic: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    receipt_id: '2',
    name: 'Chicken',
    quantity: 1,
    unit_price: 80,
    total_price: 80,
    category: 'meat_fish',
    is_organic: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

describe('calculateSpendingTrend', () => {
  it('should calculate daily trend', () => {
    const result = calculateSpendingTrend(mockReceipts, 'daily');
    expect(result.period).toBe('daily');
    expect(result.data_points.length).toBeGreaterThan(0);
    expect(result.average).toBeGreaterThan(0);
    expect(['increasing', 'decreasing', 'stable']).toContain(result.trend);
  });

  it('should calculate monthly trend', () => {
    const result = calculateSpendingTrend(mockReceipts, 'monthly');
    expect(result.period).toBe('monthly');
    expect(result.data_points.length).toBeGreaterThan(0);
  });

  it('should handle empty receipts', () => {
    const result = calculateSpendingTrend([], 'daily');
    expect(result.data_points).toHaveLength(0);
    expect(result.average).toBe(0);
    expect(result.trend).toBe('stable');
  });

  it('should detect increasing trend', () => {
    const increasingReceipts: Receipt[] = [
      { ...mockReceipts[0], total_amount: 100, purchase_date: new Date('2025-10-01') },
      { ...mockReceipts[1], total_amount: 150, purchase_date: new Date('2025-10-02') },
      { ...mockReceipts[2], total_amount: 200, purchase_date: new Date('2025-10-03') },
    ];
    const result = calculateSpendingTrend(increasingReceipts, 'daily');
    expect(result.trend).toBe('increasing');
    expect(result.change_percentage).toBeGreaterThan(0);
  });
});

describe('analyzeCategorySpending', () => {
  it('should analyze spending by category', () => {
    const result = analyzeCategorySpending(mockItems);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].category).toBeDefined();
    expect(result[0].total_spent).toBeGreaterThan(0);
    expect(result[0].item_count).toBeGreaterThan(0);
  });

  it('should sort by total spent descending', () => {
    const result = analyzeCategorySpending(mockItems);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].total_spent).toBeGreaterThanOrEqual(result[i + 1].total_spent);
    }
  });

  it('should include top items', () => {
    const result = analyzeCategorySpending(mockItems);
    const categoryWithItems = result.find((c) => c.item_count > 0);
    expect(categoryWithItems?.top_items).toBeDefined();
    expect(categoryWithItems?.top_items.length).toBeGreaterThan(0);
  });

  it('should calculate average item price', () => {
    const result = analyzeCategorySpending(mockItems);
    const fruitVeg = result.find((c) => c.category === 'fruits_vegetables');
    expect(fruitVeg?.average_item_price).toBe(20); // 20 / 1 item
  });
});

describe('assessBudgetHealth', () => {
  const mockBudget: Budget = {
    id: 'b1',
    household_id: 'h1',
    name: 'Monthly Budget',
    amount: 1000,
    period: 'monthly',
    start_date: new Date('2025-10-01'),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('should assess budget health', () => {
    const result = assessBudgetHealth(mockBudget, mockReceipts, new Date('2025-10-15'));
    expect(result.status).toBeDefined();
    expect(['excellent', 'good', 'warning', 'critical']).toContain(result.status);
    expect(result.days_remaining).toBeGreaterThanOrEqual(0);
  });

  it('should calculate daily budget remaining', () => {
    const result = assessBudgetHealth(mockBudget, mockReceipts, new Date('2025-10-15'));
    expect(result.daily_budget_remaining).toBeGreaterThanOrEqual(0);
  });

  it('should provide recommendations', () => {
    const result = assessBudgetHealth(mockBudget, mockReceipts, new Date('2025-10-15'));
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it('should detect excellent budget status', () => {
    const lowSpendingReceipts = [{ ...mockReceipts[0], total_amount: 50 }];
    const result = assessBudgetHealth(mockBudget, lowSpendingReceipts, new Date('2025-10-15'));
    expect(result.status).toBe('excellent');
  });

  it('should detect critical budget status', () => {
    const highSpendingReceipts = [{ ...mockReceipts[0], total_amount: 1200 }];
    const result = assessBudgetHealth(mockBudget, highSpendingReceipts, new Date('2025-10-15'));
    expect(result.status).toBe('critical');
  });
});

describe('comparePrices', () => {
  it('should compare prices across stores', () => {
    const items: ReceiptItem[] = [
      {
        ...mockItems[0],
        name: 'Banana',
        unit_price: 10,
        receipt_id: '1',
      },
      {
        ...mockItems[0],
        id: '2',
        name: 'Banana',
        unit_price: 12,
        receipt_id: '2',
      },
    ];
    const result = comparePrices('Banana', items, mockReceipts);

    expect(result).not.toBeNull();
    expect(result?.item_name).toBe('Banana');
    expect(result?.lowest_price).toBe(10);
    expect(result?.highest_price).toBe(12);
    expect(result?.stores.length).toBe(2);
  });

  it('should return null for non-existent item', () => {
    const result = comparePrices('NonExistent', mockItems, mockReceipts);
    expect(result).toBeNull();
  });

  it('should do fuzzy matching', () => {
    const result = comparePrices('Ban', mockItems, mockReceipts);
    expect(result).not.toBeNull();
    expect(result?.item_name).toBe('Banana');
  });
});

describe('generateSpendingInsights', () => {
  const mockBudget: Budget = {
    id: 'b1',
    household_id: 'h1',
    name: 'Monthly Budget',
    amount: 1000,
    period: 'monthly',
    start_date: new Date('2025-10-01'),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('should generate insights', () => {
    const result = generateSpendingInsights(mockReceipts, mockItems, mockBudget);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should detect high-value items', () => {
    const expensiveItems: ReceiptItem[] = [{ ...mockItems[0], unit_price: 100 }];
    const result = generateSpendingInsights(mockReceipts, expensiveItems, mockBudget);
    const highValueInsight = result.find((i) => i.type === 'tip' && i.title.includes('High-value'));
    expect(highValueInsight).toBeDefined();
  });

  it('should detect budget achievements', () => {
    const lowSpendingReceipts = [{ ...mockReceipts[0], total_amount: 100 }];
    const result = generateSpendingInsights(lowSpendingReceipts, mockItems, mockBudget);
    const achievement = result.find((i) => i.type === 'achievement');
    expect(achievement).toBeDefined();
  });

  it('should detect frequent purchases', () => {
    const frequentItems: ReceiptItem[] = Array(6)
      .fill(null)
      .map((_, i) => ({
        ...mockItems[0],
        id: String(i),
        name: 'Milk',
      }));
    const result = generateSpendingInsights(mockReceipts, frequentItems, mockBudget);
    const frequentTip = result.find((i) => i.title.includes('Frequent'));
    expect(frequentTip).toBeDefined();
  });
});
