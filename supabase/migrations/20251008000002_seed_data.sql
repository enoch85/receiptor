-- Seed data for Receiptor development and testing
-- Creates sample households, receipts, and budgets
-- Author: Receiptor Team
-- Last Updated: 2025-10-08

-- ============================================================================
-- SEED SYSTEM CATEGORIES
-- ============================================================================

INSERT INTO categories (id, name, parent_category, color, icon, is_system) VALUES
  -- Main categories
  ('00000000-0000-0000-0000-000000000001', 'Fruits & Vegetables', NULL, '#4CAF50', '🥕', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'Meat & Fish', NULL, '#F44336', '🥩', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Dairy & Eggs', NULL, '#FFC107', '🥛', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'Bread & Bakery', NULL, '#FF9800', '🍞', TRUE),
  ('00000000-0000-0000-0000-000000000005', 'Pantry & Dry Goods', NULL, '#795548', '🥫', TRUE),
  ('00000000-0000-0000-0000-000000000006', 'Frozen Foods', NULL, '#2196F3', '❄️', TRUE),
  ('00000000-0000-0000-0000-000000000007', 'Beverages', NULL, '#00BCD4', '🥤', TRUE),
  ('00000000-0000-0000-0000-000000000008', 'Snacks & Candy', NULL, '#E91E63', '🍫', TRUE),
  ('00000000-0000-0000-0000-000000000009', 'Alcohol', NULL, '#9C27B0', '🍷', TRUE),
  ('00000000-0000-0000-0000-00000000000A', 'Household & Cleaning', NULL, '#607D8B', '🧼', TRUE),
  ('00000000-0000-0000-0000-00000000000B', 'Personal Care', NULL, '#3F51B5', '🧴', TRUE),
  ('00000000-0000-0000-0000-00000000000C', 'Baby & Kids', NULL, '#FFEB3B', '👶', TRUE),
  ('00000000-0000-0000-0000-00000000000D', 'Pet Supplies', NULL, '#8BC34A', '🐾', TRUE),
  ('00000000-0000-0000-0000-00000000000E', 'Other', NULL, '#9E9E9E', '📦', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Note: In production, we'll use Supabase Auth for real users
-- These test users would be created through the Supabase Auth system
-- For local testing, you'll need to create users manually

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE categories IS 'System categories are pre-defined and cannot be deleted by users';
