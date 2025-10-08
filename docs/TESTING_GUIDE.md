# Testing Guide for Receiptor

## Overview

This guide covers all testing strategies for the Receiptor project, including RLS policy tests, integration tests, and end-to-end tests.

---

## Test Categories

### 1. SQL RLS Policy Tests

**Location:** `/workspaces/receiptor/supabase/__tests__/rls-policies.test.sql`

**Purpose:** Verify that Row Level Security policies work correctly and prevent the circular dependency issues we encountered.

**How to run:**

```bash
# Option 1: In Supabase SQL Editor
# Copy and paste the entire file into the SQL Editor and run

# Option 2: Using Supabase CLI
cd /workspaces/receiptor
supabase db test
```

**What it tests:**

- ✅ RLS is enabled on all critical tables
- ✅ No circular dependencies between households ↔ household_members
- ✅ Users can create households
- ✅ Users can add themselves as household members (no chicken-and-egg)
- ✅ Users can view only their own households
- ✅ Users cannot view other users' households
- ✅ Receipt creation works with proper isolation
- ✅ Auto-profile trigger works
- ✅ Manual receipts support NULL store_id

**Critical Test:**

```sql
-- TEST 2: Verify no circular dependencies
-- This prevents Error 42P17 (infinite recursion)
-- households policies should NOT reference household_members
-- household_members policies should NOT reference households
```

---

### 2. Integration Tests (Mobile App)

**Location:** `/workspaces/receiptor/mobile/src/__tests__/integration/`

**How to run:**

```bash
cd /workspaces/receiptor/mobile
npm test -- --testPathPattern=integration
```

**What it tests:**

- Household creation flow
- Duplicate prevention
- RLS policy compliance from app perspective
- Household queries via JOIN
- Receipt creation with RLS

**Key Test:**

```typescript
it('should prevent circular dependency errors (Error 42P17)', async () => {
  // This will fail if RLS policies have circular dependencies
  // Expected: No Error 42P17
});
```

---

### 3. Unit Tests

**Location:** `/workspaces/receiptor/shared/src/__tests__/`

**How to run:**

```bash
cd /workspaces/receiptor/shared
npm test
```

**What it tests:**

- Business logic functions
- Receipt parsing
- Category classification
- Currency formatting
- Budget calculations

---

### 4. Component Tests (Mobile)

**Location:** `/workspaces/receiptor/mobile/src/components/common/__tests__/`

**How to run:**

```bash
cd /workspaces/receiptor/mobile
npm test
```

**What it tests:**

- React Native components render correctly
- User interactions work
- Navigation flows

---

## Running All Tests

### Development Workflow

```bash
# 1. Run SQL RLS tests (in Supabase dashboard)
# Copy supabase/__tests__/rls-policies.test.sql and run in SQL Editor

# 2. Run shared business logic tests
cd /workspaces/receiptor/shared
npm test

# 3. Run mobile app tests
cd /workspaces/receiptor/mobile
npm test

# 4. Run integration tests (requires running Supabase)
cd /workspaces/receiptor/mobile
npm test -- --testPathPattern=integration
```

### CI/CD Pipeline

Tests are automatically run on every commit via GitHub Actions (see `.github/workflows/test.yml`).

---

## Critical RLS Tests to Prevent Regressions

### Problem We Solved

**Error 42P17:** Infinite recursion in RLS policies caused by circular dependencies between `households` and `household_members` tables.

### How We Fixed It

Changed policy architecture so:

- `households` policies ONLY check `created_by = auth.uid()` (no household_members queries)
- `household_members` policies ONLY check `user_id = auth.uid()` (no households queries)
- Other tables can safely query via household_members (no recursion)

### How to Verify the Fix Works

**Test 1: SQL Level**

```sql
-- Run this in Supabase SQL Editor
-- Should NOT contain circular references

SELECT
  tablename,
  policyname,
  qual::TEXT as select_policy,
  with_check::TEXT as insert_policy
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('households', 'household_members');

-- Expected:
-- households policies should NOT mention 'household_members'
-- household_members policies should NOT mention 'households'
```

**Test 2: App Level**

```typescript
// This should work without Error 42P17
const { data: household } = await supabase
  .from('households')
  .insert({ name: 'My Home', created_by: user.id })
  .select()
  .single();

const { error } = await supabase.from('household_members').insert({
  household_id: household.id,
  user_id: user.id,
  role: 'admin',
});

// If error.code === '42P17', we have a problem!
expect(error).toBeNull();
```

---

## Manual Testing Checklist

### After Database Schema Changes

- [ ] Run `rls-policies.test.sql` in Supabase
- [ ] Verify all 10 tests pass
- [ ] Check for Error 42P17 in app
- [ ] Test household creation flow
- [ ] Test receipt creation
- [ ] Verify user isolation (can't see other households)

### Before Each Release

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] RLS tests pass
- [ ] Manual testing on real device
- [ ] Check Sentry for runtime errors
- [ ] Performance testing (receipt list with 100+ items)

---

## Common Test Failures

### "Error 42P17: infinite recursion detected"

**Cause:** Circular dependency in RLS policies  
**Fix:** Check policies don't reference each other's tables  
**Test:** Run `TEST 2` in `rls-policies.test.sql`

### "Error 42501: new row violates row-level security policy"

**Cause:** RLS policy preventing valid operation  
**Fix:** Check policy logic, ensure `auth.uid()` is set  
**Test:** Run `TEST 3` and `TEST 4` in `rls-policies.test.sql`

### "Error 23503: foreign key constraint violated"

**Cause:** User account deleted or doesn't exist  
**Fix:** Ensure user profile exists before household creation  
**Test:** Run `TEST 9` (auto-profile trigger)

### "Error 23502: null value in column store_id"

**Cause:** Manual receipts trying to insert NULL store_id  
**Fix:** Ensure `store_id` column is nullable  
**Test:** Run `TEST 10` in `rls-policies.test.sql`

---

## Adding New Tests

### When to Add RLS Tests

Add a new RLS test when:

1. Creating a new table with RLS
2. Modifying existing RLS policies
3. Adding new user roles or permissions
4. Implementing multi-household features

### Template for New RLS Test

```sql
-- =============================================================================
-- TEST X: Description of what you're testing
-- =============================================================================

DO $$
DECLARE
  -- Declare variables
BEGIN
  -- Set session user
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'test-user-id')::text,
    true);

  -- Perform test operation
  -- INSERT / SELECT / UPDATE / DELETE

  -- Verify expected outcome
  IF condition THEN
    RAISE NOTICE '✅ TEST X PASSED: Description';
  ELSE
    RAISE EXCEPTION 'TEST X FAILED: Reason';
  END IF;
END $$;
```

---

## Performance Tests

### Receipt List Performance

```typescript
// Test that receipts load quickly even with many items
it('should load 1000 receipts in < 2 seconds', async () => {
  const start = Date.now();

  const { data } = await supabase.from('receipts').select('*').limit(1000);

  const duration = Date.now() - start;
  expect(duration).toBeLessThan(2000);
});
```

### RLS Policy Performance

```sql
-- Check if RLS policies use indexes efficiently
EXPLAIN ANALYZE
SELECT * FROM receipts
WHERE household_id IN (
  SELECT household_id
  FROM household_members
  WHERE user_id = 'test-user-id'
);

-- Should use index scan, not sequential scan
```

---

## Test Coverage Goals

- **RLS Policies:** 100% coverage (all policies tested)
- **Business Logic:** 80%+ coverage
- **Components:** 70%+ coverage
- **Integration Tests:** Critical user flows covered

---

## Resources

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

**Last Updated:** October 8, 2025
