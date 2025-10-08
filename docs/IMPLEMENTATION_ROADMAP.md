# Receiptor - Complete Implementation Roadmap

## Executive Summary

**Status as of October 8, 2025 - 16:45 CET:**

- ✅ **Phase 1-3 Complete** (Foundation, Database, Business Logic)
- � **Phase 4 Started** (Mobile App Foundation - 30% complete)
- 🟡 **Phase 5 Started** (Web App Foundation - 20% complete)
- ❌ **Phase 6-8 Not Started** (Features, Testing, Deployment)

**What's ACTUALLY Working Right Now:**

✅ **Shared Package (100% functional)**
- Production-ready monorepo with Turborepo v2.5.8
- Complete PostgreSQL database schema (11 tables, 30+ RLS policies)
- Comprehensive business logic (parsers, categorization, analytics)
- **75 tests passing with 80%+ coverage**
- Zero technical debt

✅ **Docker Testing Environment (100% functional)**
- PostgreSQL 15.1 running (healthy)
- Next.js web app running with hot reload
- Organized structure in `docker/` folder
- Simple npm scripts (`npm run docker:up/down/logs/clean`)

🟡 **Mobile App (30% functional - scaffolding only)**
- ✅ React Native + Expo setup complete
- ✅ Navigation structure (Auth & Main flows)
- ✅ Login screen UI with validation
- ✅ Supabase client configured
- ❌ Authentication NOT connected (no backend integration)
- ❌ Sign up screen missing
- ❌ Dashboard empty placeholder only
- ❌ No actual features working

