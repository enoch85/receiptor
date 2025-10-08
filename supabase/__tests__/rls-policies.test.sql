-- ============================================================================
-- RLS POLICIES TEST SUITE
-- ============================================================================
-- Tests to ensure RLS policies work correctly and prevent circular dependencies
-- Run these tests in Supabase SQL Editor after setting up the database
-- ============================================================================

-- =============================================================================
-- TEST SETUP: Create test users
-- =============================================================================

-- Create test user 1
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test1@receiptor.test',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create test user 2
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'test2@receiptor.test',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create user profiles (should be auto-created by trigger, but ensure they exist)
INSERT INTO user_profiles (id, display_name, language, currency, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Test User 1', 'en', 'SEK', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Test User 2', 'en', 'SEK', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name;

-- =============================================================================
-- TEST 1: Verify RLS is enabled on all critical tables
-- =============================================================================

DO $$
DECLARE
  rls_disabled_tables TEXT[];
BEGIN
  SELECT ARRAY_AGG(tablename)
  INTO rls_disabled_tables
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN (
      'households',
      'household_members',
      'receipts',
      'receipt_items',
      'budgets',
      'user_profiles',
      'store_connections'
    )
    AND NOT rowsecurity;
  
  IF ARRAY_LENGTH(rls_disabled_tables, 1) > 0 THEN
    RAISE EXCEPTION 'RLS is DISABLED on tables: %', ARRAY_TO_STRING(rls_disabled_tables, ', ');
  ELSE
    RAISE NOTICE '✅ TEST 1 PASSED: RLS is enabled on all critical tables';
  END IF;
END $$;

-- =============================================================================
-- TEST 2: Verify no circular dependencies in RLS policies
-- =============================================================================

DO $$
DECLARE
  household_policy_count INTEGER;
  member_policy_count INTEGER;
  household_checks_members BOOLEAN;
  member_checks_households BOOLEAN;
BEGIN
  -- Check if households policies reference household_members table
  SELECT COUNT(*) > 0
  INTO household_checks_members
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'households'
    AND (
      qual::TEXT LIKE '%household_members%'
      OR with_check::TEXT LIKE '%household_members%'
    );
  
  -- Check if household_members policies reference households table
  SELECT COUNT(*) > 0
  INTO member_checks_households
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'household_members'
    AND (
      qual::TEXT LIKE '%households%'
      OR with_check::TEXT LIKE '%households%'
    );
  
  IF household_checks_members AND member_checks_households THEN
    RAISE EXCEPTION 'CIRCULAR DEPENDENCY DETECTED: households ↔ household_members';
  ELSE
    RAISE NOTICE '✅ TEST 2 PASSED: No circular dependencies between households and household_members';
  END IF;
END $$;

-- =============================================================================
-- TEST 3: User can create a household (as themselves)
-- =============================================================================

DO $$
DECLARE
  test_household_id UUID;
BEGIN
  -- Set session to test user 1
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  -- Try to create household
  INSERT INTO households (name, created_by)
  VALUES ('Test Household 1', '00000000-0000-0000-0000-000000000001'::uuid)
  RETURNING id INTO test_household_id;
  
  IF test_household_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create household';
  ELSE
    RAISE NOTICE '✅ TEST 3 PASSED: User can create household (ID: %)', test_household_id;
  END IF;
END $$;

-- =============================================================================
-- TEST 4: User can add themselves as household member (no chicken-and-egg)
-- =============================================================================

DO $$
DECLARE
  test_household_id UUID;
  test_member_id UUID;
BEGIN
  -- Set session to test user 1
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  -- Get the household we just created
  SELECT id INTO test_household_id
  FROM households
  WHERE created_by = '00000000-0000-0000-0000-000000000001'::uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Try to add self as member
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (test_household_id, '00000000-0000-0000-0000-000000000001'::uuid, 'admin')
  RETURNING id INTO test_member_id;
  
  IF test_member_id IS NULL THEN
    RAISE EXCEPTION 'Failed to add user as household member (chicken-and-egg problem!)';
  ELSE
    RAISE NOTICE '✅ TEST 4 PASSED: User can add themselves as household member';
  END IF;
END $$;

-- =============================================================================
-- TEST 5: User can view their own household
-- =============================================================================

DO $$
DECLARE
  household_count INTEGER;
BEGIN
  -- Set session to test user 1
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  -- Try to view households
  SELECT COUNT(*)
  INTO household_count
  FROM households
  WHERE created_by = '00000000-0000-0000-0000-000000000001'::uuid;
  
  IF household_count = 0 THEN
    RAISE EXCEPTION 'User cannot view their own household';
  ELSE
    RAISE NOTICE '✅ TEST 5 PASSED: User can view their own household (count: %)', household_count;
  END IF;
END $$;

-- =============================================================================
-- TEST 6: User CANNOT view other users' households
-- =============================================================================

DO $$
DECLARE
  other_household_id UUID;
  can_see_other BOOLEAN;
BEGIN
  -- Create household as user 2 (bypass RLS for setup)
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000002')::text, true);
  
  INSERT INTO households (name, created_by)
  VALUES ('User 2 Household', '00000000-0000-0000-0000-000000000002'::uuid)
  RETURNING id INTO other_household_id;
  
  -- Switch to user 1 and try to see user 2's household
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  SELECT EXISTS (
    SELECT 1
    FROM households
    WHERE id = other_household_id
  ) INTO can_see_other;
  
  IF can_see_other THEN
    RAISE EXCEPTION 'Security violation: User 1 can see User 2 household!';
  ELSE
    RAISE NOTICE '✅ TEST 6 PASSED: Users cannot view other users households';
  END IF;
END $$;

-- =============================================================================
-- TEST 7: User can create receipt in their household
-- =============================================================================

DO $$
DECLARE
  test_household_id UUID;
  test_receipt_id UUID;
BEGIN
  -- Set session to test user 1
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  -- Get user's household
  SELECT id INTO test_household_id
  FROM households
  WHERE created_by = '00000000-0000-0000-0000-000000000001'::uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Create receipt
  INSERT INTO receipts (
    household_id,
    store_name,
    total_amount,
    currency,
    purchase_date,
    source
  ) VALUES (
    test_household_id,
    'Test Store',
    100.00,
    'SEK',
    NOW(),
    'manual'
  ) RETURNING id INTO test_receipt_id;
  
  IF test_receipt_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create receipt';
  ELSE
    RAISE NOTICE '✅ TEST 7 PASSED: User can create receipt in their household';
  END IF;
END $$;

-- =============================================================================
-- TEST 8: User CANNOT create receipt in another user's household
-- =============================================================================

DO $$
DECLARE
  other_household_id UUID;
  receipt_created BOOLEAN := FALSE;
BEGIN
  -- Get user 2's household
  SELECT id INTO other_household_id
  FROM households
  WHERE created_by = '00000000-0000-0000-0000-000000000002'::uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Set session to test user 1
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  -- Try to create receipt in user 2's household (should fail)
  BEGIN
    INSERT INTO receipts (
      household_id,
      store_name,
      total_amount,
      currency,
      purchase_date,
      source
    ) VALUES (
      other_household_id,
      'Test Store',
      100.00,
      'SEK',
      NOW(),
      'manual'
    );
    receipt_created := TRUE;
  EXCEPTION WHEN OTHERS THEN
    receipt_created := FALSE;
  END;
  
  IF receipt_created THEN
    RAISE EXCEPTION 'Security violation: User 1 created receipt in User 2 household!';
  ELSE
    RAISE NOTICE '✅ TEST 8 PASSED: Users cannot create receipts in other households';
  END IF;
END $$;

-- =============================================================================
-- TEST 9: Auto-profile trigger works for new users
-- =============================================================================

DO $$
DECLARE
  new_user_id UUID := '00000000-0000-0000-0000-000000000003'::uuid;
  profile_exists BOOLEAN;
BEGIN
  -- Create new user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'test3@receiptor.test',
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;
  
  -- Check if profile was auto-created
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = new_user_id
  ) INTO profile_exists;
  
  IF NOT profile_exists THEN
    RAISE EXCEPTION 'Auto-profile trigger failed';
  ELSE
    RAISE NOTICE '✅ TEST 9 PASSED: Auto-profile trigger creates user profiles';
  END IF;
