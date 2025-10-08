import { z } from 'zod';

/**
 * User role schema
 */
export const UserRoleSchema = z.enum(['admin', 'member', 'viewer']);

/**
 * Currency schema
 */
export const CurrencySchema = z.enum(['SEK', 'DKK', 'NOK', 'EUR', 'USD', 'GBP']);

/**
 * Locale schema
 */
export const LocaleSchema = z.enum(['en', 'sv', 'da', 'no', 'de', 'fr', 'es']);

/**
 * Product category schema
 */
export const ProductCategorySchema = z.enum([
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
  'other',
]);

/**
 * Create household schema
 */
export const CreateHouseholdSchema = z.object({
  name: z.string().min(1).max(100),
  monthly_budget: z.number().positive().optional(),
  currency: CurrencySchema.default('SEK'),
});

/**
 * Invite household member schema
 */
export const InviteHouseholdMemberSchema = z.object({
  email: z.string().email(),
  role: UserRoleSchema.default('member'),
});

/**
 * Create budget schema
 */
export const CreateBudgetSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  category: ProductCategorySchema.optional(),
  start_date: z.string().datetime().optional(),
});

/**
 * Manual receipt schema
 */
export const ManualReceiptSchema = z.object({
  store_name: z.string().min(1),
  store_location: z.string().optional(),
  purchase_date: z.string().datetime(),
  total_amount: z.number().positive(),
  currency: CurrencySchema,
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().positive(),
      unit: z.string().optional(),
      unit_price: z.number().positive(),
      total_price: z.number().positive(),
      category: ProductCategorySchema.optional(),
    })
  ),
});

/**
 * Update user profile schema
 */
export const UpdateUserProfileSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  language: LocaleSchema.optional(),
  currency: CurrencySchema.optional(),
  country: z.string().length(2).optional(),
});

/**
 * Date range query schema
 */
export const DateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Export inferred types
export type CreateHouseholdInput = z.infer<typeof CreateHouseholdSchema>;
export type InviteHouseholdMemberInput = z.infer<typeof InviteHouseholdMemberSchema>;
export type CreateBudgetInput = z.infer<typeof CreateBudgetSchema>;
export type ManualReceiptInput = z.infer<typeof ManualReceiptSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type DateRangeQuery = z.infer<typeof DateRangeSchema>;
export type PaginationQuery = z.infer<typeof PaginationSchema>;
