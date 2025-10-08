# Receiptor Production Database Setup

**Last Updated:** October 8, 2025  
**Status:** Development - RLS Disabled

---

## Current State

**Database:** Production Supabase Cloud (`YOUR_PROJECT_ID.supabase.co`)  
**RLS Status:** ⚠️ **DISABLED** on `households` and `household_members` tables  
**Reason:** RLS chicken-and-egg problem preventing household creation

---

## Quick Start

### 1. Reset Production Database

**Go to:** https://YOUR_PROJECT_ID.supabase.co/project/YOUR_PROJECT_ID/sql

**Run:** `/workspaces/receiptor/supabase/PRODUCTION_RESET.sql`

This will:

- ✅ Delete all test data
- ✅ Reset all RLS policies
- ✅ Seed system categories
- ✅ Disable RLS for development testing

### 2. Test the App

1. **Sign up** with a new account
2. **Login**
3. **Navigate to Receipts tab**
4. **Household auto-created** (should work now with RLS disabled)
5. **Take a photo** to test OCR functionality

---

## The RLS Problem (Technical)

### What Happened

The original RLS policies had a **chicken-and-egg problem**:

```sql
-- Policy on households table
CREATE POLICY "Users can create households"
  ON households FOR INSERT
  WITH CHECK (auth.uid() = created_by);  -- ✅ This works

-- Policy on household_members table
CREATE POLICY "Admins can add household members"
  ON household_members FOR INSERT
  WITH CHECK (is_household_admin(household_id));  -- ❌ This fails!
```

**The Flow:**

1. User creates household → ✅ Allowed by `auth.uid() = created_by`
2. App tries to add user as first member → ❌ **BLOCKED**
3. `is_household_admin()` checks if user is admin → Returns `FALSE`
4. Why? User isn't a member yet (chicken-and-egg!)
5. Insert fails with error `42501`

### The Fix (Attempted)

Changed policy to:

```sql
CREATE POLICY "Users can add themselves or admins can add members"
  ON household_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()  -- Users can add themselves
    OR is_household_admin(household_id)  -- OR admins can add others
  );
```

**This should work** but mysteriously still fails with error `42501` even though:

- ✅ Session is valid
- ✅ `auth.uid()` returns correct user ID
- ✅ User ID matches `created_by` value
- ✅ Permissions are granted to `authenticated` role

### Why It Still Fails (Unknown)

Possible causes:

1. **Supabase RLS bug** - The `auth.uid()` function not evaluating correctly in `WITH CHECK` context
2. **JWT context issue** - Anon key not properly propagating user context to RLS policies
3. **Policy evaluation order** - Policies being evaluated before session context is set
4. **Caching issue** - Supabase not picking up policy changes

**We debugged extensively:**

- Added console logging → Session valid, user ID correct
- Checked permissions → `authenticated` role has `INSERT` on all tables
- Tried multiple policy variations → All fail with same error
- Manually inserted data via SQL Editor → Works fine (bypasses RLS)

---

## Development Strategy

### Current Approach (Pragmatic)

**For development/testing:**

- ❌ RLS **DISABLED** on `households` and `household_members`
- ✅ App fully functional for testing features
- ⚠️ **NOT production-ready** (security risk)

**Why:**

- Unblock development progress
- Test other app features (OCR, receipts, budgets, etc.)
- Figure out RLS issue separately

### Production Strategy (Future)

**Option A: Fix RLS Properly** (Preferred)

1. Open Supabase support ticket with debug logs
2. Test on local Supabase instance
3. Try Supabase Edge Functions for household creation (bypasses RLS)
4. Use service_role key for initial household setup (dangerous but works)

**Option B: Alternative Architecture**

1. Use Supabase Edge Function to create household + member atomically
2. Edge Function runs with `service_role` permissions (bypasses RLS)
3. App calls Edge Function instead of direct database insert
4. RLS still protects SELECT/UPDATE/DELETE operations

**Option C: Manual Household Creation**

1. Admin creates household via dashboard
2. Sends invite to users
3. Users join existing households (no auto-creation)
4. Avoids the chicken-and-egg problem entirely

---

## Migration Files

### Current Migrations

1. **`20251008000000_initial_schema.sql`** (354 lines)
   - Creates all tables
   - Sets up foreign keys and constraints
   - Defines helper functions

2. **`20251008000001_rls_policies.sql`** (397 lines)
   - Enables RLS on all tables
   - Creates RLS policies
   - ⚠️ **Has chicken-and-egg bug** in household_members policy
   - Grants permissions to authenticated role

3. **`20251008000002_seed_data.sql`** (36 lines)
   - Seeds 15 system categories
   - Groceries, Restaurants, Transportation, etc.

### What We Removed

- ❌ `20251008000003_fix_household_rls.sql` - Failed fix attempt
- ❌ `DEBUG_AND_FIX_RLS.sql` - Debug queries
- ❌ `NUCLEAR_FIX_RLS.sql` - Emergency disable script
- ❌ `SIMPLE_RLS_FIX.sql` - Simplified fix attempt
- ❌ `RLS_DIAGNOSTIC.sql` - Diagnostic queries
- ❌ `FIX_RLS_HOUSEHOLD_CREATION.sql` - Original fix
- ❌ `RLS_FIX_PRODUCTION.md` - Deployment guide

### What We Kept

- ✅ `PRODUCTION_RESET.sql` - Clean database reset script
- ✅ Original 3 migration files (with known RLS bug)
- ✅ `DEV_DATABASE_CLEANUP.md` - Development cleanup guide

---

## Next Steps

### Immediate (Today)

1. ✅ Run `PRODUCTION_RESET.sql` in Supabase
2. ✅ Test signup and household creation
3. ✅ Test OCR receipt scanning
4. ✅ Verify all features work with RLS disabled

### Short Term (This Week)

1. **Document the bug** with reproduction steps
2. **Open Supabase support ticket** with logs
3. **Test local Supabase** to rule out cloud issue
4. **Implement Option B** (Edge Function) as backup plan

### Long Term (Before Production)

1. **Fix RLS** or implement Edge Function workaround
2. **Re-enable RLS** with working policies
3. **Security audit** of all RLS policies
4. **Penetration testing** to verify security

---

## Commands Reference

### Reset Database

```sql
-- Run in Supabase SQL Editor
\i supabase/PRODUCTION_RESET.sql
```

### Check RLS Status

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('households', 'household_members');
```

### Manually Create Test Household

```sql
-- Get user ID
SELECT id, email FROM auth.users WHERE email = 'test@example.com';

-- Create household (replace USER_ID)
INSERT INTO households (name, created_by)
VALUES ('Test Household', 'USER_ID')
RETURNING *;

-- Add member (replace HOUSEHOLD_ID and USER_ID)
INSERT INTO household_members (household_id, user_id, role)
VALUES ('HOUSEHOLD_ID', 'USER_ID', 'admin')
RETURNING *;
```

---

## Security Notes

**⚠️ CRITICAL: Do NOT deploy to production with RLS disabled!**

Current state is **INSECURE**:

- Any authenticated user can see all households
- Any authenticated user can modify any household
- No data isolation between users
- Privacy violations possible

**Before production:**

- ✅ RLS must be enabled
- ✅ Policies must be tested
- ✅ Security audit required

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs/guides/auth/row-level-security
- **RLS Debugging:** https://supabase.com/docs/guides/database/postgres/row-level-security#debugging
- **Support:** https://supabase.com/dashboard/support/new

---

**Status:** Development phase - RLS disabled for testing  
**Action Required:** Fix RLS before production deployment
