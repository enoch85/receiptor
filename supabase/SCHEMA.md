# Receiptor Database Schema Documentation

## Overview

The Receiptor database is built on PostgreSQL via Supabase. It uses Row Level Security (RLS) for data isolation and supports real-time subscriptions.

## Key Design Principles

1. **Multi-tenancy via Households** - All data is scoped to households
2. **Row Level Security** - Users can only access data they're authorized to see
3. **Audit Trails** - All tables have `created_at` and `updated_at` timestamps
4. **Soft Deletes** - Use CASCADE deletes carefully, prefer status flags where needed
5. **Performance** - Strategic indexes on frequently queried columns
6. **Type Safety** - Use enums and constraints for data integrity

## Entity Relationship Diagram

```
Users (Supabase Auth)
  ↓
UserProfiles
  ↓
HouseholdMembers ← → Households
  ↓                      ↓
StoreConnections      Budgets
  ↓                      ↓
Receipts           Categories
  ↓
ReceiptItems
```

## Core Tables

### 1. user_profiles

Extended user information beyond Supabase Auth.

**Columns:**

- `id` (UUID, PK, FK to auth.users)
- `display_name` (TEXT)
- `avatar_url` (TEXT)
- `language` (VARCHAR(10)) - 'en', 'sv', 'da', etc.
- `currency` (VARCHAR(3)) - 'SEK', 'USD', etc.
- `country` (VARCHAR(2)) - ISO 3166-1
- `created_at`, `updated_at` (TIMESTAMP)

**RLS:** Users can only see/edit their own profile.

### 2. households

The core multi-user entity.

**Columns:**

- `id` (UUID, PK)
- `name` (TEXT) - "Smith Family", "Apartment 4B"
- `created_by` (UUID, FK to users)
- `settings` (JSONB) - Budget settings, preferences
- `created_at`, `updated_at` (TIMESTAMP)

**RLS:** Users can see households they're members of. Admins can edit.

### 3. household_members

Junction table for household membership.

**Columns:**

- `id` (UUID, PK)
- `household_id` (UUID, FK to households)
- `user_id` (UUID, FK to users)
- `role` (VARCHAR) - 'admin', 'member', 'viewer'
- `joined_at`, `created_at`, `updated_at` (TIMESTAMP)

**Unique Constraint:** (household_id, user_id)

**Roles:**

- `admin`: Full control (invite, remove members, delete household)
- `member`: Can add receipts, view all data
- `viewer`: Read-only access

**RLS:** Members can see other members. Admins can add/remove.

### 4. household_invitations

Pending invitations to join households.

**Columns:**

- `id` (UUID, PK)
- `household_id` (UUID, FK)
- `invited_by` (UUID, FK to users)
- `email` (TEXT)
- `role` (VARCHAR)
- `token` (TEXT, UNIQUE) - Random invitation token
- `status` (VARCHAR) - 'pending', 'accepted', 'declined', 'expired'
- `expires_at` (TIMESTAMP) - Default 7 days
- `created_at`, `updated_at` (TIMESTAMP)

**Workflow:**

1. Admin invites user by email
2. Email sent with unique token link
3. Invitee clicks link, accepts/declines
4. On accept, `household_member` record created

### 5. store_connections

Connected grocery store accounts.

**Columns:**

- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `household_id` (UUID, FK to households)
- `store_id` (VARCHAR) - 'ica', 'coop', etc.
- `store_name` (TEXT)
- `auth_type` (VARCHAR) - 'oauth' or 'scraping'
- `access_token` (TEXT) - **ENCRYPTED**
- `refresh_token` (TEXT) - **ENCRYPTED**
- `expires_at` (TIMESTAMP)
- `last_sync` (TIMESTAMP)
- `status` (VARCHAR) - 'active', 'error', 'expired'
- `error_message` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**Security:**

- Tokens are encrypted at application level before storage
- Use `pgcrypto` extension for encryption
- Never expose tokens in API responses

**Sync Strategy:**

- Background job runs every 6 hours
- Fetches new receipts since `last_sync`
- Updates `last_sync` on success
- Sets status to 'error' on failure

### 6. receipts

Grocery receipts (automatic or manual).

**Columns:**

- `id` (UUID, PK)
- `household_id` (UUID, FK to households)
- `store_connection_id` (UUID, FK, nullable)
- `store_id` (VARCHAR)
- `store_name` (TEXT)
- `store_location` (TEXT, optional)
- `purchase_date` (DATE)
- `total_amount` (DECIMAL(10,2))
- `currency` (VARCHAR(3))
- `receipt_number` (TEXT, optional)
- `raw_data` (JSONB) - Original API response
- `image_url` (TEXT) - For manual receipts
- `source` (VARCHAR) - 'automatic' or 'manual'
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes:**

- (household_id, purchase_date DESC) - For dashboard queries
- (store_id, purchase_date DESC) - For store analytics

### 7. receipt_items

Individual items on receipts.

**Columns:**

