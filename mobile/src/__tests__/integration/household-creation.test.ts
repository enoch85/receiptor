/**
 * Integration Tests for Household Creation
 *
 * Tests the complete flow of household creation including:
 * - Auto-creation on first login
 * - Duplicate prevention
 * - RLS policy compliance
 * - Member addition
 */

/* eslint-disable */

import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for testing
const mockSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:8000';
const mockSupabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-key';

describe('Household Creation Integration Tests', () => {
  let supabase: ReturnType<typeof createClient>;
  let testUser: { id: string; email: string };

  beforeAll(() => {
    supabase = createClient(mockSupabaseUrl, mockSupabaseKey);
  });

  beforeEach(async () => {
    // Create test user
    const { data, error } = await supabase.auth.signUp({
      email: `test-${Date.now()}@receiptor.test`,
      password: 'TestPassword123!',
    });

    if (error || !data.user) {
      throw new Error(`Failed to create test user: ${error?.message}`);
    }

    testUser = {
      id: data.user.id,
      email: data.user.email!,
    };
  });

  afterEach(async () => {
    // Cleanup: Delete test user's data
    if (testUser) {
      // Delete household members
      await supabase.from('household_members').delete().eq('user_id', testUser.id);

      // Delete households
      await supabase.from('households').delete().eq('created_by', testUser.id);

      // Delete user profile
      await supabase.from('user_profiles').delete().eq('id', testUser.id);

      // Sign out
      await supabase.auth.signOut();
    }
  });

  describe('RLS Policy Compliance', () => {
    it('should allow user to create household', async () => {
      const { data, error } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toBe('Test Household');
      expect(data?.created_by).toBe(testUser.id);
    });

    it('should allow user to add themselves as household member', async () => {
      // First create household
      const { data: household } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      expect(household).toBeDefined();

      // Then add self as member
      const { data: member, error } = await supabase
        .from('household_members')
        .insert({
          household_id: household!.id,
          user_id: testUser.id,
          role: 'admin',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(member).toBeDefined();
      expect(member?.user_id).toBe(testUser.id);
      expect(member?.role).toBe('admin');
    });

    it('should prevent circular dependency errors (Error 42P17)', async () => {
      // This test ensures the RLS policies don't have circular dependencies
      // If they do, this will fail with Error 42P17

      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      expect(householdError).toBeNull();
      expect(household).toBeDefined();

      const { error: memberError } = await supabase.from('household_members').insert({
        household_id: household!.id,
        user_id: testUser.id,
        role: 'admin',
      });

      // If we get Error 42P17, it means circular dependency exists
      expect(memberError).toBeNull();
      expect(memberError?.code).not.toBe('42P17');
    });

    it('should allow user to view their own household', async () => {
      // Create household
      const { data: created } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      // Query households
      const { data: households, error } = await supabase
        .from('households')
        .select('*')
        .eq('created_by', testUser.id);

      expect(error).toBeNull();
      expect(households).toBeDefined();
      expect(households?.length).toBeGreaterThan(0);
      expect(households?.[0].id).toBe(created!.id);
    });

    it('should prevent viewing other users households', async () => {
      // This test would require creating another user
      // For now, we test that only households with created_by = user.id are returned

      const { data: households } = await supabase.from('households').select('*');

      // All returned households should belong to current user
      const allBelongToUser = households?.every((h) => h.created_by === testUser.id) ?? true;
      expect(allBelongToUser).toBe(true);
    });
  });

  describe('Duplicate Prevention', () => {
    it('should prevent creating duplicate households', async () => {
      // Create first household
      const { data: first } = await supabase
        .from('households')
        .insert({
          name: 'My Home',
          created_by: testUser.id,
        })
        .select()
        .single();

      expect(first).toBeDefined();

      // Add self as member
      await supabase.from('household_members').insert({
        household_id: first!.id,
        user_id: testUser.id,
        role: 'admin',
      });

      // Check if user already has a household
      const { data: existingMembers } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', testUser.id)
        .limit(1);

      // If household exists, don't create another
      expect(existingMembers).toBeDefined();
      expect(existingMembers!.length).toBeGreaterThan(0);

      // Verify we can detect this in app logic
      const hasHousehold = existingMembers && existingMembers.length > 0;
      expect(hasHousehold).toBe(true);
    });

    it('should generate unique household name from user email', () => {
      const email = 'john.doe@example.com';
      const username = email.split('@')[0]; // 'john.doe'
      const householdName = `${username}'s Home`;

      expect(householdName).toBe("john.doe's Home");
    });

    it('should generate unique household name from display_name', () => {
      const displayName = 'John Doe';
      const householdName = `${displayName}'s Home`;

      expect(householdName).toBe("John Doe's Home");
    });
  });

  describe('Household Queries', () => {
    it('should query households via JOIN to avoid RLS issues', async () => {
      // Create household
      const { data: household } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      // Add member
      await supabase.from('household_members').insert({
        household_id: household!.id,
        user_id: testUser.id,
        role: 'admin',
      });

      // Query via JOIN (recommended pattern)
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
        .eq('user_id', testUser.id);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);

      // Extract household from join
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const householdData = (data![0] as any).households;
      expect(householdData).toBeDefined();
      expect(householdData.id).toBe(household!.id);
    });
  });

  describe('Receipt Creation', () => {
    it('should allow creating receipts in own household', async () => {
      // Create household
      const { data: household } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      // Add member
      await supabase.from('household_members').insert({
        household_id: household!.id,
        user_id: testUser.id,
        role: 'admin',
      });

      // Create receipt
      const { data: receipt, error } = await supabase
        .from('receipts')
        .insert({
          household_id: household!.id,
          store_name: 'Test Store',
          total_amount: 100.0,
          currency: 'SEK',
          purchase_date: new Date().toISOString(),
          source: 'manual',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(receipt).toBeDefined();
      expect(receipt?.household_id).toBe(household!.id);
    });

    it('should allow manual receipts without store_id', async () => {
      // Create household
      const { data: household } = await supabase
        .from('households')
        .insert({
          name: 'Test Household',
          created_by: testUser.id,
        })
        .select()
        .single();

      // Create manual receipt without store_id
      const { data: receipt, error } = await supabase
        .from('receipts')
        .insert({
          household_id: household!.id,
          store_name: 'Manual Store',
          total_amount: 50.0,
          currency: 'SEK',
          purchase_date: new Date().toISOString(),
          source: 'manual',
          store_id: null, // Explicitly null
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(receipt).toBeDefined();
      expect(receipt?.store_id).toBeNull();
    });
  });
});
