import type { UserRole, BudgetPeriod, ProductCategory, Currency, Locale } from './enums';

/**
 * Base database entity with timestamps
 */
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * User profile
 */
export interface UserProfile extends BaseEntity {
  display_name: string;
  avatar_url?: string;
  language: Locale;
  currency: Currency;
  country: string;
}

/**
 * Household
 */
export interface Household extends BaseEntity {
  name: string;
  created_by: string;
  settings: HouseholdSettings;
}

/**
 * Household settings
 */
export interface HouseholdSettings {
  monthly_budget?: number;
  currency: Currency;
  notifications_enabled: boolean;
  budget_alerts: {
    enabled: boolean;
    thresholds: number[]; // e.g., [50, 80, 100]
  };
}

/**
 * Household member
 */
export interface HouseholdMember extends BaseEntity {
  household_id: string;
  user_id: string;
  role: UserRole;
  joined_at: Date;
}

/**
 * Store connection
 */
export interface StoreConnection extends BaseEntity {
  user_id: string;
  household_id: string;
  store_id: string;
  store_name: string;
  auth_type: 'oauth' | 'scraping';
  access_token?: string; // encrypted
  refresh_token?: string; // encrypted
  expires_at?: Date;
  last_sync: Date;
  status: 'active' | 'error' | 'expired';
  error_message?: string;
}

/**
 * Receipt
 */
export interface Receipt extends BaseEntity {
  household_id: string;
  store_connection_id?: string;
  store_id: string;
  store_name: string;
  store_location?: string;
  purchase_date: Date;
  total_amount: number;
  currency: Currency;
  receipt_number?: string;
  raw_data?: Record<string, unknown>;
  image_url?: string;
  source: 'automatic' | 'manual';
  items: ReceiptItem[];
}

/**
 * Receipt item
 */
export interface ReceiptItem extends BaseEntity {
  receipt_id: string;
  name: string;
  quantity: number;
  unit?: string;
  unit_price: number;
  total_price: number;
  category: ProductCategory;
  subcategory?: string;
  is_organic: boolean;
  carbon_score?: number; // grams of CO2e
  metadata?: Record<string, unknown>;
}

/**
 * Budget
 */
export interface Budget extends BaseEntity {
  household_id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  start_date: Date;
  category?: ProductCategory;
  is_active: boolean;
}

/**
 * Budget progress calculation result
 */
export interface BudgetProgress {
  spent: number;
  budget: number;
  percentage: number;
  remaining: number;
  is_exceeded: boolean;
}

/**
 * Analytics data for a period
 */
export interface AnalyticsData {
  period: string; // ISO date string
  total_spent: number;
  receipt_count: number;
  by_category: Record<ProductCategory, number>;
  by_store: Record<string, number>;
  organic_spent: number;
  organic_percentage: number;
  carbon_footprint?: number;
}

/**
 * Subscription
 */
export interface Subscription extends BaseEntity {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: 'monthly' | 'yearly';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
}
