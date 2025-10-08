# GitHub Copilot Instructions for Receiptor Project

**Project:** Receiptor - Household Grocery Budget Tracking App  
**Last Updated:** October 8, 2025  
**Status:** Active Development

---

## Project Context

### What We're Building
A mobile-first grocery budget tracking app with:
- **Multi-user household support** (key differentiator)
- **Automatic receipt collection** via OAuth store integrations
- **AI-powered categorization** and spending insights
- **Cross-platform:** React Native (iOS/Android) + Next.js (Web)
- **Secure by design:** OAuth 2.0, never store passwords
- **Freemium model:** Free tier + Premium ($4.99/mo)

### Target Users
1. **Primary:** Multi-person households (families, couples, roommates)
2. **Secondary:** Privacy-conscious users
3. **Geographic:** Scandinavia first, then Europe, then Global

### Key Differentiators vs Competitors
1. ✅ **True multi-user households** (unlimited members in premium)
2. ✅ **OAuth 2.0 security** (vs credential storage)
3. ✅ **International from day 1** (10+ countries)
4. ✅ **AI insights** (carbon tracking, price trends)
5. ✅ **Modern tech stack** (Supabase, React Native, TypeScript)

---

## Technology Stack

### Frontend
- **Mobile:** React Native 0.74+ with TypeScript
  - **Navigation:** React Navigation 6+
  - **State:** Zustand (lightweight, simple)
  - **Data Fetching:** React Query (TanStack Query)
  - **UI:** React Native Paper + custom components
  - **Charts:** Victory Native
  - **Forms:** React Hook Form
  
- **Web:** Next.js 14+ (App Router) with TypeScript
  - **Styling:** Tailwind CSS
  - **UI:** Shadcn/ui components
  - **Charts:** Recharts
  - **State:** Zustand
  - **Forms:** React Hook Form

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email, Google, Apple)
- **Realtime:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (receipt images)
- **Functions:** Supabase Edge Functions (Deno/TypeScript)

### Infrastructure
- **Mobile Builds:** EAS (Expo Application Services)
- **Web Hosting:** Vercel
- **CDN:** CloudFlare
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (errors) + PostHog (analytics)

### Third-Party Services
- **OCR:** Veryfi (receipt scanning)
- **AI:** OpenAI GPT-4 (categorization, insights)
- **Payments:** Stripe (subscriptions)
- **Email:** Resend
- **Push Notifications:** Expo Push Notifications

---

## Code Quality Standards

### 1. File Organization

**Feature-based structure** (not type-based):
```
src/
  features/
    auth/
      components/
      hooks/
      api/
      utils/
      types.ts
      index.ts
    receipts/
      components/
      hooks/
      api/
      utils/
      types.ts
      index.ts
    households/
    budgets/
    analytics/
  shared/
    components/
    hooks/
    utils/
    types/
```

### 2. TypeScript Standards

**ALWAYS use TypeScript strict mode:**
```typescript
// ✅ Good: Explicit types
interface Receipt {
  id: string;
  household_id: string;
  total_amount: number;
  purchase_date: Date;
  items: ReceiptItem[];
}

function calculateTotal(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + item.total_price, 0);
}

// ❌ Bad: Any types or implicit any
function calculateTotal(items: any) {
  return items.reduce((sum, item) => sum + item.total_price, 0);
}
```

**Use type exports:**
```typescript
// types.ts
export interface User {
  id: string;
  email: string;
}

export type UserRole = 'admin' | 'member' | 'viewer';
```

### 3. Naming Conventions

```typescript
// Components: PascalCase
export function ReceiptCard() {}
export function BudgetDashboard() {}

// Hooks: camelCase with 'use' prefix
export function useReceipts() {}
export function useHousehold() {}

// Utilities: camelCase
export function formatCurrency() {}
export function parseDate() {}

// Constants: UPPER_SNAKE_CASE
export const MAX_HOUSEHOLD_MEMBERS = 3;
export const API_BASE_URL = 'https://api.receiptor.app';

// Types/Interfaces: PascalCase
export interface Receipt {}
export type ReceiptStatus = 'pending' | 'processed';

// Files: kebab-case
receipt-card.tsx
use-receipts.ts
format-currency.ts
```

