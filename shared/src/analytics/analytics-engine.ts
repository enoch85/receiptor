/**
 * Analytics Engine
 *
 * Advanced analytics and insights for household spending patterns.
 * Includes trends, predictions, and comparative analysis.
 */

import type { Receipt, ReceiptItem, Budget } from '../types/entities';
import type { ProductCategory } from '../types/enums';
import { getBudgetPeriodDates } from '../utils/calculations';

/**
 * Spending trend data point
 */
export interface TrendDataPoint {
  date: Date;
  amount: number;
  category?: ProductCategory;
}

/**
 * Spending trend analysis
 */
export interface TrendAnalysis {
  period: 'daily' | 'weekly' | 'monthly';
  data_points: TrendDataPoint[];
  average: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  change_percentage: number;
}

/**
 * Category insights
 */
export interface CategoryInsights {
  category: ProductCategory;
  total_spent: number;
  percentage_of_budget: number;
  item_count: number;
  average_item_price: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  top_items: Array<{
    name: string;
    frequency: number;
    total_spent: number;
  }>;
}

/**
 * Budget health status
 */
export interface BudgetHealth {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  days_remaining: number;
  daily_budget_remaining: number;
  projected_overspend: number;
  recommendations: string[];
}

/**
 * Price comparison data
 */
export interface PriceComparison {
  item_name: string;
  current_price: number;
  average_price: number;
  lowest_price: number;
  highest_price: number;
  stores: Array<{
    store_name: string;
    price: number;
    date: Date;
  }>;
}

/**
 * Calculate spending trend
 */
export function calculateSpendingTrend(
  receipts: Receipt[],
  period: 'daily' | 'weekly' | 'monthly'
): TrendAnalysis {
  if (receipts.length === 0) {
    return {
      period,
      data_points: [],
      average: 0,
      trend: 'stable',
      change_percentage: 0,
    };
  }

  // Group receipts by period
  const groups = groupReceiptsByPeriod(receipts, period);

  // Convert to data points
  const data_points: TrendDataPoint[] = Object.entries(groups).map(([dateStr, groupReceipts]) => ({
    date: new Date(dateStr),
    amount: groupReceipts.reduce((sum, r) => sum + r.total_amount, 0),
  }));

  // Sort by date
  data_points.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate average
  const average = data_points.reduce((sum, dp) => sum + dp.amount, 0) / data_points.length;

  // Determine trend using linear regression
  const { trend, changePercentage } = calculateTrendDirection(data_points);

  return {
    period,
    data_points,
    average,
    trend,
    change_percentage: changePercentage,
  };
}

/**
 * Group receipts by time period
 */
function groupReceiptsByPeriod(
  receipts: Receipt[],
  period: 'daily' | 'weekly' | 'monthly'
): Record<string, Receipt[]> {
  const groups: Record<string, Receipt[]> = {};

  receipts.forEach((receipt) => {
    const date = new Date(receipt.purchase_date);
    let key: string;

    switch (period) {
      case 'daily': {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      }
      case 'weekly': {
        // Get ISO week number
        const weekNumber = getISOWeek(date);
        key = `${date.getFullYear()}-W${weekNumber}`;
        break;
      }
      case 'monthly': {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      }
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(receipt);
  });

  return groups;
}

/**
 * Get ISO week number
 */
function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNumber;
}

/**
 * Calculate trend direction using simple linear regression
 */
function calculateTrendDirection(data: TrendDataPoint[]): {
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
} {
  if (data.length < 2) {
    return { trend: 'stable', changePercentage: 0 };
  }

  // Simple linear regression
  const n = data.length;
  const xValues = data.map((_, i) => i);
  const yValues = data.map((d) => d.amount);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  // Calculate change percentage
  const firstValue = yValues[0];
  const lastValue = yValues[yValues.length - 1];
  const changePercentage = firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100;

  // Determine trend
  const threshold = 5; // 5% threshold for stability
  if (Math.abs(changePercentage) < threshold) {
    return { trend: 'stable', changePercentage: 0 };
  }

  return {
    trend: slope > 0 ? 'increasing' : 'decreasing',
    changePercentage: Math.round(changePercentage * 10) / 10,
  };
}

/**
 * Analyze category spending
 */
