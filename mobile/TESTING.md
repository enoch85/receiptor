# Mobile App Testing Guide

## Test Coverage Summary

This document describes the test suite for the Receiptor mobile application.

## Test Structure

```
mobile/src/
├── services/__tests__/
│   └── veryfi.test.ts              # Veryfi OCR service tests
├── hooks/__tests__/
│   ├── useDashboard.test.ts        # Dashboard data hook tests
│   └── useReceipts.test.ts         # Receipts data hook tests (TODO)
├── components/common/__tests__/
│   └── ReceiptCard.test.tsx        # Receipt card component tests
└── screens/__tests__/               # Screen component tests (TODO)
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test veryfi.test.ts
```

## Test Categories

### 1. Service Tests (`services/__tests__/`)

**Veryfi Service** (`veryfi.test.ts`)
- ✅ Mock data generation
- ✅ Fallback mechanism
- ✅ Swedish store data validation
- ✅ Currency code handling

### 2. Hook Tests (`hooks/__tests__/`)

**useDashboard** (`useDashboard.test.ts`)
- ✅ Fetches dashboard statistics
- ✅ Handles empty receipts
- ✅ Handles API errors
- ✅ Calculates month-over-month comparison
- ✅ Category breakdown

**useReceipts** (TODO)
- ⏳ Fetch receipts with pagination
- ⏳ Create new receipt
- ⏳ Update receipt
- ⏳ Delete receipt
- ⏳ Search and filtering

### 3. Component Tests (`components/__tests__/`)

**ReceiptCard** (`ReceiptCard.test.tsx`)
- ✅ Renders receipt details
- ✅ Handles press events
- ✅ Shows item count
- ✅ Formats dates correctly
- ✅ Handles missing data gracefully

### 4. Screen Tests (TODO)

**ReceiptListScreen**
- ⏳ Renders receipt list
- ⏳ Handles pagination
- ⏳ Search functionality
- ⏳ Filter by category
- ⏳ Empty state
- ⏳ Loading state
- ⏳ Error handling

**ReceiptDetailScreen**
- ⏳ Displays receipt information
- ⏳ Shows receipt items
- ⏳ Category editing
- ⏳ Delete confirmation
- ⏳ Navigation

**ReceiptCaptureScreen**
- ⏳ Camera permissions
- ⏳ Image capture
- ⏳ OCR processing
- ⏳ Preview functionality
- ⏳ Save receipt

**DashboardScreen**
- ⏳ Renders statistics cards
- ⏳ Shows category breakdown
- ⏳ Recent receipts list
- ⏳ Empty state
- ⏳ Loading state

## Coverage Goals

- **Target**: 70%+ coverage for all code
- **Current**: ~30% (basic tests in place)
- **Priority**: Hooks and services (business logic)

## Test Utilities

### Mock Data

```typescript
// Mock receipt
const mockReceipt: Receipt = {
  id: '1',
  household_id: 'test-household',
  store_name: 'ICA Supermarket',
  total_amount: 245.50,
  currency: 'SEK',
  purchase_date: new Date('2025-10-08'),
  source: 'manual',
  created_at: new Date(),
  updated_at: new Date(),
};
```

### React Query Wrapper

```typescript
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Supabase Mocks

```typescript
(supabase.from as jest.Mock).mockReturnValue({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
});
```

## Mocked Dependencies

The following dependencies are mocked in `jest.setup.js`:

- ✅ `expo-crypto` - Crypto operations
- ✅ `expo-camera` - Camera functionality
- ✅ `expo-image-picker` - Image selection
- ✅ `expo-file-system` - File operations
- ✅ `@supabase/supabase-js` - Database operations
- ✅ `react-native-paper` - UI components

## Writing New Tests

### 1. Component Test Template

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<YourComponent onPress={onPress} />);
    
    fireEvent.press(getByTestId('button'));
    
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 2. Hook Test Template

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useYourHook } from '../useYourHook';

describe('useYourHook', () => {
  it('should fetch data', async () => {
    const { result } = renderHook(() => useYourHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });
});
```

## Continuous Integration

Tests run automatically on:
- ✅ Pull requests
- ✅ Push to main branch
- ✅ Pre-commit hook (optional)

## Next Steps

1. **Add useReceipts tests** - Test all CRUD operations
2. **Add screen tests** - Integration tests for all screens
3. **Add E2E tests** - Full user flows with Detox
4. **Increase coverage** - Aim for 80%+ coverage
5. **Add visual regression tests** - Screenshot testing

## Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing React Query](https://tanstack.com/query/latest/docs/react/guides/testing)
- [Expo Testing](https://docs.expo.dev/develop/unit-testing/)

---

**Last Updated**: October 8, 2025  
**Status**: ✅ Initial test suite implemented