### 4. Function Size Limits

```typescript
// ✅ Good: Small, focused functions (<50 lines)
function validateReceipt(receipt: Receipt): ValidationResult {
  const errors: string[] = [];
  
  if (!receipt.total_amount || receipt.total_amount <= 0) {
    errors.push('Total amount must be positive');
  }
  
  if (!receipt.purchase_date) {
    errors.push('Purchase date is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ❌ Bad: Large, multi-responsibility functions (>50 lines)
// Split into smaller functions!
```

### 5. Component Structure

```typescript
// ✅ Good: Clean component structure
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useReceipts } from '../hooks/use-receipts';
import type { Household } from '../types';

interface ReceiptListProps {
  householdId: string;
  onReceiptClick: (id: string) => void;
}

/**
 * Displays a list of receipts for a household
 * @param householdId - The household to show receipts for
 * @param onReceiptClick - Callback when receipt is clicked
 */
export function ReceiptList({ householdId, onReceiptClick }: ReceiptListProps) {
  const { receipts, isLoading, error } = useReceipts(householdId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <View>
      {receipts.map(receipt => (
        <ReceiptCard 
          key={receipt.id} 
          receipt={receipt}
          onPress={() => onReceiptClick(receipt.id)}
        />
      ))}
    </View>
  );
}
```

### 6. Error Handling

```typescript
// ✅ Good: Proper error handling
async function fetchReceipts(householdId: string): Promise<Receipt[]> {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('household_id', householdId);
    
    if (error) {
      throw new Error(`Failed to fetch receipts: ${error.message}`);
    }
    
    return data ?? [];
  } catch (error) {
    console.error('Error fetching receipts:', error);
    // Log to Sentry in production
    throw error;
  }
}

// ❌ Bad: Swallowing errors
async function fetchReceipts(householdId: string) {
  try {
    const data = await supabase.from('receipts').select('*');
    return data;
  } catch (error) {
    return [];
  }
}
```

### 7. Comments & Documentation

```typescript
/**
 * JSDoc for all public functions/components
 * Explains purpose, parameters, and return values
 */

// ✅ Good: JSDoc + inline comments for complex logic
/**
 * Calculates the monthly budget progress for a household
 * @param receipts - All receipts for the month
 * @param budget - The monthly budget amount
 * @returns Progress object with spent amount and percentage
 */
export function calculateBudgetProgress(
  receipts: Receipt[],
  budget: number
): BudgetProgress {
  // Sum all receipt totals
  const totalSpent = receipts.reduce((sum, r) => sum + r.total_amount, 0);
  
  // Calculate percentage (cap at 100% for display)
  const percentage = Math.min((totalSpent / budget) * 100, 100);
  
  return {
    spent: totalSpent,
    budget,
    percentage,
    remaining: Math.max(budget - totalSpent, 0)
  };
}

// ❌ Bad: No documentation
export function calc(r, b) {
  const t = r.reduce((s, x) => s + x.total_amount, 0);
  return { s: t, p: (t / b) * 100 };
}
```

---

## Testing Requirements

### 1. Unit Tests (Jest + React Testing Library)

**Every business logic function must have tests:**

```typescript
// budget-calculator.test.ts
import { calculateBudgetProgress } from './budget-calculator';

describe('calculateBudgetProgress', () => {
  it('should calculate progress correctly', () => {
    const receipts = [
      { total_amount: 100 },
      { total_amount: 200 }
    ];
    const budget = 500;
    
    const result = calculateBudgetProgress(receipts, budget);
    
    expect(result.spent).toBe(300);
    expect(result.percentage).toBe(60);
    expect(result.remaining).toBe(200);
  });
  
  it('should cap percentage at 100%', () => {
    const receipts = [{ total_amount: 600 }];
    const budget = 500;
    
    const result = calculateBudgetProgress(receipts, budget);
    
    expect(result.percentage).toBe(100);
  });
});
```

**Component tests:**

