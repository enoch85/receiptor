/**
 * Household Hook
 *
 * Manages household data and ensures user has a household.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '../services/supabase';

import { useAuth } from './useAuth';

interface Household {
  id: string;
  name: string;
  created_by: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface UseHouseholdReturn {
  household: Household | null;
  householdId: string | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createHousehold: (name: string) => Promise<void>;
}

/**
 * Hook to get user's household
 */
export function useHousehold(): UseHouseholdReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's households
  const {
    data: households,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['households', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('household_members')
        .select(
          `
          household_id,
          households (
            id,
            name,
            created_by,
            settings,
            created_at,
            updated_at
          )
        `
        )
        .eq('user_id', user.id);

      if (error) throw error;

      // Extract households from the join result
      return (data || [])
        .map((item) => (item as unknown as { households: Household }).households)
        .filter(Boolean) as Household[];
    },
    enabled: !!user,
    retry: 1,
  });

  // Create household mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('User not authenticated');

      // Create household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({
          name,
          created_by: user.id,
        })
        .select()
        .single();

      if (householdError) throw householdError;

      // Add user as admin member
      const { error: memberError } = await supabase.from('household_members').insert({
        household_id: household.id,
        user_id: user.id,
        role: 'admin',
      });

      if (memberError) throw memberError;

      return household;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households', user?.id] });
    },
    retry: false,
  });

  const household = households?.[0] || null;
  const householdId = household?.id || null;

  return {
    household,
    householdId,
    isLoading: isLoading || createMutation.isPending,
    isError: isError || createMutation.isError,
    error: (error || createMutation.error) as Error | null,
    createHousehold: async (name: string) => {
      await createMutation.mutateAsync(name);
    },
  };
}
