# Implementation Plan: Receiptor

**Project Name:** Receiptor  
**Tagline:** "The smart receipt tracker for households"  
**Version:** 1.0  
**Last Updated:** October 2025  
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technical Architecture](#technical-architecture)
3. [Development Phases](#development-phases)
4. [Detailed Feature Specifications](#detailed-feature-specifications)
5. [Technology Stack](#technology-stack)
6. [Database Schema](#database-schema)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Strategy](#testing-strategy)
11. [Timeline & Milestones](#timeline--milestones)
12. [Budget & Resources](#budget--resources)
13. [Risk Mitigation](#risk-mitigation)
14. [Success Metrics](#success-metrics)

---

## Executive Summary

### Mission
Build the best grocery budget tracking app for households, with superior security, multi-user capabilities, and international reach.

### Key Differentiators
1. **Household-first design** - Multi-user from day 1
2. **OAuth security** - Never store user credentials
3. **International** - Multi-country, multi-language
4. **Modern tech stack** - Fast, scalable, maintainable

### Target Launch
- **Alpha:** Month 2
- **Beta:** Month 3
- **Public Launch:** Month 4
- **Product-Market Fit:** Month 12

---

## Technical Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                               │
│            (iOS, Android, Web browsers)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                   API Gateway / CDN                          │
│              (CloudFlare for caching/security)              │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                  Application Layer                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   React Native Apps (iOS/Android)                    │   │
│  │   Next.js Web App                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                  Backend Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Supabase    │  │  Background  │  │   AI/ML      │     │
│  │  (Core DB)   │  │   Workers    │  │  Services    │     │
│  │  Auth, API   │  │  (Receipt    │  │ (Insights)   │     │
│  │              │  │   Sync)      │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│              External Integrations                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Grocery    │  │     OCR      │  │   Payment    │     │
│  │Store  APIs   │  │   Service    │  │   Gateway    │     │
│  │   OAuth      │  │   (Veryfi)   │  │   (Stripe)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Receipt Sync Flow:**
```
User connects store account
     ↓
OAuth authorization (user grants permission)
     ↓
Store token saved (encrypted)
     ↓
Background worker polls store API every 6 hours
     ↓
New receipts downloaded
     ↓
Receipt parsing & categorization
     ↓
Data stored in Supabase
     ↓
Real-time update to all household members
     ↓
Push notification sent
```

---

## Development Phases

### Phase 1: MVP (Months 1-4)

**Goal:** Launch functional app with core features

**Features:**
- ✅ User authentication (email, Google, Apple Sign-In)
- ✅ Household creation & invites
- ✅ Store integration (5-10 stores via OAuth or scraping)
- ✅ Automatic receipt sync
- ✅ Category-based budget tracking
- ✅ Basic analytics dashboard
- ✅ Mobile apps (iOS + Android)
- ✅ Multi-language (English, Swedish, Danish, Norwegian)

**Success Criteria:**
- 5K downloads
- 1K MAU
- 500 households
- 4.5+ star rating
- <10% crash rate

### Phase 2: Growth (Months 5-8)

**Goal:** Add premium features, expand integrations

**Features:**
- ✅ Manual receipt OCR upload
- ✅ AI spending insights
- ✅ Price trend tracking
- ✅ Premium subscription tier
- ✅ Export to CSV/Excel
- ✅ Additional stores (expand to 20+)
- ✅ Web app
- ✅ Budget forecasting

**Success Criteria:**
- 50K downloads
- 15K MAU
- 2K premium users
- $150K ARR

### Phase 3: Scale (Months 9-12)

**Goal:** Advanced features, international expansion

**Features:**
- ✅ Carbon footprint tracking
- ✅ Meal planning integration
- ✅ Deal & coupon alerts
- ✅ Shopping list creation
- ✅ Store price comparison
- ✅ Developer API (beta)
- ✅ Expand to Germany, UK

**Success Criteria:**
- 100K downloads
- 30K MAU
- 10K premium users
- $300K ARR
- Presence in 5+ countries

### Phase 4: Market Leadership (Year 2+)

**Goal:** Dominate category, expand globally

**Features:**
- B2B white-label offering
- Advanced ML recommendations
- Recipe suggestions based on purchases
- Inventory tracking
- Cashback/rewards integration
- Social features (share recipes, tips)
- US market entry

---

## Detailed Feature Specifications

### 1. Household Management

**Core Functionality:**
- Create household with name, members
- Invite via email or link
- Role-based permissions (admin, member, viewer)
- Leave/join households
- Multiple households per user

**User Stories:**
- As a user, I can create a household called "Smith Family"
- As a household admin, I can invite my partner via email
- As a household member, I can see all household receipts
- As a viewer, I can see data but not invite others

**Technical Implementation:**
```typescript
interface Household {
  id: string;
  name: string;
  created_at: Date;
  members: HouseholdMember[];
  settings: HouseholdSettings;
}

interface HouseholdMember {
  user_id: string;
  household_id: string;
  role: 'admin' | 'member' | 'viewer';
  joined_at: Date;
}
```

### 2. Store Integration (OAuth)

**Supported Stores (Initial):**
- ICA (Sweden)
- Coop (Scandinavia)
- Willys (Sweden)
- Hemköp (Sweden)
- LIDL (Europe)
- Citygross (Sweden)

**Integration Flow:**
1. User clicks "Connect Store"
2. Redirect to store OAuth page
3. User authorizes app
4. Store returns authorization code
5. Exchange code for access token
6. Store token (encrypted) in database
7. Begin background sync

**Fallback Strategy:**
- If store doesn't have OAuth: web scraping
- Use headless browser (Puppeteer)
- Store session cookies (encrypted)
- More fragile but works

**Technical Implementation:**
```typescript
interface StoreConnection {
  id: string;
  user_id: string;
  store_id: string;
  auth_type: 'oauth' | 'scraping';
  access_token?: string; // encrypted
  refresh_token?: string; // encrypted
  expires_at?: Date;
  last_sync: Date;
  status: 'active' | 'error' | 'expired';
}
```

### 3. Receipt Parsing & Categorization

**Parsing Strategy:**
```javascript
// Example receipt parsing logic
async function parseReceipt(rawReceipt) {
  // 1. Extract basic info
  const receipt = {
    store_id: extractStore(rawReceipt),
    date: extractDate(rawReceipt),
    total: extractTotal(rawReceipt),
    items: []
  };
  
  // 2. Parse line items
  const rawItems = extractItems(rawReceipt);
  
  // 3. Categorize each item
  for (const item of rawItems) {
    receipt.items.push({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: categorizItem(item.name), // AI/ML
      subcategory: subcategorizeItem(item.name),
      is_organic: detectOrganic(item.name),
      carbon_score: estimateCarbon(item)
    });
  }
  
  return receipt;
}
```

**Category Taxonomy:**
```
- Fruits & Vegetables
  - Fresh produce
  - Frozen
  - Organic
- Meat & Fish
  - Red meat
  - Poultry
  - Seafood
  - Plant-based alternatives
- Dairy & Eggs
  - Milk
  - Cheese
  - Yogurt
  - Eggs
- Grains & Bread
- Snacks & Candy
- Beverages
  - Alcoholic
  - Non-alcoholic
- Household items
- Baby products
- Pet food
- Other
```

### 4. Budget Tracking

**Budget Types:**
- Total monthly budget
- Category-specific budgets
- Per-person budgets
- Weekly/bi-weekly cycles

**Features:**
- Set budget amounts
- Track spend vs. budget
- Alerts when approaching limit
- Rollover unused budget
- Compare to previous periods

**UI Components:**
- Progress bars for each category
- Spending velocity indicator ("On track to spend X this month")
- Breakdown by household member
- Day-by-day spending graph

### 5. Analytics Dashboard

**Metrics Displayed:**
- Total spend (month, quarter, year)
- Spend by category (pie chart)
- Spend by store (bar chart)
- Spend trend over time (line chart)
- Average basket size
- Shopping frequency
- Spend per household member

**Advanced Analytics (Premium):**
- Price trends for common items
- Cheapest store for your basket
- Waste analysis (perishables bought but not used)
- Carbon footprint
- Comparison to similar households

---

## Technology Stack

### Frontend

**Mobile Apps:**
- **Framework:** React Native with TypeScript
- **State Management:** Zustand
- **Navigation:** React Navigation
- **UI Library:** React Native Paper + custom components
- **Charts:** Victory Native
- **Forms:** React Hook Form
- **API Client:** React Query

**Web App:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form
- **State:** Zustand

### Backend

**Core:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Realtime:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (for receipt images)
- **Functions:** Supabase Edge Functions (Deno)

**Background Jobs:**
- **Queue:** BullMQ with Redis
- **Scheduler:** Node-cron
- **Workers:** Separate Node.js processes

**AI/ML:**
- **Item Categorization:** OpenAI GPT-4 or fine-tuned model
- **OCR:** Veryfi or Taggun API
- **Insights:** Custom Python scripts with scikit-learn

### Infrastructure

**Hosting:**
- **Backend:** Supabase Cloud
- **Web App:** Vercel
- **Workers:** Railway or Fly.io
- **CDN:** CloudFlare

**Monitoring:**
- **Error Tracking:** Sentry
- **Analytics:** PostHog (self-hosted) or Mixpanel
- **Performance:** New Relic or DataDog
- **Logs:** Better Stack (LogTail)

**CI/CD:**
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions
- **Testing:** Jest, Playwright
- **Code Quality:** ESLint, Prettier, TypeScript

### Third-Party Services

**Essential:**
- **Payments:** Stripe
- **Email:** Resend or SendGrid
- **SMS:** Twilio (for 2FA if needed)
- **OCR:** Veryfi (receipt scanning)
- **Push Notifications:** OneSignal or Firebase Cloud Messaging

**Optional:**
- **Customer Support:** Intercom or Zendesk
- **Marketing:** Mailchimp or Customer.io

---

## Database Schema

### Core Tables

```sql
-- Users table (Supabase Auth)
-- Automatically managed by Supabase

-- User profiles (extended user data)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'SEK',
  country VARCHAR(2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Households
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Household members
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('admin', 'member', 'viewer')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- Store connections
CREATE TABLE store_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  store_id VARCHAR(50) NOT NULL, -- 'ica', 'coop', 'willys', etc.
  store_name TEXT,
  auth_type VARCHAR(20) CHECK (auth_type IN ('oauth', 'scraping')),
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  expires_at TIMESTAMP,
  last_sync TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('active', 'error', 'expired')),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Receipts
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  store_connection_id UUID REFERENCES store_connections(id),
  store_id VARCHAR(50),
  store_name TEXT,
  purchase_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SEK',
  receipt_number TEXT,
  raw_data JSONB, -- original receipt data
  image_url TEXT, -- for manual receipts
  source VARCHAR(20) CHECK (source IN ('automatic', 'manual')),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_household_date (household_id, purchase_date),
  INDEX idx_store_date (store_id, purchase_date)
);

-- Receipt items
CREATE TABLE receipt_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL(10,3),
  unit VARCHAR(20), -- 'kg', 'pcs', 'liters', etc.
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  subcategory VARCHAR(50),
  is_organic BOOLEAN DEFAULT FALSE,
  carbon_score INTEGER, -- grams of CO2e
  metadata JSONB, -- additional item info
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT,
  amount DECIMAL(10,2) NOT NULL,
  period VARCHAR(20) CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date DATE,
  category VARCHAR(50), -- null means overall budget
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories (for customization)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id), -- null = global category
  name TEXT NOT NULL,
  parent_category UUID REFERENCES categories(id),
  color VARCHAR(7), -- hex color
  icon TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Premium subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status VARCHAR(20) CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  plan VARCHAR(20) CHECK (plan IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics cache (for performance)
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  metric_type VARCHAR(50), -- 'monthly_total', 'category_breakdown', etc.
  period DATE, -- first day of period
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(household_id, metric_type, period)
);
```

### Indexes for Performance

```sql
-- Speed up common queries
CREATE INDEX idx_receipts_household_date ON receipts(household_id, purchase_date DESC);
CREATE INDEX idx_receipt_items_receipt ON receipt_items(receipt_id);
CREATE INDEX idx_receipt_items_category ON receipt_items(category);
CREATE INDEX idx_household_members_user ON household_members(user_id);
CREATE INDEX idx_store_connections_user ON store_connections(user_id);
```

---

## API Design

### RESTful Endpoints

**Authentication**
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

**Households**
```
GET    /api/households
POST   /api/households
GET    /api/households/:id
PATCH  /api/households/:id
DELETE /api/households/:id
POST   /api/households/:id/invite
POST   /api/households/:id/join
DELETE /api/households/:id/members/:userId
```

**Store Connections**
```
GET    /api/store-connections
POST   /api/store-connections/oauth/start
POST   /api/store-connections/oauth/callback
DELETE /api/store-connections/:id
POST   /api/store-connections/:id/sync
```

**Receipts**
```
GET    /api/receipts
GET    /api/receipts/:id
POST   /api/receipts/manual (with OCR upload)
DELETE /api/receipts/:id
PATCH  /api/receipts/:id/items/:itemId (edit categorization)
```

**Analytics**
```
GET    /api/analytics/overview?period=month&household_id=xxx
GET    /api/analytics/categories?period=month&household_id=xxx
GET    /api/analytics/trends?period=3months&household_id=xxx
GET    /api/analytics/compare?period=month&household_id=xxx
```

**Budgets**
```
GET    /api/budgets?household_id=xxx
POST   /api/budgets
PATCH  /api/budgets/:id
DELETE /api/budgets/:id
GET    /api/budgets/:id/status
```

**Subscriptions**
```
POST   /api/subscriptions/checkout
GET    /api/subscriptions/portal
GET    /api/subscriptions/status
POST   /api/subscriptions/cancel
```

### Realtime Subscriptions (Supabase)

```javascript
// Subscribe to new receipts for household
const subscription = supabase
  .channel('receipts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'receipts',
      filter: `household_id=eq.${householdId}`
    },
    (payload) => {
      console.log('New receipt!', payload.new);
      // Update UI
    }
  )
  .subscribe();
```

---

## Security Architecture

### Authentication & Authorization

**Authentication:**
- Email/password with email verification
- Google OAuth
- Apple Sign-In
- Magic link login (passwordless)
- 2FA optional (TOTP)

**Authorization (Row Level Security):**
```sql
-- Users can only see their own households
CREATE POLICY "Users can view own households"
ON households FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM household_members
    WHERE household_id = households.id
    AND user_id = auth.uid()
  )
);

-- Admins can update household
CREATE POLICY "Admins can update household"
ON households FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM household_members
    WHERE household_id = households.id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Members can view receipts
CREATE POLICY "Members can view receipts"
ON receipts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM household_members
    WHERE household_id = receipts.household_id
    AND user_id = auth.uid()
  )
);
```

### Data Encryption

**At Rest:**
- Database: Encrypted by Supabase (AES-256)
- Sensitive fields (tokens): Additional app-level encryption
- Receipt images: Encrypted in Supabase Storage

**In Transit:**
- All API calls over HTTPS/TLS 1.3
- Certificate pinning in mobile apps
- Strict Transport Security headers

**Encryption Implementation:**
```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

### OAuth Security

**Never Store User Passwords:**
- Use OAuth where available
- For scraping fallback: encrypt session tokens

**Token Management:**
- Refresh tokens before expiration
- Rotate tokens regularly
- Revoke tokens on disconnect

---

## Deployment Strategy

### Environments

**Development**
- Local development environment
- Supabase local instance
- Mock store APIs

**Staging**
- Supabase staging project
- Vercel preview deployments
- TestFlight (iOS) / Internal testing (Android)

**Production**
- Supabase production
- Vercel production
- App Store / Google Play

### Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  build-mobile:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: cd mobile && npx eas build --platform all
```

### Database Migrations

```bash
# Using Supabase CLI
supabase migration new add_carbon_scores
# Edit migration file
supabase db push
```

---

## Testing Strategy

### Unit Tests
- All utility functions
- Business logic (categorization, calculations)
- Target: 80%+ coverage

### Integration Tests
- API endpoints
- Database operations
- OAuth flows

### End-to-End Tests
- Critical user flows:
  - Sign up → create household → connect store → view receipt
  - Create budget → track spending → receive alert
  - Invite member → accept invite → view shared data

### Mobile Testing
- iOS: TestFlight beta
- Android: Internal testing track
- Device coverage: Latest 3 iOS versions, Android 11+

### Performance Testing
- Load testing: 1000+ concurrent users
- Database query optimization
- API response times < 200ms

---

## Timeline & Milestones

### Month 1: Foundation
**Weeks 1-2:**
- [x] Project setup (repositories, CI/CD)
- [x] Database schema design
- [x] Authentication implementation
- [ ] Basic UI components

**Weeks 3-4:**
- [ ] Household management
- [ ] Store connection (1-2 stores)
- [ ] Receipt parsing logic
- [ ] Basic analytics

### Month 2: Core Features
**Weeks 5-6:**
- [ ] Receipt sync background worker
- [ ] Category tracking
- [ ] Budget creation
- [ ] Mobile app navigation

**Weeks 7-8:**
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Alpha testing (internal)
- [ ] Bug fixes

### Month 3: Polish & Beta
**Weeks 9-10:**
- [ ] Additional store integrations (up to 5)
- [ ] Premium subscription setup
- [ ] Push notifications
- [ ] Onboarding flow

**Weeks 11-12:**
- [ ] Beta testing (50 users)
- [ ] Performance optimization
- [ ] Security audit
- [ ] App store submission prep

### Month 4: Launch
**Weeks 13-14:**
- [ ] App Store / Google Play approval
- [ ] Marketing website
- [ ] Public beta launch
- [ ] User feedback collection

**Weeks 15-16:**
- [ ] Bug fixes from beta
- [ ] Public launch
- [ ] Press outreach
- [ ] Community building

---

## Budget & Resources

### Development Team

**MVP (Months 1-4):**
- 1x Full-stack developer (You + 1 contractor?) - $20K-30K
- 1x UI/UX designer (contract) - $5K-10K
- 1x QA tester (part-time) - $3K-5K
- **Total:** $28K-45K

### Infrastructure Costs (Monthly)

**Year 1 Estimate:**
- Supabase: $25/mo → $100/mo (as users grow)
- Vercel: $20/mo
- Railway (workers): $10/mo
- Sentry: $26/mo
- PostHog: Free tier → $50/mo
- Veryfi OCR: $0.10/receipt × 1000/mo = $100/mo
- CloudFlare: Free tier
- **Total:** ~$181-300/mo = $2,172-3,600/year

### One-Time Costs
- App Store developer account: $99/year
- Google Play developer account: $25 one-time
- Domain name: $15/year
- SSL certificates: Free (Let's Encrypt)
- Design assets/icons: $200-500
- Legal (privacy policy, terms): $500-1000
- **Total:** ~$840-1,640

### Marketing Budget (Year 1)
- App Store Optimization: $1K
- Social media ads: $5K
- Content marketing: $2K
- Influencer partnerships: $3K
- **Total:** $11K

### Total Year 1 Budget
- Development: $28K-45K
- Infrastructure: $2K-4K
- One-time: $1K-2K
- Marketing: $11K
- **Grand Total:** $42K-62K

---

## Risk Mitigation

### Technical Risks

**Risk: Store integrations break**
- Mitigation: Monitor daily, have alerts, fallback to manual entry
- Impact: High / Likelihood: Medium

**Risk: Scalability issues**
- Mitigation: Load testing, database optimization, caching
- Impact: High / Likelihood: Low

**Risk: Data breach**
- Mitigation: Security audit, encryption, regular backups
- Impact: Critical / Likelihood: Low

### Business Risks

**Risk: Low user acquisition**
- Mitigation: Referral program, free tier, viral household sharing
- Impact: High / Likelihood: Medium

**Risk: Competitors add household sharing**
- Mitigation: Move fast, establish brand as "family app"
- Impact: Medium / Likelihood: High

**Risk: Stores block us**
- Mitigation: Official partnerships, OAuth, user control
- Impact: High / Likelihood: Low

### Legal Risks

**Risk: GDPR violations**
- Mitigation: Privacy-first design, legal review, compliance tools
- Impact: Critical / Likelihood: Low

**Risk: Terms of service violations (scraping)**
- Mitigation: Prefer OAuth, transparent with users
- Impact: Medium / Likelihood: Medium

---

## Success Metrics

### Product Metrics

**Acquisition:**
- Downloads per week
- Conversion rate (visit → install)
- Referral rate

**Activation:**
- % users who complete onboarding
- % users who connect first store
- Time to first receipt

**Engagement:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness)

**Retention:**
- Day 1, 7, 30 retention
- Churn rate
- LTV (Lifetime Value)

**Revenue:**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- Conversion to premium (%)

### Target Metrics

**Month 4 (Launch):**
- 5,000 downloads
- 1,000 MAU
- 20% DAU/MAU
- 500 households
- 4.5+ star rating

**Month 12 (PMF):**
- 100,000 downloads
- 30,000 MAU
- 25% DAU/MAU
- 10,000 households
- 10,000 premium users (10% conversion)
- $300K ARR
- 60% retention at day 30

---

## Next Steps (Immediate)

1. **Validate with users (Week 1)**
   - Interview 10 potential users
   - Download competitor apps
   - Document pain points

2. **Finalize tech stack (Week 1)**
   - Confirm Supabase vs alternatives
   - Set up development environment
   - Create project repositories

3. **Design wireframes (Week 2)**
   - Onboarding flow
   - Main dashboard
   - Household management
   - Budget tracking

4. **Start development (Week 2)**
   - Database setup
   - Authentication
   - Basic UI scaffold

5. **First store integration (Week 3-4)**
   - Research ICA or Coop API
   - Implement OAuth flow
   - Test receipt parsing

---

**Status:** Ready to begin implementation  
**Next Review:** End of Month 1  
**Owner:** [Your Name]