```typescript
// receipt-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ReceiptCard } from './receipt-card';

describe('ReceiptCard', () => {
  const mockReceipt = {
    id: '1',
    store_name: 'Coop',
    total_amount: 245.50,
    purchase_date: new Date('2025-10-08')
  };
  
  it('should render receipt details', () => {
    render(<ReceiptCard receipt={mockReceipt} />);
    
    expect(screen.getByText('Coop')).toBeTruthy();
    expect(screen.getByText('245.50 SEK')).toBeTruthy();
  });
  
  it('should call onPress when clicked', () => {
    const onPress = jest.fn();
    render(<ReceiptCard receipt={mockReceipt} onPress={onPress} />);
    
    fireEvent.press(screen.getByTestId('receipt-card'));
    
    expect(onPress).toHaveBeenCalledWith(mockReceipt.id);
  });
});
```

### 2. Integration Tests

**Test API endpoints:**

```typescript
// receipts.api.test.ts
import { createClient } from '@supabase/supabase-js';

describe('Receipts API', () => {
  let supabase: ReturnType<typeof createClient>;
  
  beforeAll(() => {
    supabase = createClient(/* test instance */);
  });
  
  it('should fetch receipts for household', async () => {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('household_id', 'test-household-id');
    
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });
});
```

### 3. E2E Tests (Playwright for web, Detox for mobile)

**Critical user flows:**

```typescript
// onboarding.e2e.test.ts
test('user can complete onboarding', async ({ page }) => {
  await page.goto('/');
  
  // Sign up
  await page.click('[data-testid="sign-up"]');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="submit"]');
  
  // Create household
  await page.fill('[data-testid="household-name"]', 'Test Family');
  await page.click('[data-testid="next"]');
  
  // Set budget
  await page.fill('[data-testid="budget"]', '5000');
  await page.click('[data-testid="next"]');
  
  // Verify dashboard
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
});
```

**Target coverage: 80%+ for business logic**

---

## Security Guidelines

### 1. Never Store Credentials

```typescript
// ✅ Good: OAuth flow
async function connectStore(storeId: string) {
  const oauthUrl = await getOAuthUrl(storeId);
  // Redirect user to store's official login
  window.location.href = oauthUrl;
}

// ❌ Bad: Storing passwords
async function connectStore(username: string, password: string) {
  await supabase.from('credentials').insert({
    username,
    password // NEVER DO THIS
  });
}
```

### 2. Encrypt Sensitive Data

```typescript
// ✅ Good: Encrypt tokens
import { encrypt, decrypt } from '@/utils/encryption';

async function storeAccessToken(token: string) {
  const encrypted = encrypt(token);
  await supabase.from('store_connections').insert({
    access_token: encrypted
  });
}

// ❌ Bad: Plain text tokens
async function storeAccessToken(token: string) {
  await supabase.from('store_connections').insert({
    access_token: token // Vulnerable
  });
}
```

### 3. Row Level Security (RLS)

```sql
-- ✅ Good: Always use RLS policies
CREATE POLICY "Users can only see their household receipts"
ON receipts FOR SELECT
USING (
  household_id IN (
    SELECT household_id FROM household_members
    WHERE user_id = auth.uid()
  )
);

-- ❌ Bad: No RLS (security hole!)
```

### 4. Input Validation

```typescript
// ✅ Good: Validate all inputs
import { z } from 'zod';

const ReceiptSchema = z.object({
  total_amount: z.number().positive(),
  purchase_date: z.date(),
  items: z.array(z.object({
    name: z.string().min(1),
    price: z.number().positive()
  }))
});

function validateReceipt(data: unknown) {
  return ReceiptSchema.parse(data);
}

// ❌ Bad: Trusting user input
function saveReceipt(data: any) {
  await supabase.from('receipts').insert(data);
}
```

---

## Performance Guidelines

### 1. Lazy Loading

```typescript
// ✅ Good: Lazy load components
import { lazy, Suspense } from 'react';

const AnalyticsDashboard = lazy(() => import('./analytics-dashboard'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}
```

### 2. Memoization

```typescript
// ✅ Good: Memoize expensive calculations
import { useMemo } from 'react';

function BudgetDashboard({ receipts, budget }) {
  const progress = useMemo(() => {
    return calculateBudgetProgress(receipts, budget);
  }, [receipts, budget]);
  
  return <ProgressBar value={progress.percentage} />;
}
```