export function analyzeCategorySpending(items: ReceiptItem[]): CategoryInsights[] {
  // Group items by category
  const itemsByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<ProductCategory, ReceiptItem[]>
  );

  // Calculate total spent
  const totalSpent = items.reduce((sum, item) => sum + item.total_price, 0);

  // Calculate insights for each category
  const insights: CategoryInsights[] = Object.entries(itemsByCategory).map(
    ([category, categoryItems]) => {
      const catTotal = categoryItems.reduce((sum, item) => sum + item.total_price, 0);

      // Get top items
      const itemFrequency: Record<string, { count: number; total: number }> = {};
      categoryItems.forEach((item) => {
        const name = item.name.toLowerCase();
        if (!itemFrequency[name]) {
          itemFrequency[name] = { count: 0, total: 0 };
        }
        itemFrequency[name].count++;
        itemFrequency[name].total += item.total_price;
      });

      const topItems = Object.entries(itemFrequency)
        .map(([name, data]) => ({
          name,
          frequency: data.count,
          total_spent: data.total,
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 5);

      // Calculate trend (simplified - would need historical data)
      const trend = 'stable' as const;

      return {
        category: category as ProductCategory,
        total_spent: catTotal,
        percentage_of_budget: totalSpent > 0 ? (catTotal / totalSpent) * 100 : 0,
        item_count: categoryItems.length,
        average_item_price: categoryItems.length > 0 ? catTotal / categoryItems.length : 0,
        trend,
        top_items: topItems,
      };
    }
  );

  return insights.sort((a, b) => b.total_spent - a.total_spent);
}

/**
 * Assess budget health
 */
export function assessBudgetHealth(
  budget: Budget,
  receipts: Receipt[],
  currentDate: Date = new Date()
): BudgetHealth {
  // Calculate total spent
  const totalSpent = receipts.reduce((sum, r) => sum + r.total_amount, 0);
  const remaining = budget.amount - totalSpent;

  // Calculate period dates
  const { start: startDate, end: endDate } = getBudgetPeriodDates(
    budget.period,
    new Date(budget.start_date)
  );
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  // Calculate daily budget remaining
  const dailyBudgetRemaining = daysRemaining > 0 ? remaining / daysRemaining : 0;

  // Calculate projected overspend
  const dailySpentAverage = daysElapsed > 0 ? totalSpent / daysElapsed : 0;
  const projectedTotal = dailySpentAverage * totalDays;
  const projectedOverspend = Math.max(0, projectedTotal - budget.amount);

  // Determine status
  const spentPercentage = (totalSpent / budget.amount) * 100;
  const progressPercentage = (daysElapsed / totalDays) * 100;

  let status: BudgetHealth['status'];
  if (spentPercentage <= progressPercentage - 10) {
    status = 'excellent';
  } else if (spentPercentage <= progressPercentage + 10) {
    status = 'good';
  } else if (spentPercentage <= 100) {
    status = 'warning';
  } else {
    status = 'critical';
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (status === 'warning' || status === 'critical') {
    recommendations.push(`Reduce daily spending to ${dailyBudgetRemaining.toFixed(2)} or less`);
  }

  if (projectedOverspend > 0) {
    recommendations.push(`On track to exceed budget by ${projectedOverspend.toFixed(2)}`);
  }

  if (status === 'excellent') {
    recommendations.push('Great job staying under budget!');
  }

  return {
    status,
    days_remaining: daysRemaining,
    daily_budget_remaining: dailyBudgetRemaining,
    projected_overspend: projectedOverspend,
    recommendations,
  };
}

/**
 * Compare prices across stores
 */
export function comparePrices(
  itemName: string,
  items: ReceiptItem[],
  receipts: Receipt[]
): PriceComparison | null {
  // Find all matching items (fuzzy match)
  const normalizedName = itemName.toLowerCase().trim();
  const matchingItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(item.name.toLowerCase())
  );

  if (matchingItems.length === 0) {
    return null;
  }

  // Get prices by store
  const pricesByStore = matchingItems.map((item) => {
    const receipt = receipts.find((r) => r.id === item.receipt_id);
    return {
      store_name: receipt?.store_name || 'Unknown',
      price: item.unit_price,
      date: receipt?.purchase_date || new Date(),
    };
  });

  // Calculate statistics
  const prices = pricesByStore.map((p) => p.price);
  const currentPrice = prices[prices.length - 1];
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);

  return {
    item_name: matchingItems[0].name,
    current_price: currentPrice,
    average_price: averagePrice,
    lowest_price: lowestPrice,
    highest_price: highestPrice,
    stores: pricesByStore,
  };
}

/**
 * Generate spending insights
 */
export interface SpendingInsight {
  type: 'savings' | 'warning' | 'tip' | 'achievement';
  title: string;
  description: string;
  amount?: number;
}

export function generateSpendingInsights(
  receipts: Receipt[],
  items: ReceiptItem[],
  budget: Budget
): SpendingInsight[] {
  const insights: SpendingInsight[] = [];

  // Check for potential savings on expensive items
  const expensiveItems = items
    .filter((item) => item.unit_price > 50)
    .sort((a, b) => b.unit_price - a.unit_price)
    .slice(0, 3);

  if (expensiveItems.length > 0) {
    insights.push({
      type: 'tip',
      title: 'High-value items detected',
      description: `Consider price comparing: ${expensiveItems.map((i) => i.name).join(', ')}`,
    });
  }

  // Check for budget achievements
  const totalSpent = receipts.reduce((sum, r) => sum + r.total_amount, 0);
  const budgetUsage = (totalSpent / budget.amount) * 100;

  if (budgetUsage < 50) {
    insights.push({
      type: 'achievement',
      title: 'Great budgeting!',
      description: `You've only used ${budgetUsage.toFixed(0)}% of your budget`,
    });
  }

  // Check for frequent purchases
  const itemFrequency: Record<string, number> = {};
  items.forEach((item) => {
    const name = item.name.toLowerCase();
    itemFrequency[name] = (itemFrequency[name] || 0) + 1;
  });

  const frequentItems = Object.entries(itemFrequency)
    .filter(([, count]) => count >= 5)
    .map(([name]) => name);

  if (frequentItems.length > 0) {
    insights.push({
      type: 'tip',
      title: 'Frequent purchases',
      description: `Consider buying in bulk: ${frequentItems.slice(0, 3).join(', ')}`,
    });
  }

  return insights;
}
