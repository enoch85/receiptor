/**
 * User role in a household
 */
export type UserRole = 'admin' | 'member' | 'viewer';

/**
 * Receipt source type
 */
export type ReceiptSource = 'automatic' | 'manual';

/**
 * Receipt status
 */
export type ReceiptStatus = 'pending' | 'processed' | 'error';

/**
 * Store connection authentication type
 */
export type AuthType = 'oauth' | 'scraping';

/**
 * Store connection status
 */
export type ConnectionStatus = 'active' | 'error' | 'expired';

/**
 * Budget period
 */
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

/**
 * Subscription status
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

/**
 * Subscription plan
 */
export type SubscriptionPlan = 'monthly' | 'yearly';

/**
 * Currency code (ISO 4217)
 */
export type Currency = 'SEK' | 'DKK' | 'NOK' | 'EUR' | 'USD' | 'GBP';

/**
 * Supported locales
 */
export type Locale = 'en' | 'sv' | 'da' | 'no' | 'de' | 'fr' | 'es';

/**
 * Product categories
 */
export type ProductCategory =
  | 'fruits_vegetables'
  | 'meat_fish'
  | 'dairy_eggs'
  | 'bread_bakery'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'snacks_candy'
  | 'alcohol'
  | 'household'
  | 'personal_care'
  | 'baby_kids'
  | 'pet_supplies'
  | 'other';