### 3. Pagination

```typescript
// ✅ Good: Paginate large lists
async function fetchReceipts(householdId: string, page = 0, limit = 20) {
  const { data } = await supabase
    .from('receipts')
    .select('*')
    .eq('household_id', householdId)
    .range(page * limit, (page + 1) * limit - 1)
    .order('purchase_date', { ascending: false });
  
  return data;
}

// ❌ Bad: Fetching all data
async function fetchReceipts(householdId: string) {
  const { data } = await supabase
    .from('receipts')
    .select('*')
    .eq('household_id', householdId);
  
  return data; // Could be thousands of rows!
}
```

### 4. Image Optimization

```typescript
// ✅ Good: Compress and resize images
import { manipulateAsync } from 'expo-image-manipulator';

async function uploadReceiptImage(uri: string) {
  // Resize to max 1024px wide
  const resized = await manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: 'jpeg' }
  );
  
  // Upload compressed image
  return uploadToStorage(resized.uri);
}
```

---

## Git Workflow

### 1. Conventional Commits

```bash
# Format: <type>(<scope>): <subject>

feat(receipts): add OCR scanning for manual receipts
fix(auth): resolve OAuth callback redirect issue
docs(api): update Supabase schema documentation
test(budgets): add unit tests for budget calculations
refactor(ui): simplify receipt card component
perf(queries): optimize receipt list database query
chore(deps): update React Native to 0.74.2
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding/updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### 2. Branch Naming

```bash
feature/household-invites
fix/receipt-sync-error
refactor/budget-calculations
docs/api-endpoints
test/receipt-parser
```

### 3. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Added/updated tests
- [ ] Tests pass locally
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added comments for complex logic

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes
```

---

## Database Conventions

### 1. Naming

```sql
-- Tables: plural, snake_case
receipts
household_members
store_connections

-- Columns: singular, snake_case
total_amount
purchase_date
created_at

-- Foreign keys: {table}_id
household_id
user_id
receipt_id

-- Indexes: idx_{table}_{columns}
idx_receipts_household_date
idx_household_members_user
```

### 2. Always Include Timestamps

```sql
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ... other columns ...
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Use Proper Data Types

```sql
-- ✅ Good: Appropriate types
total_amount DECIMAL(10,2)  -- For money
purchase_date DATE           -- For dates only
created_at TIMESTAMP         -- For date + time
is_organic BOOLEAN           -- For true/false
status VARCHAR(20)           -- For enums

-- ❌ Bad: Wrong types
total_amount FLOAT           -- Loses precision
purchase_date VARCHAR(50)    -- Should be DATE
is_organic VARCHAR(10)       -- Should be BOOLEAN
```

---

## API Design Guidelines

### 1. RESTful Endpoints

```typescript
// ✅ Good: RESTful structure
GET    /api/receipts              // List receipts
GET    /api/receipts/:id          // Get single receipt
POST   /api/receipts              // Create receipt
PATCH  /api/receipts/:id          // Update receipt
DELETE /api/receipts/:id          // Delete receipt

GET    /api/households/:id/members  // Nested resources

// ❌ Bad: RPC-style
POST   /api/getReceipts
POST   /api/createReceipt
POST   /api/deleteReceipt
```

### 2. Response Format

```typescript
// ✅ Good: Consistent response structure
{
  "data": {
    "id": "123",
    "total_amount": 245.50
  },
  "meta": {
    "timestamp": "2025-10-08T12:00:00Z"
  }
}