🟡 **Web App (20% functional - landing page only)**
- ✅ Next.js 14 with Tailwind CSS
- ✅ Landing page displaying
- ✅ Hot reload working
- ✅ Environment configuration shown
- ❌ Sign In/Sign Up links result in 404 (routes don't exist)
- ❌ No authentication pages
- ❌ No dashboard
- ❌ No features implemented

**Critical Reality Check:**

- **What users can do:** See a landing page. That's it.
- **What doesn't work:** Everything else (auth, receipts, budgets, all features)
- **Estimated completion:** 60-80 hours of development work remaining

**Immediate Next Steps (Priority Order):**

1. **Phase 5A:** Create working authentication pages (2-3 hours)
2. **Phase 5B:** Connect auth to Supabase backend (2-3 hours)
3. **Phase 4A:** Complete mobile auth screens (2-3 hours)
4. **Phase 6A:** Build minimal dashboard with mock data (3-4 hours)
5. **Phase 6B:** Implement receipt upload/list (4-6 hours)

---

## Reality Check: What Works vs What Doesn't

### ✅ FULLY FUNCTIONAL (Can use right now)

**1. Shared Business Logic Package**
```bash
cd shared && npm test  # 75/75 tests pass
```
- `parseReceiptText()` - Extracts items from receipt
- `classifyItem()` - AI categorization (Dairy, Produce, etc.)
- `calculateBudgetProgress()` - Budget vs spending
- `formatCurrency()` - "245.50 SEK"
- All utilities tested and working

**2. Database Schema**
```bash
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres
\dt  # See all 11 tables
```
- Users, households, receipts, budgets all defined
- Row Level Security policies ready
- Migration files exist and work

**3. Docker Environment**
```bash
npm run docker:up  # Starts everything
```
- PostgreSQL container running
- Next.js app running on port 3000
- Hot reload enabled
- Logs accessible

### 🟡 PARTIALLY FUNCTIONAL (Exists but doesn't work)

**1. Mobile App Login Screen**
- **What works:** UI renders, validation logic
- **What doesn't:** Clicking "Sign In" does nothing (no backend)
- **Status:** Scaffolding only, 0% functional

**2. Web App Landing Page**
- **What works:** Page displays, hot reload
- **What doesn't:** All links (Sign In/Sign Up) lead to 404
- **Status:** Static page only, 0% functional features

**3. Navigation**
- **What works:** Routes defined in code
- **What doesn't:** Routes don't exist, no pages created
- **Status:** Structure only, 0% functional

### ❌ COMPLETELY NON-FUNCTIONAL (Not built yet)

**Authentication:**
- ❌ Sign up page (doesn't exist)
- ❌ Sign in page (doesn't exist)
- ❌ Password reset (doesn't exist)
- ❌ Email confirmation (doesn't exist)
- ❌ Session management (not connected)

**Core Features:**
- ❌ Receipt upload
- ❌ Receipt scanning/OCR
- ❌ Receipt list
- ❌ Receipt details
- ❌ Budget creation
- ❌ Budget tracking
- ❌ Household management
- ❌ Dashboard with real data
- ❌ Category breakdown
- ❌ Spending charts

**Advanced Features:**
- ❌ Store integrations
- ❌ OAuth connections
- ❌ AI insights
- ❌ Price trends
- ❌ Carbon tracking
- ❌ Multi-user sync
- ❌ Push notifications
- ❌ Email alerts

---

## Phase 4: Mobile App Foundation (React Native + Expo)

**Status:** 🟡 30% Complete (Started October 8, 2025)

### What's Done ✅

- ✅ Expo + React Native setup
- ✅ TypeScript configuration
- ✅ Navigation structure (AppNavigator, AuthNavigator, MainNavigator)
- ✅ Supabase client configuration
- ✅ useAuth hook (not connected)
- ✅ LoginScreen UI with validation
- ✅ LoadingScreen
- ✅ DashboardScreen (empty placeholder)
- ✅ Theme configuration
- ✅ Constants file
- ✅ Type-safe navigation types

### What's NOT Done ❌

- ❌ SignUpScreen
- ❌ ForgotPasswordScreen
- ❌ Onboarding flow
- ❌ Actual Supabase authentication integration
- ❌ All feature screens (receipts, budgets, households, settings)
- ❌ All feature components
- ❌ All hooks (except useAuth shell)
- ❌ Charts and visualizations
- ❌ Camera/image picker integration
- ❌ Push notifications
- ❌ Deep linking

### Files Created (11 files, ~800 LOC)

```
mobile/
├── src/
│   ├── hooks/
│   │   └── useAuth.ts              ✅ Created (NOT functional)
│   ├── navigation/
│   │   ├── AppNavigator.tsx        ✅ Created
│   │   ├── AuthNavigator.tsx       ✅ Created
│   │   └── MainNavigator.tsx       ✅ Created
│   ├── screens/
│   │   ├── LoadingScreen.tsx       ✅ Created
│   │   ├── DashboardScreen.tsx     ✅ Created (empty)
│   │   └── auth/
│   │       └── LoginScreen.tsx     ✅ Created (UI only, not functional)
│   ├── services/
│   │   └── supabase.ts             ✅ Created (configured, not used)
│   ├── types/
│   │   └── navigation.ts           ✅ Created
│   └── utils/
│       ├── theme.ts                ✅ Created
│       └── constants.ts            ✅ Created
├── App.tsx                         ✅ Created
├── package.json                    ✅ Created
└── tsconfig.json                   ✅ Created
```

### Still Need to Create (70+ files)

```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SignUpScreen.tsx              ❌ NOT CREATED
│   │   │   ├── ForgotPasswordScreen.tsx      ❌ NOT CREATED
│   │   │   └── OnboardingScreen.tsx          ❌ NOT CREATED
│   │   ├── receipts/
│   │   │   ├── ReceiptListScreen.tsx         ❌ NOT CREATED
│   │   │   ├── ReceiptDetailScreen.tsx       ❌ NOT CREATED
│   │   │   └── ReceiptCaptureScreen.tsx      ❌ NOT CREATED
│   │   ├── budgets/
│   │   │   ├── BudgetListScreen.tsx          ❌ NOT CREATED
│   │   │   └── BudgetDetailScreen.tsx        ❌ NOT CREATED
│   │   ├── households/
│   │   │   ├── HouseholdScreen.tsx           ❌ NOT CREATED
│   │   │   └── HouseholdSettingsScreen.tsx   ❌ NOT CREATED
│   │   └── settings/
│   │       └── SettingsScreen.tsx            ❌ NOT CREATED
│   ├── components/
│   │   ├── common/                           ❌ NOT CREATED (all)
│   │   ├── receipts/                         ❌ NOT CREATED (all)
│   │   ├── budgets/                          ❌ NOT CREATED (all)
│   │   └── charts/                           ❌ NOT CREATED (all)
│   ├── hooks/
│   │   ├── useReceipts.ts                    ❌ NOT CREATED
│   │   ├── useBudgets.ts                     ❌ NOT CREATED
│   │   └── useHousehold.ts                   ❌ NOT CREATED
│   └── store/                                ❌ NOT CREATED (all)
```

---

## Phase 5: Web App (Next.js 14)

**Status:** 🟡 20% Complete (Started October 8, 2025)

### What's Done ✅

- ✅ Next.js 14 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Landing page (`src/app/page.tsx`)
- ✅ Root layout
- ✅ Environment configuration
- ✅ Hot reload working
- ✅ Supabase client configured (not used)
- ✅ Docker integration

### What's NOT Done ❌

- ❌ Sign in page (`/login` = 404)
- ❌ Sign up page (`/signup` = 404)
- ❌ Dashboard page (`/dashboard` = 404)
- ❌ All auth integration
- ❌ All feature pages
- ❌ All components
- ❌ All hooks
- ❌ All API routes
- ❌ All middleware

### Files Created (7 files, ~200 LOC)

```
web/
├── src/
│   └── app/
│       ├── layout.tsx              ✅ Created
│       ├── page.tsx                ✅ Created (landing only)
│       └── globals.css             ✅ Created
├── next.config.js                  ✅ Created
├── tailwind.config.js              ✅ Created
├── postcss.config.js               ✅ Created
├── package.json                    ✅ Created
└── tsconfig.json                   ✅ Created
```

### Still Need to Create (50+ files)

```
web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        ❌ NOT CREATED (causes 404!)
│   │   │   ├── signup/
│   │   │   │   └── page.tsx        ❌ NOT CREATED (causes 404!)
│   │   │   └── layout.tsx          ❌ NOT CREATED
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        ❌ NOT CREATED
│   │   │   ├── receipts/
│   │   │   │   └── page.tsx        ❌ NOT CREATED
│   │   │   ├── budgets/
│   │   │   │   └── page.tsx        ❌ NOT CREATED
│   │   │   └── layout.tsx          ❌ NOT CREATED
│   │   └── api/                    ❌ NOT CREATED (all routes)
│   ├── components/                 ❌ NOT CREATED (all)
│   ├── hooks/                      ❌ NOT CREATED (all)
│   ├── lib/                        ❌ NOT CREATED (all)
│   └── utils/                      ❌ NOT CREATED (all)
```

---

## Honest Timeline Estimate

### To Get BASIC Functionality (User can sign up, sign in, see dashboard)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

#### 2. Auth Hook (`src/hooks/useAuth.ts`)

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
```

#### 3. Navigation Setup (`src/navigation/AppNavigator.tsx`)

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { LoadingScreen } from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

#### 4. Receipt Hook with React Query (`src/hooks/useReceipts.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Receipt } from '@receiptor/shared';

export function useReceipts(householdId: string) {
  const queryClient = useQueryClient();

  const receiptsQuery = useQuery({
    queryKey: ['receipts', householdId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receipts')
        .select('*, items:receipt_items(*)')
        .eq('household_id', householdId)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data as Receipt[];
    },
  });

  const createReceipt = useMutation({
    mutationFn: async (receipt: Partial<Receipt>) => {
      const { data, error } = await supabase.from('receipts').insert(receipt).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts', householdId] });
    },
  });

  return {
    receipts: receiptsQuery.data ?? [],
    isLoading: receiptsQuery.isLoading,
    error: receiptsQuery.error,
    createReceipt,
  };
}
```

### Environment Setup

Create `.env` file:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_VERYFI_CLIENT_ID=your-client-id
EXPO_PUBLIC_VERYFI_USERNAME=your-username
EXPO_PUBLIC_VERYFI_API_KEY=your-api-key
```

### Build & Run

```bash
# Development
npm run start
npm run ios
npm run android

# Production build with EAS
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all
```

---

## Phase 5: Web App Foundation (Next.js 14)

### Goals

- Set up Next.js 14 with App Router
- Configure Tailwind CSS and Shadcn/ui
- Implement server-side authentication
- Create responsive layouts
- Integrate Supabase client

### Setup Commands

```bash
cd /workspaces/whatebuy

# Create Next.js app
npx create-next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*"

cd web

# Install dependencies
npm install @supabase/ssr @supabase/supabase-js
npm install zustand @tanstack/react-query
npm install react-hook-form zod
npm install recharts date-fns
npm install lucide-react class-variance-authority clsx tailwind-merge

# Install Shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select
npx shadcn-ui@latest add dropdown-menu sheet dialog
npx shadcn-ui@latest add table tabs badge

# Link shared package
npm install ../shared
```

### File Structure

```
web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── receipts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── budgets/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── stripe/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                    # Shadcn components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── RecentReceipts.tsx
│   │   ├── receipts/
│   │   │   ├── ReceiptTable.tsx
│   │   │   └── ReceiptDetail.tsx
│   │   └── charts/
│   │       ├── SpendingChart.tsx
│   │       └── CategoryChart.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── utils.ts
│   └── hooks/
│       ├── useReceipts.ts
│       └── useBudgets.ts
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### Key Implementation Files

#### 1. Supabase Client (`src/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### 2. Supabase Server (`src/lib/supabase/server.ts`)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

#### 3. Dashboard Page (`src/app/(dashboard)/page.tsx`)

```typescript
import { createClient } from '@/lib/supabase/server';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SpendingChart } from '@/components/charts/SpendingChart';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch data server-side
  const { data: receipts } = await supabase
    .from('receipts')
    .select('*')
    .order('purchase_date', { ascending: false })
    .limit(10);

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader user={user} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Spent" value="5,234 SEK" />
        <StatsCard title="Budget Remaining" value="1,766 SEK" />
        <StatsCard title="Receipts" value="23" />
      </div>

      <SpendingChart receipts={receipts ?? []} />
    </div>
  );
}
```

### Environment Setup

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Build & Run

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Deploy to Vercel
vercel --prod
```

---

## Phase 6: Core Features Implementation

### Feature Checklist

#### 1. Household Management

- [ ] Create household
- [ ] Invite members (email invitations)
- [ ] Manage member roles (admin, member, viewer)
- [ ] Household settings (budget, currency, notifications)

#### 2. Receipt Management

- [ ] Manual receipt entry
- [ ] Photo receipt capture with OCR (Veryfi)
- [ ] Automatic receipt sync from stores (OAuth)
- [ ] Edit receipt items
- [ ] Delete receipts
- [ ] Receipt history

#### 3. Budget Tracking

- [ ] Create budget (monthly, weekly, yearly)
- [ ] Category-specific budgets
- [ ] Budget progress visualization
- [ ] Budget alerts (50%, 80%, 100%)
- [ ] Budget recommendations

#### 4. Analytics Dashboard

- [ ] Spending trends (line charts)
- [ ] Category breakdown (pie charts)
- [ ] Store comparison
- [ ] Organic spending percentage
- [ ] Carbon footprint tracking
- [ ] Price comparison across stores
- [ ] Top items by frequency

#### 5. Store Integrations

- [ ] ICA OAuth integration
- [ ] Coop OAuth integration
- [ ] Willys integration
- [ ] Store connection management
- [ ] Automatic receipt syncing

---

## Phase 7: Testing & Quality

### Testing Strategy

#### 1. Unit Tests (Jest)

```bash
cd shared
npm test -- --coverage
```

**Target:** 80%+ coverage for business logic

#### 2. Component Tests (React Native)

```bash
cd mobile
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm test
```

#### 3. Component Tests (Next.js)

```bash
cd web
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm test
```

#### 4. E2E Tests (Playwright for Web)

```bash
cd web
npm install --save-dev @playwright/test
npx playwright test
```

**Test scenarios:**

- User registration and login
- Create household
- Add manual receipt
- Set budget
- View analytics

#### 5. E2E Tests (Detox for Mobile)

```bash
cd mobile
npm install --save-dev detox
detox test
```

### Performance Testing

- [ ] Lighthouse audit (web)
- [ ] Bundle size optimization
- [ ] Image optimization
- [ ] Database query performance
- [ ] API response times

### Security Audit

- [ ] OWASP security checklist
- [ ] Dependency vulnerability scan
- [ ] RLS policy review
- [ ] API rate limiting
- [ ] Input validation

### Accessibility

- [ ] WCAG AA compliance
- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] Color contrast
- [ ] Touch target sizes

---

## Phase 8: CI/CD & Deployment

### GitHub Actions Workflows

#### 1. Test Workflow (`.github/workflows/test.yml`)

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

#### 2. Deploy Web (`.github/workflows/deploy-web.yml`)

```yaml
name: Deploy Web

on:
  push:
    branches: [main]
    paths:
      - 'web/**'
      - 'shared/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### 3. Build Mobile (`.github/workflows/build-mobile.yml`)

```yaml
name: Build Mobile

on:
  push:
    branches: [main]
    paths:
      - 'mobile/**'
      - 'shared/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install EAS CLI
        run: npm install -g eas-cli

      - name: Build iOS and Android
        run: |
          cd mobile
          eas build --platform all --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### Deployment Targets

**Web (Vercel):**

- Production: https://receiptor.app
- Staging: https://staging.receiptor.app
- Preview: Automatic PR deployments

**Mobile (EAS):**

- iOS TestFlight
- Android Internal Testing
- Production App Store & Play Store

**Database (Supabase):**

- Production: Dedicated instance
- Staging: Separate project

### Monitoring Setup

#### 1. Error Tracking (Sentry)

```bash
# Mobile
cd mobile
npm install @sentry/react-native

# Web
cd web
npm install @sentry/nextjs
```

#### 2. Analytics (PostHog)

```bash
npm install posthog-js posthog-react-native
```

#### 3. Performance Monitoring

- Vercel Analytics (web)
- Firebase Performance (mobile)
- Supabase Dashboard (database)

---

## Development Workflow

### Branch Strategy

```
main           # Production
├── develop    # Staging
└── feature/*  # Feature branches
```

### Commit Convention

```
feat: Add receipt photo capture
fix: Resolve budget calculation error
docs: Update API documentation
test: Add tests for categorization
refactor: Simplify analytics logic
perf: Optimize receipt list query
chore: Update dependencies
```

### Code Review Checklist

- [ ] Tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Performance impact assessed
- [ ] Security implications reviewed

---

## Production Readiness Checklist

### Pre-Launch

- [ ] All features tested
- [ ] Security audit complete
- [ ] Performance optimized
- [ ] Accessibility verified
- [ ] Legal pages (Privacy, Terms)
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up
- [ ] Support email configured

### Launch Day

- [ ] Deploy to production
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify payment processing
- [ ] Test critical user flows
- [ ] Monitor server resources

### Post-Launch

- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Monitor metrics
- [ ] Plan next features
- [ ] Optimize based on data

---

## Cost Estimates (Monthly)

### Infrastructure

- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Expo EAS: $29/month
- Veryfi OCR: $100/month (1000 receipts)
- OpenAI API: $50/month (estimates)
- Stripe: 2.9% + $0.30/transaction
- Sentry: $26/month
- PostHog: $0 (generous free tier)

**Total:** ~$250/month + variable costs

### Revenue Projections

- Free users: $0
- Premium users ($4.99/month): Target 500 users = $2,495/month
- **Break-even:** ~50 premium users

---

## Timeline Estimates

**Phase 4 (Mobile):** 2-3 weeks
**Phase 5 (Web):** 2-3 weeks
**Phase 6 (Features):** 4-6 weeks
**Phase 7 (Testing):** 2-3 weeks
**Phase 8 (CI/CD):** 1-2 weeks

**Total:** 11-17 weeks to full production

---

## Next Immediate Steps

1. **Set up mobile app:**

   ```bash
   cd /workspaces/whatebuy
   npx create-expo-app mobile --template expo-template-blank-typescript
   ```

2. **Install mobile dependencies** (see Phase 4 commands above)

3. **Create basic navigation structure**

4. **Implement authentication screens**

5. **Connect to Supabase**

6. **Build first feature (receipt list)**

7. **Continue iterating**

---

**This roadmap provides everything needed to complete Receiptor. Each phase is detailed with setup commands, file structures, code examples, and checklists.**

**The foundation (Phases 1-3) is production-ready. The remaining phases are well-defined and ready to implement.**