END $$;

-- =============================================================================
-- TEST 10: Store_id is nullable for manual receipts
-- =============================================================================

DO $$
DECLARE
  test_household_id UUID;
  test_receipt_id UUID;
BEGIN
  -- Set session to test user 1
  PERFORM set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000001')::text, true);
  
  -- Get user's household
  SELECT id INTO test_household_id
  FROM households
  WHERE created_by = '00000000-0000-0000-0000-000000000001'::uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Create manual receipt without store_id
  INSERT INTO receipts (
    household_id,
    store_name,
    total_amount,
    currency,
    purchase_date,
    source,
    store_id  -- NULL
  ) VALUES (
    test_household_id,
    'Manual Store',
    50.00,
    'SEK',
    NOW(),
    'manual',
    NULL
  ) RETURNING id INTO test_receipt_id;
  
  IF test_receipt_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create manual receipt with NULL store_id';
  ELSE
    RAISE NOTICE '✅ TEST 10 PASSED: Manual receipts can have NULL store_id';
  END IF;
END $$;

-- =============================================================================
-- TEST CLEANUP
-- =============================================================================

DO $$
BEGIN
  -- Delete test data
  DELETE FROM receipt_items WHERE receipt_id IN (
    SELECT id FROM receipts WHERE household_id IN (
      SELECT id FROM households WHERE created_by IN (
        '00000000-0000-0000-0000-000000000001'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid
      )
    )
  );
  
  DELETE FROM receipts WHERE household_id IN (
    SELECT id FROM households WHERE created_by IN (
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000002'::uuid
    )
  );
  
  DELETE FROM household_members WHERE household_id IN (
    SELECT id FROM households WHERE created_by IN (
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000002'::uuid
    )
  );
  
  DELETE FROM households WHERE created_by IN (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid
  );
  
  DELETE FROM user_profiles WHERE id IN (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid
  );
  
  DELETE FROM auth.users WHERE id IN (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid
  );
  
  RAISE NOTICE '🧹 Test data cleaned up';
END $$;

-- =============================================================================
-- TEST SUMMARY
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS POLICY TEST SUITE COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'All tests passed! ✅';
  RAISE NOTICE '';
  RAISE NOTICE 'Tests covered:';
  RAISE NOTICE '1. RLS enabled on all tables';
  RAISE NOTICE '2. No circular dependencies';
  RAISE NOTICE '3. Household creation works';
  RAISE NOTICE '4. Member addition works (no chicken-and-egg)';
  RAISE NOTICE '5. Users can view own households';
  RAISE NOTICE '6. Users cannot view other households';
  RAISE NOTICE '7. Users can create receipts in own household';
  RAISE NOTICE '8. Users cannot create receipts in other households';
  RAISE NOTICE '9. Auto-profile trigger works';
  RAISE NOTICE '10. Manual receipts support NULL store_id';
  RAISE NOTICE '';
END $$;
