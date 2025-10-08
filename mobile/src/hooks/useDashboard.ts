/**
 * Dashboard Data Hooks
 *
 * Custom hooks for fetching and calculating dashboard statistics
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { supabase } from '../services/supabase';
import type { Receipt, ProductCategory } from '@receiptor/shared';

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  currentMonth: {
    totalSpent: number;
    receiptCount: number;
    avgPerReceipt: number;
    topStore: string | null;
    topCategory: ProductCategory | null;
  };
  lastMonth: {
    totalSpent: number;
    changePercent: number;
  };
  byCategory: Array<{
    category: ProductCategory;
    amount: number;
    percentage: number;
  }>;
  recentReceipts: Receipt[];
}

/**
 * Fetch dashboard statistics
 */
async function fetchDashboardStats(householdId: string): Promise<DashboardStats> {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Fetch current month receipts with items
  const { data: currentReceipts, error: currentError } = await supabase
    .from('receipts')
    .select('*, receipt_items(*)')
    .eq('household_id', householdId)
    .gte('purchase_date', currentMonthStart.toISOString())
    .lte('purchase_date', currentMonthEnd.toISOString())
    .order('purchase_date', { ascending: false });

  if (currentError) {
    throw new Error(`Failed to fetch current month receipts: ${currentError.message}`);
  }

  // Fetch last month total
  const { data: lastMonthReceipts, error: lastMonthError } = await supabase
    .from('receipts')
    .select('total_amount')
    .eq('household_id', householdId)
    .gte('purchase_date', lastMonthStart.toISOString())
    .lte('purchase_date', lastMonthEnd.toISOString());

  if (lastMonthError) {
    throw new Error(`Failed to fetch last month receipts: ${lastMonthError.message}`);
  }

  // Calculate current month stats
  const receipts = currentReceipts || [];
  const totalSpent = receipts.reduce((sum, r) => sum + r.total_amount, 0);
  const receiptCount = receipts.length;
  const avgPerReceipt = receiptCount > 0 ? totalSpent / receiptCount : 0;

  // Find top store
  const storeCount: Record<string, number> = {};
  receipts.forEach(r => {
    storeCount[r.store_name] = (storeCount[r.store_name] || 0) + 1;
  });
  const topStore = Object.entries(storeCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Calculate by category
  const categoryTotals: Record<string, number> = {};
  receipts.forEach(receipt => {
    (receipt.receipt_items || []).forEach((item: { category?: string; total_price: number }) => {
      const category = item.category || 'other';
      categoryTotals[category] = (categoryTotals[category] || 0) + item.total_price;
    });
  });

  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as ProductCategory || null;

  const byCategory = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as ProductCategory,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5 categories

  // Calculate last month comparison
  const lastMonthTotal = (lastMonthReceipts || [])
    .reduce((sum, r) => sum + r.total_amount, 0);
  
  const changePercent = lastMonthTotal > 0
    ? ((totalSpent - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  // Get recent receipts (last 5) - cast as Supabase types don't perfectly match
  const recentReceipts = receipts.slice(0, 5) as any as Receipt[];

  return {
    currentMonth: {
      totalSpent,
      receiptCount,
      avgPerReceipt,
      topStore,
      topCategory,
    },
    lastMonth: {
      totalSpent: lastMonthTotal,
      changePercent,
    },
    byCategory,
    recentReceipts,
  };
}

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats(householdId: string) {
  return useQuery({
    queryKey: ['dashboard-stats', householdId],
    queryFn: () => fetchDashboardStats(householdId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!householdId,
  });
}