- `id` (UUID, PK)
- `receipt_id` (UUID, FK to receipts)
- `name` (TEXT) - Product name
- `quantity` (DECIMAL(10,3))
- `unit` (VARCHAR) - 'kg', 'pcs', 'L'
- `unit_price` (DECIMAL(10,2))
- `total_price` (DECIMAL(10,2))
- `category` (VARCHAR) - See categories below
- `subcategory` (VARCHAR, optional)
- `is_organic` (BOOLEAN)
- `carbon_score` (INTEGER) - grams of CO2e
- `metadata` (JSONB) - Additional data
- `created_at`, `updated_at` (TIMESTAMP)

**Categories:**

1. `fruits_vegetables`
2. `meat_fish`
3. `dairy_eggs`
4. `bread_bakery`
5. `pantry`
6. `frozen`
7. `beverages`
8. `snacks_candy`
9. `alcohol`
10. `household`
11. `personal_care`
12. `baby_kids`
13. `pet_supplies`
14. `other`

**Categorization:**

- Automatic via AI (OpenAI GPT-4)
- Users can correct category
- System learns from corrections

### 8. budgets

Household budgets (overall or category-specific).

**Columns:**

- `id` (UUID, PK)
- `household_id` (UUID, FK)
- `name` (TEXT) - "Monthly Groceries"
- `amount` (DECIMAL(10,2))
- `period` (VARCHAR) - 'weekly', 'monthly', 'yearly'
- `start_date` (DATE)
- `category` (VARCHAR, nullable) - NULL = overall budget
- `is_active` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

**Use Cases:**

- Overall monthly budget: `category = NULL`
- Category budget: "Meat & Fish max 1000 SEK/month"
- Multiple budgets per household supported

### 9. categories

Custom categories (household-specific or global).

**Columns:**

- `id` (UUID, PK)
- `household_id` (UUID, FK, nullable) - NULL = global
- `name` (TEXT)
- `parent_category` (UUID, FK to categories, nullable)
- `color` (VARCHAR(7)) - Hex color #RRGGBB
- `icon` (TEXT)
- `is_system` (BOOLEAN) - System categories can't be deleted
- `created_at`, `updated_at` (TIMESTAMP)

**System Categories:**

- Pre-defined 14 categories (see above)
- Cannot be deleted
- Households can create custom categories

### 10. subscriptions

Premium subscriptions (Stripe).

**Columns:**

- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `stripe_customer_id` (TEXT, UNIQUE)
- `stripe_subscription_id` (TEXT, UNIQUE)
- `status` (VARCHAR) - 'active', 'canceled', 'past_due', 'trialing'
- `plan` (VARCHAR) - 'monthly', 'yearly'
- `current_period_start` (TIMESTAMP)
- `current_period_end` (TIMESTAMP)
- `cancel_at_period_end` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

**Webhook Integration:**

- Stripe webhooks update subscription status
- Edge Function handles webhook events

### 11. analytics_cache

Pre-calculated analytics for performance.

**Columns:**

- `id` (UUID, PK)
- `household_id` (UUID, FK)
- `metric_type` (VARCHAR) - 'monthly_total', 'category_breakdown'
- `period` (DATE) - First day of period
- `data` (JSONB) - Calculated metrics
- `created_at`, `updated_at` (TIMESTAMP)

**Unique Constraint:** (household_id, metric_type, period)

**Workflow:**

1. Daily scheduled job calculates analytics
2. Stores in cache for fast retrieval
3. Invalidated when new receipts added
4. Falls back to real-time calculation if cache miss

## Row Level Security (RLS)

All tables have RLS enabled. Key policies:

### Users can only access their households

```sql
-- Example: Receipts policy
CREATE POLICY "Users can view household receipts"
ON receipts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM household_members
    WHERE household_id = receipts.household_id
    AND user_id = auth.uid()
  )
);
```

### Role-based permissions

- **Admins:** Full CRUD on household data
- **Members:** Read all, create receipts, update own connections
- **Viewers:** Read-only

See `supabase/migrations/20251008000001_rls_policies.sql` for complete policies.

## Indexes

Strategic indexes for common queries:

```sql
-- Dashboard: Recent receipts
idx_receipts_household_date (household_id, purchase_date DESC)

-- Analytics: Category breakdown
idx_receipt_items_category (category)

-- Member lookup
idx_household_members_user (user_id)
```

## Performance Considerations

1. **Pagination:** Always paginate receipt lists (default 20 per page)
2. **Analytics Cache:** Use pre-calculated analytics for dashboards
3. **Indexes:** All FK columns and commonly filtered fields are indexed
4. **JSONB:** Use JSONB for flexible metadata, but avoid deep nesting

## Backup & Recovery

- Supabase handles automated backups
- Point-in-time recovery available
- Export via `pg_dump` for additional safety

## Migration Strategy

1. Create migration: `supabase migration new <name>`
2. Test locally: `supabase db reset`
3. Review changes: `supabase db diff`
4. Deploy: `supabase db push`

## Security Checklist

✅ RLS enabled on all tables  
✅ Tokens encrypted before storage  
✅ No direct user_id exposure (use auth.uid())  
✅ Input validation via constraints  
✅ Rate limiting on API (Supabase default)  
✅ CORS configured for known origins

## Questions & Support

See [Supabase Documentation](https://supabase.com/docs) or contact the team.
