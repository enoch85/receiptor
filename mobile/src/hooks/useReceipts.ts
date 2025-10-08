/**
 * Receipt Data Hooks
 *
 * Custom hooks for fetching and managing receipts using React Query
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Receipt } from '@receiptor/shared';

/**
 * Fetch receipts for a household with pagination
 */
interface FetchReceiptsOptions {
  householdId: string;
  page?: number;
  limit?: number;
  searchQuery?: string;
  storeFilter?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ReceiptsResponse {
  receipts: Receipt[];
  total: number;
  hasMore: boolean;
}

async function fetchReceipts({
  householdId,
  page = 0,
  limit = 20,
  searchQuery,
  storeFilter,
  dateFrom,
  dateTo,
}: FetchReceiptsOptions): Promise<ReceiptsResponse> {
  // Build query
  let query = supabase
    .from('receipts')
    .select('*, receipt_items(*)', { count: 'exact' })
    .eq('household_id', householdId)
    .order('purchase_date', { ascending: false });

  // Apply filters
  if (searchQuery) {
    // Search in store name
    query = query.ilike('store_name', `%${searchQuery}%`);
  }

  if (storeFilter) {
    query = query.eq('store_name', storeFilter);
  }

  if (dateFrom) {
    query = query.gte('purchase_date', dateFrom.toISOString());
  }

  if (dateTo) {
    query = query.lte('purchase_date', dateTo.toISOString());
  }

  // Apply pagination
  const from = page * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch receipts: ${error.message}`);
  }

  // Transform data to match Receipt type
  const receipts: Receipt[] = (data ?? []).map((row) => ({
    id: row.id,
    household_id: row.household_id,
    store_connection_id: row.store_connection_id,
    store_id: row.store_id,
    store_name: row.store_name,
    store_location: row.store_location,
    purchase_date: new Date(row.purchase_date),
    total_amount: row.total_amount,
    currency: row.currency,
    receipt_number: row.receipt_number,
    raw_data: row.raw_data,
    image_url: row.image_url,
    source: row.source,
    items: (row.receipt_items ?? []).map((item: any) => ({
      id: item.id,
      receipt_id: item.receipt_id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      total_price: item.total_price,
      category: item.category,
      subcategory: item.subcategory,
      is_organic: item.is_organic,
      carbon_score: item.carbon_score,
      metadata: item.metadata,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    })),
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));

  return {
    receipts,
    total: count ?? 0,
    hasMore: (count ?? 0) > from + limit,
  };
}

/**
 * Hook to fetch receipts with pagination and filtering
 */
export function useReceipts(options: FetchReceiptsOptions) {
  return useQuery({
    queryKey: ['receipts', options],
    queryFn: () => fetchReceipts(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!options.householdId,
  });
}

/**
 * Delete a receipt
 */
async function deleteReceipt(receiptId: string): Promise<void> {
  const { error } = await supabase
    .from('receipts')
    .delete()
    .eq('id', receiptId);

  if (error) {
    throw new Error(`Failed to delete receipt: ${error.message}`);
  }
}

/**
 * Hook to delete a receipt
 */
export function useDeleteReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReceipt,
    onSuccess: () => {
      // Invalidate and refetch receipts
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
}

/**
 * Fetch a single receipt by ID
 */
async function fetchReceipt(receiptId: string): Promise<Receipt> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*, receipt_items(*)')
    .eq('id', receiptId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch receipt: ${error.message}`);
  }

  if (!data) {
    throw new Error('Receipt not found');
  }

  // Transform data to match Receipt type
  const receipt: Receipt = {
    id: data.id,
    household_id: data.household_id,
    store_connection_id: data.store_connection_id,
    store_id: data.store_id,
    store_name: data.store_name,
    store_location: data.store_location,
    purchase_date: new Date(data.purchase_date),
    total_amount: data.total_amount,
    currency: data.currency,
    receipt_number: data.receipt_number,
    raw_data: data.raw_data,
    image_url: data.image_url,
    source: data.source,
    items: (data.receipt_items ?? []).map((item: any) => ({
      id: item.id,
      receipt_id: item.receipt_id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      total_price: item.total_price,
      category: item.category,
      subcategory: item.subcategory,
      is_organic: item.is_organic,
      carbon_score: item.carbon_score,
      metadata: item.metadata,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    })),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };

  return receipt;
}

/**
 * Hook to fetch a single receipt
 */
export function useReceipt(receiptId: string) {
  return useQuery({
    queryKey: ['receipt', receiptId],
    queryFn: () => fetchReceipt(receiptId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!receiptId,
  });
}

/**
 * Update a receipt item's category
 */
async function updateItemCategory(
  itemId: string,
  category: string
): Promise<void> {
  const { error } = await supabase
    .from('receipt_items')
    .update({ category })
    .eq('id', itemId);

  if (error) {
    throw new Error(`Failed to update item category: ${error.message}`);
  }
}

/**
 * Hook to update item category
 */
export function useUpdateItemCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, category }: { itemId: string; category: string }) =>
      updateItemCategory(itemId, category),
    onSuccess: () => {
      // Invalidate receipts and receipt queries
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['receipt'] });
    },
  });
}
