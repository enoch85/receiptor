-- Row Level Security (RLS) Policies for Receiptor
-- Ensures users can only access data they're authorized to see
-- Author: Receiptor Team
-- Last Updated: 2025-10-08

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
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if user is member of household
CREATE OR REPLACE FUNCTION is_household_member(household_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM household_members
    WHERE household_id = household_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin of household
CREATE OR REPLACE FUNCTION is_household_admin(household_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM household_members
    WHERE household_id = household_uuid
    AND user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's households
CREATE OR REPLACE FUNCTION get_user_households()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT household_id FROM household_members
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USER PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- HOUSEHOLDS POLICIES
-- ============================================================================

-- Users can view households they're members of
CREATE POLICY "Users can view own households"
  ON households FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_id = households.id
      AND user_id = auth.uid()
    )
  );

-- Users can create households
CREATE POLICY "Users can create households"
  ON households FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Admins can update their households
CREATE POLICY "Admins can update households"
  ON households FOR UPDATE
  USING (is_household_admin(id));

-- Admins can delete their households
CREATE POLICY "Admins can delete households"
  ON households FOR DELETE
  USING (is_household_admin(id));

-- ============================================================================
-- HOUSEHOLD MEMBERS POLICIES
-- ============================================================================

-- Users can view members of their households
CREATE POLICY "Users can view household members"
  ON household_members FOR SELECT
  USING (is_household_member(household_id));

-- Admins can add members to their households
CREATE POLICY "Admins can add household members"
  ON household_members FOR INSERT
  WITH CHECK (is_household_admin(household_id));

-- Admins can update member roles
CREATE POLICY "Admins can update member roles"
  ON household_members FOR UPDATE
  USING (is_household_admin(household_id));

-- Admins can remove members, or users can remove themselves
CREATE POLICY "Admins can remove members or users can leave"
  ON household_members FOR DELETE
  USING (
    is_household_admin(household_id)
    OR user_id = auth.uid()
  );

-- ============================================================================
-- HOUSEHOLD INVITATIONS POLICIES
-- ============================================================================

-- Users can view invitations for their households
CREATE POLICY "Users can view household invitations"
  ON household_invitations FOR SELECT
  USING (
    is_household_member(household_id)
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admins can create invitations
CREATE POLICY "Admins can create invitations"
  ON household_invitations FOR INSERT
  WITH CHECK (is_household_admin(household_id));

-- Admins can update invitations
CREATE POLICY "Admins can update invitations"
  ON household_invitations FOR UPDATE
  USING (is_household_admin(household_id));

-- Admins can delete invitations
CREATE POLICY "Admins can delete invitations"
  ON household_invitations FOR DELETE
  USING (is_household_admin(household_id));

-- ============================================================================
-- STORE CONNECTIONS POLICIES
-- ============================================================================

-- Users can view their own store connections
CREATE POLICY "Users can view own store connections"
  ON store_connections FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_household_member(household_id)
  );

-- Users can create their own store connections
CREATE POLICY "Users can create own store connections"
  ON store_connections FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND is_household_member(household_id)
  );

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

-- Users can view receipts for their households
CREATE POLICY "Users can view household receipts"
  ON receipts FOR SELECT
  USING (is_household_member(household_id));

-- Users can create receipts for their households
CREATE POLICY "Users can create household receipts"
  ON receipts FOR INSERT
  WITH CHECK (is_household_member(household_id));

-- Users can update receipts in their households (for manual edits)
CREATE POLICY "Users can update household receipts"
  ON receipts FOR UPDATE
  USING (is_household_member(household_id));

-- Admins can delete receipts
CREATE POLICY "Admins can delete receipts"
  ON receipts FOR DELETE
  USING (is_household_admin(household_id));

-- ============================================================================
-- RECEIPT ITEMS POLICIES
-- ============================================================================

-- Users can view receipt items for their household receipts
CREATE POLICY "Users can view household receipt items"
  ON receipt_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM receipts
      WHERE receipts.id = receipt_items.receipt_id
      AND is_household_member(receipts.household_id)
    )
  );

-- Users can create receipt items for their household receipts
CREATE POLICY "Users can create household receipt items"
  ON receipt_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM receipts
      WHERE receipts.id = receipt_items.receipt_id
      AND is_household_member(receipts.household_id)
    )
  );

-- Users can update receipt items (for category corrections)
CREATE POLICY "Users can update household receipt items"
  ON receipt_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM receipts
      WHERE receipts.id = receipt_items.receipt_id
      AND is_household_member(receipts.household_id)
    )
  );

-- Admins can delete receipt items
CREATE POLICY "Admins can delete receipt items"
  ON receipt_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM receipts
      WHERE receipts.id = receipt_items.receipt_id
      AND is_household_admin(receipts.household_id)
    )
  );

-- ============================================================================
-- BUDGETS POLICIES
-- ============================================================================

-- Users can view budgets for their households
CREATE POLICY "Users can view household budgets"
  ON budgets FOR SELECT
  USING (is_household_member(household_id));

-- Admins can create budgets
CREATE POLICY "Admins can create budgets"
  ON budgets FOR INSERT
  WITH CHECK (is_household_admin(household_id));

-- Admins can update budgets
CREATE POLICY "Admins can update budgets"
  ON budgets FOR UPDATE
  USING (is_household_admin(household_id));

-- Admins can delete budgets
CREATE POLICY "Admins can delete budgets"
  ON budgets FOR DELETE
  USING (is_household_admin(household_id));

-- ============================================================================
-- CATEGORIES POLICIES
-- ============================================================================

-- Users can view global categories and their household categories
CREATE POLICY "Users can view categories"
  ON categories FOR SELECT
  USING (
    household_id IS NULL -- global categories
    OR is_household_member(household_id)
  );

-- Admins can create household categories
CREATE POLICY "Admins can create household categories"
  ON categories FOR INSERT
  WITH CHECK (
    household_id IS NOT NULL
    AND is_household_admin(household_id)
  );

-- Admins can update non-system categories
CREATE POLICY "Admins can update household categories"
  ON categories FOR UPDATE
  USING (
    household_id IS NOT NULL
    AND is_household_admin(household_id)
    AND NOT is_system
  );

-- Admins can delete non-system categories
CREATE POLICY "Admins can delete household categories"
  ON categories FOR DELETE
  USING (
    household_id IS NOT NULL
    AND is_household_admin(household_id)
    AND NOT is_system
  );

-- ============================================================================
-- SUBSCRIPTIONS POLICIES
-- ============================================================================

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own subscription
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
  USING (is_household_member(household_id));

-- System can insert analytics
CREATE POLICY "System can insert analytics"
  ON analytics_cache FOR INSERT
  WITH CHECK (is_household_member(household_id));

-- System can update analytics
CREATE POLICY "System can update analytics"
  ON analytics_cache FOR UPDATE
  USING (is_household_member(household_id));

-- System can delete old analytics
CREATE POLICY "System can delete old analytics"
  ON analytics_cache FOR DELETE
  USING (is_household_member(household_id));

-- ============================================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION is_household_member IS 'Check if current user is member of specified household';
COMMENT ON FUNCTION is_household_admin IS 'Check if current user is admin of specified household';
COMMENT ON FUNCTION get_user_households IS 'Get all household IDs for current user';
