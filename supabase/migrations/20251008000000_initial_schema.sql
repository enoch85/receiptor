-- Receiptor Database Schema
-- Complete schema for the Receiptor grocery budget tracking app
-- Author: Receiptor Team
-- Last Updated: 2025-10-08

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USER PROFILES
-- ============================================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'sv', 'da', 'no', 'de', 'fr', 'es')),
  currency VARCHAR(3) DEFAULT 'SEK' CHECK (currency IN ('SEK', 'DKK', 'NOK', 'EUR', 'USD', 'GBP')),
  country VARCHAR(2), -- ISO 3166-1 alpha-2
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HOUSEHOLDS
-- ============================================================================

-- Households table
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  settings JSONB DEFAULT '{
    "currency": "SEK",
    "notifications_enabled": true,
    "budget_alerts": {
      "enabled": true,
      "thresholds": [50, 80, 100]
    }
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Household members (junction table)
CREATE TABLE IF NOT EXISTS household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- Household invitations
CREATE TABLE IF NOT EXISTS household_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apply triggers to households
CREATE TRIGGER update_households_updated_at
  BEFORE UPDATE ON households
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_household_members_updated_at
  BEFORE UPDATE ON household_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_household_invitations_updated_at
  BEFORE UPDATE ON household_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORE CONNECTIONS
-- ============================================================================

-- Store connections
CREATE TABLE IF NOT EXISTS store_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  store_id VARCHAR(50) NOT NULL, -- 'ica', 'coop', 'willys', etc.
  store_name TEXT NOT NULL,
  auth_type VARCHAR(20) NOT NULL CHECK (auth_type IN ('oauth', 'scraping')),
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  expires_at TIMESTAMP WITH TIME ZONE,
  last_sync TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'error', 'expired')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_store_connections_updated_at
  BEFORE UPDATE ON store_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RECEIPTS
-- ============================================================================

-- Receipts
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  store_connection_id UUID REFERENCES store_connections(id) ON DELETE SET NULL,
  store_id VARCHAR(50) NOT NULL,
  store_name TEXT NOT NULL,
  store_location TEXT,
  purchase_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  currency VARCHAR(3) DEFAULT 'SEK' CHECK (currency IN ('SEK', 'DKK', 'NOK', 'EUR', 'USD', 'GBP')),
  receipt_number TEXT,
  raw_data JSONB, -- original receipt data from API
  image_url TEXT, -- for manual receipts
  source VARCHAR(20) NOT NULL CHECK (source IN ('automatic', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipt items
CREATE TABLE IF NOT EXISTS receipt_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit VARCHAR(20), -- 'kg', 'pcs', 'liters', etc.
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'fruits_vegetables',
    'meat_fish',
    'dairy_eggs',
    'bread_bakery',
    'pantry',
    'frozen',
    'beverages',
    'snacks_candy',
    'alcohol',
    'household',
    'personal_care',
    'baby_kids',
    'pet_supplies',
    'other'
  )),
  subcategory VARCHAR(50),
  is_organic BOOLEAN DEFAULT FALSE,
  carbon_score INTEGER, -- grams of CO2e
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apply triggers to receipts
CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipt_items_updated_at
  BEFORE UPDATE ON receipt_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BUDGETS
-- ============================================================================

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date DATE DEFAULT CURRENT_DATE,
  category VARCHAR(50) CHECK (category IN (
    'fruits_vegetables',
    'meat_fish',
    'dairy_eggs',
    'bread_bakery',
    'pantry',
    'frozen',
    'beverages',
    'snacks_candy',
    'alcohol',
    'household',
    'personal_care',
    'baby_kids',
    'pet_supplies',
    'other'
  )), -- NULL means overall budget
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CATEGORIES (for customization)
-- ============================================================================

-- Categories (allows households to customize categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE, -- NULL = global category
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  parent_category UUID REFERENCES categories(id) ON DELETE SET NULL,
  color VARCHAR(7), -- hex color #RRGGBB
  icon TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- system categories can't be deleted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SUBSCRIPTIONS (Premium)
-- ============================================================================

-- Premium subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ANALYTICS CACHE (for performance)
-- ============================================================================

-- Analytics cache (pre-calculated statistics)
CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'monthly_total', 'category_breakdown', etc.
  period DATE NOT NULL, -- first day of period
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, metric_type, period)
);

CREATE TRIGGER update_analytics_cache_updated_at
  BEFORE UPDATE ON analytics_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON user_profiles(country);

-- Households
CREATE INDEX IF NOT EXISTS idx_households_created_by ON households(created_by);
CREATE INDEX IF NOT EXISTS idx_household_members_user ON household_members(user_id);
CREATE INDEX IF NOT EXISTS idx_household_members_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_invitations_email ON household_invitations(email);
CREATE INDEX IF NOT EXISTS idx_household_invitations_token ON household_invitations(token);

-- Store connections
CREATE INDEX IF NOT EXISTS idx_store_connections_user ON store_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_store_connections_household ON store_connections(household_id);
CREATE INDEX IF NOT EXISTS idx_store_connections_status ON store_connections(status) WHERE status = 'active';

-- Receipts
CREATE INDEX IF NOT EXISTS idx_receipts_household_date ON receipts(household_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_store_date ON receipts(store_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_category ON receipt_items(category);

-- Budgets
CREATE INDEX IF NOT EXISTS idx_budgets_household_active ON budgets(household_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category) WHERE category IS NOT NULL;

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status) WHERE status = 'active';

-- Analytics cache
CREATE INDEX IF NOT EXISTS idx_analytics_cache_lookup ON analytics_cache(household_id, metric_type, period);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_profiles IS 'Extended user profiles with preferences';
COMMENT ON TABLE households IS 'Households for multi-user grocery tracking';
COMMENT ON TABLE household_members IS 'Members belonging to households with role-based permissions';
COMMENT ON TABLE household_invitations IS 'Pending invitations to join households';
COMMENT ON TABLE store_connections IS 'Connected grocery store accounts (OAuth or scraping)';
COMMENT ON TABLE receipts IS 'Grocery receipts (automatic or manual)';
COMMENT ON TABLE receipt_items IS 'Line items from receipts with categorization';
COMMENT ON TABLE budgets IS 'Household budgets (overall or category-specific)';
COMMENT ON TABLE categories IS 'Custom categories (household-specific or global)';
COMMENT ON TABLE subscriptions IS 'Premium subscription status (Stripe)';
COMMENT ON TABLE analytics_cache IS 'Pre-calculated analytics for performance';