// Error response
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Total amount must be positive",
    "details": {
      "field": "total_amount",
      "value": -10
    }
  }
}
```

### 3. Pagination

```typescript
// ✅ Good: Include pagination metadata
{
  "data": [ /* items */ ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

---

## Internationalization (i18n)

### 1. Use i18n Keys

```typescript
// ✅ Good: Translatable strings
import { useTranslation } from 'react-i18next';

function BudgetAlert() {
  const { t } = useTranslation();
  
  return (
    <Text>
      {t('budget.alert.exceeded', { amount: 500 })}
    </Text>
  );
}

// en.json
{
  "budget": {
    "alert": {
      "exceeded": "Budget exceeded by {{amount}} SEK"
    }
  }
}

// sv.json
{
  "budget": {
    "alert": {
      "exceeded": "Budget överskridet med {{amount}} SEK"
    }
  }
}

// ❌ Bad: Hard-coded strings
function BudgetAlert() {
  return <Text>Budget exceeded by 500 SEK</Text>;
}
```

### 2. Currency & Date Formatting

```typescript
// ✅ Good: Locale-aware formatting
import { formatCurrency, formatDate } from '@/utils/formatting';

const amount = formatCurrency(245.50, 'SEK', 'sv-SE');
// "245,50 kr"

const date = formatDate(new Date(), 'sv-SE');
// "8 oktober 2025"
```

---

## Accessibility (a11y)

### 1. Use Semantic Labels

```typescript
// ✅ Good: Accessible components
<TouchableOpacity
  accessible={true}
  accessibilityLabel="View receipt details"
  accessibilityHint="Opens detailed view of this receipt"
  onPress={handlePress}
>
  <ReceiptCard receipt={receipt} />
</TouchableOpacity>

// ❌ Bad: No accessibility
<TouchableOpacity onPress={handlePress}>
  <ReceiptCard receipt={receipt} />
</TouchableOpacity>
```

### 2. Test IDs for Testing

```typescript
// ✅ Good: Include testID
<View testID="receipt-list">
  {receipts.map(r => (
    <ReceiptCard key={r.id} receipt={r} testID={`receipt-${r.id}`} />
  ))}
</View>
```

---

## Common Pitfalls to Avoid

### ❌ Don't:
1. Use `any` type in TypeScript
2. Store sensitive data unencrypted
3. Fetch all data without pagination
4. Write functions longer than 50 lines
5. Skip error handling
6. Hard-code strings (use i18n)
7. Commit secrets/API keys
8. Skip writing tests
9. Use inline styles everywhere (use styled-components or Tailwind)
10. Ignore accessibility

### ✅ Do:
1. Use strict TypeScript types
2. Encrypt sensitive data
3. Paginate large datasets
4. Write small, focused functions
5. Handle errors gracefully
6. Use i18n for all strings
7. Use environment variables
8. Write tests for business logic
9. Use consistent styling approach
10. Make components accessible

---

## When to Ask for Help

**Before implementing:**
- New third-party integration (OCR, payment, etc.)
- Database schema changes
- Breaking API changes
- Security-sensitive features

**During implementation:**
- Stuck for >30 minutes
- Unsure about architecture decision
- Performance concerns
- Accessibility questions

---

## Quick Reference

### Project Structure
```
/workspaces/whatebuy/
├── .github/              # GitHub configs, workflows, Copilot instructions
├── docs/                 # Project documentation
├── mobile/              # React Native app
│   ├── src/
│   │   ├── features/    # Feature-based modules
│   │   ├── shared/      # Shared components/utils
│   │   └── App.tsx
│   ├── __tests__/       # Tests
│   └── package.json
├── web/                 # Next.js web app
│   ├── app/             # App router
│   ├── components/      # React components
│   └── package.json
├── supabase/            # Database migrations, functions
│   ├── migrations/
│   └── functions/
├── shared/              # Shared code (types, utils)
│   └── src/
└── README.md
```

### Commands
```bash
# Mobile
cd mobile
npm run ios          # Run iOS simulator
npm run android      # Run Android emulator
npm test            # Run tests
npm run lint        # Lint code

# Web
cd web
npm run dev         # Development server
npm run build       # Production build
npm test           # Run tests

# Supabase
supabase start      # Start local instance
supabase db push    # Apply migrations
supabase functions serve  # Run edge functions locally
```

---

## Remember

> **"Make it work, make it right, make it fast - in that order."**
> 
> 1. **Work:** Get feature functional
> 2. **Right:** Refactor, add tests, document
> 3. **Fast:** Optimize if needed

**Code is read more often than it's written. Optimize for clarity.**

---

**End of Copilot Instructions**
