# React Native 0.81 + Jest Compatibility Issue

## Issue Description

The mobile app's test suite cannot run due to a version compatibility issue between React Native 0.81.4, React 19.1.0, and Jest's Babel parser.

## Error Details

**Error Message:**

```
SyntaxError: /workspaces/receiptor/node_modules/react-native/jest/mock.js:
Unexpected token, expected ","

  36 | function deref(ref: $Flow$ModuleRef<mixed>): string {
  37 |   // $FlowIgnore[incompatible-cast]
> 38 |   return (ref as string).substring(2);
     |               ^
  39 | }
```

**Root Cause:**

- React Native 0.81.4 uses Flow type annotations in its internal Jest setup files
- Jest's Babel parser (even with metro-react-native-babel-preset) struggles to parse Flow syntax
- React 19.1.0 is very new (released October 2025) and ecosystem compatibility is still stabilizing

## Affected Components

- ✅ **Test infrastructure**: Fully configured and ready
- ✅ **Test files**: 15+ tests written across 3 suites
- ❌ **Test execution**: Cannot run due to parsing errors
- ✅ **Application code**: Runs fine, only tests affected

## Current Workaround

Tests are written and committed but marked as **blocked**:

- `src/services/__tests__/veryfi.test.ts` - ✅ Written, ❌ Cannot run
- `src/hooks/__tests__/useDashboard.test.ts` - ✅ Written, ❌ Cannot run
- `src/components/common/__tests__/ReceiptCard.test.tsx` - ✅ Written, ❌ Cannot run

## Solutions (Prioritized)

### Option 1: Wait for Expo SDK 54 Stabilization ⭐ **RECOMMENDED**

**Timeline:** 1-2 weeks (Expo SDK 54 is in beta)

**Pros:**

- ✅ No breaking changes required
- ✅ Will include proper React Native 0.81/React 19 support
- ✅ Maintained by Expo team
- ✅ Includes updated jest-expo preset

**Cons:**

- ⏳ Requires waiting for stable release

**Action:**

```bash
# When Expo SDK 54 stable is released:
npm install expo@~54.0.0 --legacy-peer-deps
npm install --save-dev jest-expo@~54.0.0 --legacy-peer-deps
npm test
```

### Option 2: Downgrade React Native to 0.74

**Timeline:** Immediate

**Pros:**

- ✅ Proven stable with Jest
- ✅ Well-tested ecosystem compatibility
- ✅ Tests will run immediately

**Cons:**

- ❌ Breaks current Expo SDK 54 setup
- ❌ Loses React 19 features
- ❌ Requires significant package.json changes
- ❌ May need to downgrade other dependencies

**Action:**

```bash
# NOT RECOMMENDED - breaks current setup
npm install react-native@0.74 react@18.2.0 --legacy-peer-deps
npm install --save-dev jest-expo@~52.0.0 --legacy-peer-deps
```

### Option 3: Use @react-native/babel-preset

**Timeline:** When available (currently in React Native 0.75+)

**Pros:**

- ✅ Official React Native preset (replaces deprecated metro-react-native-babel-preset)
- ✅ Better Flow type handling
- ✅ Future-proof

**Cons:**

- ❌ Not available for React Native 0.81.4 in current form
- ❌ Would require upgrading/downgrading RN version

**Action:**

```bash
# Future solution
npm install --save-dev @react-native/babel-preset
# Update babel.config.js to use new preset
```

### Option 4: Disable Flow Type Checking in Jest (Experimental)

**Timeline:** Immediate (hack)

**Pros:**

- ✅ May allow tests to run

**Cons:**

- ❌ Fragile workaround
- ❌ May cause runtime issues
- ❌ Not recommended by Expo/RN teams

**Action:**

```javascript
// babel.config.js - NOT RECOMMENDED
module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {
        unstable_disableES6Transforms: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types', // Strip Flow types
  ],
};
```

## Decision Matrix

| Solution                        | Timeline  | Risk   | Effort | Recommended |
| ------------------------------- | --------- | ------ | ------ | ----------- |
| **Wait for Expo SDK 54 stable** | 1-2 weeks | Low    | None   | ⭐ **YES**  |
| Downgrade RN to 0.74            | Immediate | High   | High   | ❌ No       |
| Use @react-native/babel-preset  | Unknown   | Medium | Medium | ⏳ Future   |
| Disable Flow checking           | Immediate | High   | Low    | ❌ No       |

## Recommendation: **Wait for Expo SDK 54 Stable**

**Rationale:**

1. **Low risk**: Expo team will properly support React Native 0.81 + React 19
2. **No work required**: Just update packages when released
3. **Best practice**: Following official upgrade path
4. **Timeline acceptable**: 1-2 weeks is reasonable for test infrastructure

**Meanwhile:**

- ✅ Tests are written and documented
- ✅ Code reviews can verify test logic
- ✅ Development can continue unblocked
- ✅ Tests will run as soon as SDK updates

## Monitoring

**Check for Expo SDK 54 stable release:**

- 📍 https://github.com/expo/expo/releases
- 📍 https://expo.dev/changelog
- 📍 npm info expo-cli version

**Expected Timeline:**

- Beta: Currently available
- Stable: Expected mid-late October 2025

## Impact Assessment

### ✅ Not Blocked

- Feature development
- Code implementation
- Manual testing
- Code reviews
- Documentation

### ⏳ Temporarily Blocked

- Automated test execution
- Test coverage reports
- CI/CD test integration
- TDD workflow

## Alternative: Manual Testing Protocol

Until automated tests can run, follow this manual testing checklist:

### Veryfi Service

- [ ] Mock data generation produces valid receipts
- [ ] Fallback mechanism activates when API fails
- [ ] Swedish store names appear in mock data
- [ ] Currency is always SEK

### Dashboard Hook

- [ ] Dashboard loads with receipts
- [ ] Empty state shows when no receipts
- [ ] Month-over-month comparison calculates correctly
- [ ] Category breakdown shows percentages

### Receipt Card

- [ ] Card displays store name and amount
- [ ] Tapping card navigates to detail
- [ ] Date formats correctly
- [ ] Item count shows when items exist

## Next Steps

1. **Week of Oct 14, 2025**: Check for Expo SDK 54 stable release
2. **When released**: Run `npm install expo@~54.0.0 jest-expo@~54.0.0`
3. **Verify**: Run `npm test` to confirm tests pass
4. **Continue**: Add remaining test suites (useReceipts, screens)

## References

- [Expo SDK 54 Changelog](https://expo.dev/changelog)
- [Jest + React Native](https://jestjs.io/docs/tutorial-react-native)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Metro Babel Preset](https://facebook.github.io/metro/docs/configuration)

---

**Status**: 🔴 **BLOCKED** - Awaiting Expo SDK 54 stable  
**Severity**: Low (tests written, just can't execute)  
**Impact**: Development not blocked  
**ETA**: 1-2 weeks (mid-late October 2025)  
**Owner**: Infrastructure/DevOps  
**Last Updated**: October 8, 2025
