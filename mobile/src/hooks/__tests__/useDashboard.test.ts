/**
 * useDashboard Hook Tests
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useDashboardStats } from '../useDashboard';
import { supabase } from '../../services/supabase';

jest.mock('../../services/supabase');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useDashboardStats', () => {
  const mockHouseholdId = 'test-household-1';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch dashboard statistics', async () => {
    const mockData = [
      {
        id: '1',
        total_amount: 250,
        store_name: 'ICA',
        purchase_date: new Date().toISOString(),
        receipt_items: [
          { category: 'dairy_eggs', total_price: 50 },
          { category: 'meat_fish', total_price: 200 },
        ],
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const { result } = renderHook(() => useDashboardStats(mockHouseholdId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.currentMonth.totalSpent).toBeGreaterThan(0);
  });

  it('should handle empty receipts', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => useDashboardStats(mockHouseholdId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.currentMonth.totalSpent).toBe(0);
    expect(result.current.data?.currentMonth.receiptCount).toBe(0);
  });

  it('should handle API errors', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    });

    const { result } = renderHook(() => useDashboardStats(mockHouseholdId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
