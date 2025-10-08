# Supabase Production Setup Instructions

## Quick Setup (5 minutes)

### 1. Run Database Migrations

Go to your Supabase project: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor

#### Step 1: Run Initial Schema

1. Click on **SQL Editor** in the left sidebar (looks like `</>`)
2. Click **"+ New Query"**
3. Copy the entire content from `/workspaces/receiptor/supabase/migrations/20251008000000_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)

Wait for "Success" message.

#### Step 2: Run RLS Policies

1. Click **"+ New Query"** again
2. Copy the entire content from `/workspaces/receiptor/supabase/migrations/20251008000001_rls_policies.sql`
3. Paste it into the SQL editor
4. Click **"Run"**

Wait for "Success" message.

#### Step 3: Run Seed Data (Optional)

1. Click **"+ New Query"** again
2. Copy the entire content from `/workspaces/receiptor/supabase/migrations/20251008000002_seed_data.sql`
3. Paste it into the SQL editor
4. Click **"Run"**

---

## Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see all these tables:
   - user_profiles
   - households
   - household_members
   - household_invitations
   - store_connections
   - receipts
   - receipt_items
   - budgets
   - categories
   - subscriptions
   - analytics_cache

---

## What's Next

Once migrations are complete:

1. Reload the Expo Go app on your phone
2. You should see the login screen
3. Sign up works correctly
4. APK build will work with the same credentials

---

## Your Production Credentials

**Project URL:** https://YOUR_PROJECT_ID.supabase.co
**Anon Key:** YOUR_ANON_KEY_HERE

These are configured in:

- `/workspaces/receiptor/mobile/.env`
- `/workspaces/receiptor/mobile/eas.json` for APK builds
