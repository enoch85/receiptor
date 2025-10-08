/**
 * App Constants
 *
 * Centralized constants used throughout the application.
 */

export const APP_NAME = 'Receiptor';
export const APP_TAGLINE = 'The smart receipt tracker for households';

/**
 * API Configuration
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: '@receiptor/user_preferences',
  ONBOARDING_COMPLETE: '@receiptor/onboarding_complete',
  SELECTED_HOUSEHOLD: '@receiptor/selected_household',
} as const;

/**
 * Screen Names (for type-safe navigation)
 */
export const SCREENS = {
  // Auth
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  FORGOT_PASSWORD: 'ForgotPassword',
  ONBOARDING: 'Onboarding',

  // Main
  DASHBOARD: 'Dashboard',
  RECEIPTS: 'Receipts',
  RECEIPT_DETAIL: 'ReceiptDetail',
  RECEIPT_CAPTURE: 'ReceiptCapture',
  BUDGETS: 'Budgets',
  BUDGET_DETAIL: 'BudgetDetail',
  ANALYTICS: 'Analytics',
  HOUSEHOLD: 'Household',
  HOUSEHOLD_SETTINGS: 'HouseholdSettings',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
} as const;

/**
 * Default Values
 */
export const DEFAULTS = {
  CURRENCY: 'SEK',
  LANGUAGE: 'en',
  ITEMS_PER_PAGE: 20,
  MAX_HOUSEHOLD_MEMBERS_FREE: 3,
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_HOUSEHOLD_NAME_LENGTH: 50,
  MAX_RECEIPT_NOTE_LENGTH: 500,
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  PREMIUM_REQUIRED: {
    UNLIMITED_MEMBERS: true,
    ADVANCED_ANALYTICS: true,
    CARBON_TRACKING: true,
    EXPORT_DATA: true,
  },
} as const;
