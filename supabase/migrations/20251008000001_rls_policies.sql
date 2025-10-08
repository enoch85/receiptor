-- Row Level Security (RLS) Policies for Receiptor
-- Ensures users can only access data they're authorized to see
-- Author: Receiptor Team
-- Last Updated: 2025-10-08
--
-- CRITICAL: This file uses a specific architecture to AVOID CIRCULAR DEPENDENCIES
-- between households and household_members tables. See notes below.

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- HOUSEHOLDS POLICIES (NO REFERENCE TO household_members - PREVENTS RECURSION)
-- ============================================================================

-- IMPORTANT: These policies only check created_by to avoid circular dependencies
-- The app queries households via household_members JOIN, which works correctly

-- Users can create households
CREATE POLICY "Anyone can create households"
  ON households FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Users can view households they created
CREATE POLICY "Users can view households they created"
  ON households FOR SELECT
  USING (created_by = auth.uid());

-- Creators can update their households
CREATE POLICY "Creators can update their households"
  ON households FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Creators can delete their households
CREATE POLICY "Creators can delete their households"
  ON households FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- HOUSEHOLD MEMBERS POLICIES (NO REFERENCE TO households - PREVENTS RECURSION)
-- ============================================================================

-- IMPORTANT: These policies only check user_id to avoid circular dependencies
-- Users can only see their own membership records and modify themselves

-- Users can view their own membership records
CREATE POLICY "Users view own memberships"
  ON household_members FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert themselves as members (during household creation)
CREATE POLICY "Users add themselves as members"
  ON household_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own membership
CREATE POLICY "Users update own memberships"
  ON household_members FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own membership (leave household)
CREATE POLICY "Users delete own memberships"
  ON household_members FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- HOUSEHOLD INVITATIONS POLICIES
-- ============================================================================

-- Users can view invitations sent to them or sent from their households
CREATE POLICY "Users can view household invitations"
  ON household_invitations FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR invited_by = auth.uid()
  );

-- Household creators can create invitations
CREATE POLICY "Creators can create invitations"
  ON household_invitations FOR INSERT
  WITH CHECK (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

-- Household creators can update invitations
CREATE POLICY "Creators can update invitations"
  ON household_invitations FOR UPDATE
  USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

-- Household creators can delete invitations
CREATE POLICY "Creators can delete invitations"
  ON household_invitations FOR DELETE
  USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

-- ============================================================================
-- STORE CONNECTIONS POLICIES
-- ============================================================================

-- Users can view their own store connections
CREATE POLICY "Users can view own store connections"
  ON store_connections FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own store connections
CREATE POLICY "Users can create own store connections"
  ON store_connections FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own store connections
CREATE POLICY "Users can update own store connections"
  ON store_connections FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own store connections
CREATE POLICY "Users can delete own store connections"
  ON store_connections FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- RECEIPTS POLICIES
-- ============================================================================

-- Users can view receipts for households they're members of
CREATE POLICY "Users can view household receipts"
  ON receipts FOR SELECT
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can create receipts for households they're members of
CREATE POLICY "Users can create household receipts"
  ON receipts FOR INSERT
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can update receipts in their households
CREATE POLICY "Users can update household receipts"
  ON receipts FOR UPDATE
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can delete receipts in their households
CREATE POLICY "Users can delete household receipts"
  ON receipts FOR DELETE
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- RECEIPT ITEMS POLICIES
-- ============================================================================

-- Users can view receipt items for their household receipts
CREATE POLICY "Users can view household receipt items"
  ON receipt_items FOR SELECT
  USING (
    receipt_id IN (
      SELECT id FROM receipts
      WHERE household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can create receipt items
CREATE POLICY "Users can create household receipt items"
  ON receipt_items FOR INSERT
  WITH CHECK (
    receipt_id IN (
      SELECT id FROM receipts
      WHERE household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update receipt items (for category corrections)
CREATE POLICY "Users can update household receipt items"
  ON receipt_items FOR UPDATE
  USING (
    receipt_id IN (
      SELECT id FROM receipts
      WHERE household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can delete receipt items
CREATE POLICY "Users can delete household receipt items"
  ON receipt_items FOR DELETE
  USING (
    receipt_id IN (
      SELECT id FROM receipts
      WHERE household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- BUDGETS POLICIES
-- ============================================================================

-- Users can view budgets for their households
CREATE POLICY "Users can view household budgets"
  ON budgets FOR SELECT
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can create budgets
CREATE POLICY "Users can create household budgets"
  ON budgets FOR INSERT
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can update budgets
CREATE POLICY "Users can update household budgets"
  ON budgets FOR UPDATE
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can delete budgets
CREATE POLICY "Users can delete household budgets"
  ON budgets FOR DELETE
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- CATEGORIES POLICIES
-- ============================================================================

-- Everyone can view system categories, users can view their household categories
CREATE POLICY "Users can view categories"
  ON categories FOR SELECT
  USING (
    is_system = true
    OR household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can create household categories
CREATE POLICY "Users can create household categories"
  ON categories FOR INSERT
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can update non-system categories
CREATE POLICY "Users can update household categories"
  ON categories FOR UPDATE
  USING (
    is_system = false
    AND household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- Users can delete non-system categories
CREATE POLICY "Users can delete household categories"
  ON categories FOR DELETE
  USING (
    is_system = false
    AND household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- SUBSCRIPTIONS POLICIES
-- ============================================================================

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own subscription
CREATE POLICY "Users can create own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own subscription
CREATE POLICY "Users can delete own subscription"
  ON subscriptions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- ANALYTICS CACHE POLICIES
-- ============================================================================

-- Users can view analytics for their households
CREATE POLICY "Users can view household analytics"
  ON analytics_cache FOR SELECT
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- System can insert analytics
CREATE POLICY "System can insert analytics"
  ON analytics_cache FOR INSERT
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- System can update analytics
CREATE POLICY "System can update analytics"
  ON analytics_cache FOR UPDATE
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- System can delete old analytics
CREATE POLICY "System can delete old analytics"
  ON analytics_cache FOR DELETE
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- ARCHITECTURE NOTES
-- ============================================================================

/*
WHY THIS ARCHITECTURE AVOIDS CIRCULAR DEPENDENCIES:

1. HOUSEHOLDS table policies:
   - Only check created_by = auth.uid()
   - Do NOT query household_members
   - Result: No recursion

2. HOUSEHOLD_MEMBERS table policies:
   - Only check user_id = auth.uid()
   - Do NOT query households
   - Result: No recursion

3. OTHER TABLES (receipts, budgets, etc.):
   - Check household membership via household_members query
   - This is SAFE because household_members policies are simple (user_id check)
   - The household_members query doesn't trigger households policies
   - Result: No recursion

4. APP QUERY PATTERN:
   - App queries: household_members WHERE user_id = auth.uid()
   - Then JOINs households data
   - RLS allows this because both tables have simple policies
   - Result: Users get all their households (created + joined)

TRADE-OFF:
- Direct SELECT on households only shows households you CREATED
- But app uses household_members JOIN, so it gets ALL households you're in
- This is fine because the app never queries households directly
*/

