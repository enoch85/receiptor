import type { Receipt, ReceiptItem } from '../types/entities';
import type { BudgetProgress } from '../types/entities';
import type { ProductCategory } from '../types/enums';

/**
 * Calculate the total amount from receipt items
 * @param items - Array of receipt items
 * @returns Total amount
 */
export function calculateReceiptTotal(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + item.total_price, 0);
}

/**
 * Calculate budget progress
 * @param receipts - Array of receipts in the budget period
 * @param budgetAmount - The budget amount
 * @returns Budget progress object
 */
export function calculateBudgetProgress(
  receipts: Receipt[],
  budgetAmount: number
): BudgetProgress {
  const spent = receipts.reduce((sum, receipt) => sum + receipt.total_amount, 0);
  const percentage = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
  const remaining = Math.max(budgetAmount - spent, 0);
  const is_exceeded = spent > budgetAmount;

  return {
    spent,
    budget: budgetAmount,
    percentage,
    remaining,
    is_exceeded,
  };
}

/**
 * Calculate spending by category
 * @param items - Array of receipt items
 * @returns Object mapping categories to total amounts
 */
export function calculateByCategory(items: ReceiptItem[]): Record<ProductCategory, number> {
  const result: Partial<Record<ProductCategory, number>> = {};

  items.forEach((item) => {
    const current = result[item.category] || 0;
    result[item.category] = current + item.total_price;
  });

  return result as Record<ProductCategory, number>;
}

/**
 * Calculate spending by store
 * @param receipts - Array of receipts
 * @returns Object mapping store names to total amounts
 */
export function calculateByStore(receipts: Receipt[]): Record<string, number> {
  const result: Record<string, number> = {};

  receipts.forEach((receipt) => {
    const current = result[receipt.store_name] || 0;
    result[receipt.store_name] = current + receipt.total_amount;
  });

  return result;
}

/**
 * Calculate organic spending percentage
 * @param items - Array of receipt items
 * @returns Percentage of spending on organic products
 */
export function calculateOrganicPercentage(items: ReceiptItem[]): number {
  if (items.length === 0) {
    return 0;
  }

  const totalSpent = items.reduce((sum, item) => sum + item.total_price, 0);
  const organicSpent = items
    .filter((item) => item.is_organic)
    .reduce((sum, item) => sum + item.total_price, 0);

  return totalSpent > 0 ? (organicSpent / totalSpent) * 100 : 0;
}

/**
 * Calculate average basket size
 * @param receipts - Array of receipts
 * @returns Average receipt amount
 */
export function calculateAverageBasket(receipts: Receipt[]): number {
  if (receipts.length === 0) {
    return 0;
  }

  const total = receipts.reduce((sum, receipt) => sum + receipt.total_amount, 0);
  return total / receipts.length;
}

/**
 * Calculate total carbon footprint
 * @param items - Array of receipt items
 * @returns Total carbon footprint in grams of CO2e
 */
export function calculateCarbonFootprint(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + (item.carbon_score || 0), 0);
}

/**
 * Group receipts by date (for charts)
 * @param receipts - Array of receipts
 * @returns Object mapping dates to total amounts
 */
export function groupReceiptsByDate(receipts: Receipt[]): Record<string, number> {
  const result: Record<string, number> = {};

  receipts.forEach((receipt) => {
    const dateKey = receipt.purchase_date.toISOString().split('T')[0];
    const current = result[dateKey] || 0;
    result[dateKey] = current + receipt.total_amount;
  });

  return result;
}

/**
 * Filter receipts by date range
 * @param receipts - Array of receipts
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Filtered receipts
 */
export function filterReceiptsByDateRange(
  receipts: Receipt[],
  startDate: Date,
  endDate: Date
): Receipt[] {
  return receipts.filter((receipt) => {
    const purchaseDate = new Date(receipt.purchase_date);
    return purchaseDate >= startDate && purchaseDate <= endDate;
  });
}

/**
 * Get receipts for current month
 * @param receipts - Array of receipts
 * @returns Receipts from current month
 */
export function getCurrentMonthReceipts(receipts: Receipt[]): Receipt[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return filterReceiptsByDateRange(receipts, startOfMonth, endOfMonth);
}

/**
 * Get start and end dates for a budget period
 * @param period - Budget period type
 * @param startDate - Optional custom start date
 * @returns Object with start and end dates
 */
export function getBudgetPeriodDates(
  period: 'weekly' | 'monthly' | 'yearly',
  startDate?: Date
): { start: Date; end: Date } {
  const now = startDate || new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case 'weekly':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;

    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case 'yearly':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
  }

  return { start, end };
}
