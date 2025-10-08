# Receiptor - Grocery Budget Tracking App

**The smart receipt tracker for households**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, secure, household-first grocery budget tracking application with automatic receipt collection, AI-powered categorization, and real-time collaboration.

## 🎯 Key Features

- ✅ **Multi-user households** - Unlimited family members (Premium)
- 🔐 **OAuth 2.0 security** - Never store your passwords
- 📱 **Cross-platform** - iOS, Android, and Web
- 🤖 **AI-powered insights** - Smart categorization and recommendations
- 🌍 **International** - 10+ countries, multi-language
- 📊 **Advanced analytics** - Carbon tracking, price trends
- 💰 **Freemium model** - Free tier + Premium ($4.99/mo)

This repository contains comprehensive competitive research and analysis of grocery budget tracking apps in the Scandinavian market, with detailed implementation plans for building **Receiptor** - a superior product focused on household collaboration and security.

## 📁 Repository Contents

### Core Documentation (in `/docs` folder)

**[1_MARKET_ANALYSIS.md](./docs/1_MARKET_ANALYSIS.md)** - Market Research & Competitive Landscape
- Complete analysis of successful grocery budget tracking apps
- Market validation and opportunity sizing
- User insights and pain points
- Revenue model and go-to-market strategy
- **Start here for business context**

**[2_PRODUCT_SPECIFICATION.md](./docs/2_PRODUCT_SPECIFICATION.md)** - Product Features & User Experience
- Detailed feature specifications
- User personas and journey maps
- UI/UX requirements and wireframes
- Core features and MVP scope
- **Start here for product definition**

**[IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md)** - Technical Roadmap
- Complete technical architecture
- Database schema and API design
- 4-phase development plan with timelines
- Technology stack decisions
- Security architecture
- Budget breakdown ($42K-62K Year 1)
- **Start here for development planning**

**[TECHNICAL_ARCHITECTURE.md](./docs/TECHNICAL_ARCHITECTURE.md)** - Technical Deep Dive
- System architecture diagrams
- Data flow documentation
- Technology stack recommendations
- Scalability considerations
- **Reference for technical decisions**

---

## 🎯 Key Findings Summary

### Market Overview
We've analyzed **two successful grocery budget tracking apps** operating primarily in Scandinavia (Sweden, Denmark, Norway):

**Competitor A:**
- 50,000+ downloads
- 3 countries (Denmark, Sweden, Norway)
- 4 store integrations
- Free model (revenue from data sales)

**Competitor B:**
- Active in Sweden
- 6 store integrations (Swedish market)
- Household/partner sharing feature
- Free model

### What Both Competitors Do Well

- ✅ **Automatic receipt collection** - Core value proposition works
- ✅ **Free model** - Removes barrier to entry
- ✅ **Category tracking** - Users love seeing spending breakdown
- ✅ **Digital-first** - Fits Scandinavian market perfectly

### Their Critical Gaps (Our Opportunities)

1. **❌ Incomplete Household Sharing** - BIGGEST GAP
   - Competitor A: No household sharing at all (major user complaint!)
   - Competitor B: Limited 1-to-1 partner sharing only
   - **Our Edge:** True multi-user households (unlimited family members)

2. **❌ Security Concerns**
   - Both: Require storing grocery store credentials (risky!)
   - **Our Edge:** OAuth 2.0 - never store passwords

3. **❌ Limited Geographic Reach**
   - Combined: Only 3 countries max
   - **Our Edge:** International from day 1 (10+ countries)

4. **❌ Limited Store Coverage**
   - 4-6 stores each (incomplete data)
   - **Our Edge:** 20+ stores per market

5. **❌ No Manual Upload**
   - Automatic only (misses cash purchases, small stores)
   - **Our Edge:** OCR for manual receipt scanning

6. **❌ Basic Analytics Only**
   - Simple category breakdowns
   - **Our Edge:** AI insights, carbon tracking, price trends

7. **❌ No Premium Tier**
   - Free only, limited monetization
   - **Our Edge:** Freemium model ($4.99/mo premium)

8. **❌ No Developer Ecosystem**
   - Closed platforms
   - **Our Edge:** Public API for integrations

### Validation
Combined user base proves:
- ✅ People want automated grocery tracking
- ✅ Free model works for user acquisition
- ✅ Market is underserved (<1% penetration)
- ✅ Clear differentiation opportunities exist

---

## 📊 Market Opportunity

### Target Market
- **Primary:** Scandinavia (compete directly with both)
- **Secondary:** UK, Germany, France, Spain
- **Tertiary:** US, Canada, Asia-Pacific

### Addressable Market
- **Scandinavia:** ~2-3M potential users (current penetration <1%)
- **Europe:** ~20M potential users
- **Global:** ~100M+ potential users

### Validation
Market is proven but still in early stages:
- ✅ 50,000+ combined users validates demand
- ✅ Both competitors still growing
- ✅ No dominant leader yet
- ✅ Room for innovation and disruption

---

## 🚀 Our Strategy

### Phase 1: MVP (Months 1-4)
**Build better version with critical features:**
- Household sharing (key differentiator)
- OAuth-based integrations (safer)
- 5-10 stores per market
- Beautiful, bug-free UX
- Multi-language support

**Goal:** 5,000 downloads, 1,000 active users

### Phase 2: Growth (Months 5-12)
**Expand and differentiate:**
- Manual receipt scanning (OCR)
- AI insights and recommendations
- Price comparison
- Carbon footprint tracking
- 5 countries, 50+ stores

**Goal:** 100,000 downloads, 30,000 active users, $300K ARR

### Phase 3: Scale (Year 2+)
**Become market leader:**
- Enter US market
- Meal planning integration
- B2B white-label offering
- Developer API ecosystem
- 20+ countries

**Goal:** 1M+ downloads, $2.5M ARR, profitability

---

## 💰 Business Model

### Free Tier
- All core features
- Up to 3 household members
- Basic analytics
- 6 months history

### Premium Tier ($4.99/month or $49.99/year)
- Unlimited household members
- Advanced AI insights
- Unlimited history
- Price comparison & deals
- Carbon footprint tracking
- Export features
- Priority support

### Additional Revenue
- Anonymized data sales (opt-in, transparent)
- White-label licensing to grocery chains
- Affiliate commissions (deals, cashback)
- API access for developers

**Revenue Mix (Year 2 target):**
- 40% Premium subscriptions
- 30% Affiliate/cashback
- 20% Data insights
- 10% White-label

---

## 🛠 Technology Stack (Recommended)

### Mobile
- **React Native** (cross-platform: iOS + Android + Web)
- TypeScript for type safety
- React Query for data fetching
- Zustand or Redux for state management

### Backend
- **Supabase** (PostgreSQL, Auth, Storage, Functions)
  - More cost-effective than Firebase at scale
  - Open-source, self-hostable if needed
  - PostgreSQL is battle-tested
  
**Alternative:** Firebase (faster setup, higher costs)

### Additional Services
- **OCR:** Veryfi or Taggun for receipt scanning
- **Analytics:** PostHog (self-hosted) or Mixpanel
- **Monitoring:** Sentry for error tracking
- **CDN:** CloudFlare
- **Email:** SendGrid or Resend

### Infrastructure
- **Hosting:** Vercel (web) + Supabase (backend)
- **CI/CD:** GitHub Actions
- **Testing:** Jest + Playwright
- **Version Control:** GitHub

---

## 📈 Success Metrics

### MVP (Month 4)
- 5,000 downloads
- 1,000 MAU
- 500 households using multi-user
- 4.5+ star rating
- <10% crash rate

### Product-Market Fit (Month 12)
- 100,000 downloads
- 30,000 MAU
- 10,000 paying users
- $300K ARR
- 4.7+ star rating
- <5% monthly churn

### Market Leadership (Year 2)
- 1M+ downloads
- 200K MAU
- $2.5M ARR
- Profitability
- Top 3 in category in 5+ countries

---

## 💡 Key Differentiators

### vs Both Competitors
| Feature | Competitor A | Competitor B | Us |
|---------|--------------|--------------|-----|
| Household sharing | ❌ None | ⚠️ 1-to-1 only | ✅ **Unlimited members** |
| Store integrations | 4 | 6 | 20+ |
| Countries | 3 | 1 | 10+ |
| Languages | 3 (Nordic) | 1 (Swedish) | 10+ |
| Integration method | Credentials | Credentials | OAuth 2.0 |
| Manual receipts | ❌ | ❌ | ✅ OCR |
| AI insights | ❌ | ❌ | ✅ |
| Carbon tracking | ❌ | ❌ | ✅ |
| Premium tier | ❌ | ❌ | ✅ |
| API | ❌ | ❌ | ✅ |
| Web app | ❌ | ❌ | ✅ |

### vs General Budget Apps (Mint, YNAB)
- **Grocery-specific** - Deep category insights
- **Automatic** - No manual entry needed
- **Multi-store** - All receipts in one place
- **Household-aware** - Designed for families
- **Sustainability** - Carbon footprint tracking

---

## 🎯 Next Steps

### Immediate (This Week)
- [x] Complete competitive analysis ✅
- [x] Create implementation plan ✅
- [ ] Download and test competitor apps firsthand
- [ ] Interview 10 potential users
- [ ] Validate household sharing demand
- [ ] Create detailed feature specification
- [ ] Start UX/UI wireframes

### Short-term (Next 2 Weeks)
- [ ] Finalize tech stack decision
- [ ] Set up development environment
- [ ] Design database schema
- [ ] Create API architecture
- [ ] Research store APIs and OAuth integration options
- [ ] Set up project management tools
- [ ] Begin MVP development

### Medium-term (Next Month)
- [ ] Backend MVP complete
- [ ] Mobile app scaffolding
- [ ] First 2-3 store integrations working
- [ ] Authentication flow complete
- [ ] Household management implemented
- [ ] Basic dashboard UI
- [ ] Alpha testing internally

---

## 📚 Research Methodology

### Data Sources
1. **Website Analysis:** Competitor websites (Scandinavia-based apps)
2. **Privacy Policies:** Detailed GDPR documentation
3. **Terms of Service:** User agreement analysis
4. **App Stores:** Google Play Store and Apple App Store listings
5. **User Reviews:** Google Play, Apple App Store, testimonials

### Anonymization
- Company names removed (referred to as "Competitor A" and "Competitor B")
- Specific brand details generalized
- Focus on features, gaps, and opportunities
- Avoids copyright/trademark issues

### What We Have
- ✅ Complete feature analysis of both competitors
- ✅ Inferred technical architecture
- ✅ User feedback and pain points
- ✅ Market sizing and opportunity
- ✅ Detailed implementation plan

### What We Don't Have (Yet)
- [ ] Hands-on app testing (download needed)
- [ ] Direct user interviews
- [ ] Actual API documentation (proprietary)
- [ ] Source code (closed source)
- [ ] Internal metrics (private)

### Limitations
- Architecture is **inferred** from public information
- Some technical details are **educated guesses**
- Revenue numbers are **estimated**
- Need to validate assumptions through testing

---

## 🤝 Contributing

This is currently a private research project. If you'd like to contribute or collaborate:
1. Review the documentation
2. Test WhatIBuy app
3. Identify additional gaps or opportunities
4. Suggest improvements to our strategy

---

## 📞 Contact & Next Steps

**Questions?** Review the documentation or create issues for discussion.

**Ready to build?** Start with the market analysis, then review the product specification and implementation plan.

---

## 📄 License

---

## 📄 License

This research documentation is for planning purposes. Any code we develop will be under an appropriate open-source license (TBD).

---

## 🎉 Conclusion

**The opportunity is clear:**
- ✅ Market validated by two successful competitors (50K+ users)
- ✅ Clear gaps to address (household sharing is #1)
- ✅ Technology advantage (OAuth, modern stack, AI)
- ✅ International expansion potential (they're Nordic-locked)
- ✅ Multiple revenue streams possible (freemium model)
- ✅ Early stage market (<1% penetration)

**Competitive advantages are significant:**
1. ⭐ Household sharing (families are underserved)
2. 🔐 OAuth security (no credential storage)
3. 🌍 Global reach (10+ countries vs 1-3)
4. 🤖 AI insights (advanced analytics)
5. 💰 Better monetization (premium tier)

**We can build a better product and capture significant market share.**

Let's do this! 🚀

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (use `nvm use` to auto-switch)
- npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/enoch85/whatebuy.git
cd whatebuy

# Install dependencies (monorepo)
npm install

# Build shared package
cd shared && npm run build

# Start development
npm run dev
```

### Project Structure

```
whatebuy/
├── .github/              # GitHub Actions, Copilot instructions
├── docs/                 # Comprehensive documentation
│   ├── 1_MARKET_ANALYSIS.md
│   ├── 2_PRODUCT_SPECIFICATION.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── TECHNICAL_ARCHITECTURE.md
├── shared/              # Shared TypeScript types & utilities
│   ├── src/
│   │   ├── types/       # Entity definitions, enums
│   │   ├── validation/  # Zod schemas
│   │   └── utils/       # Pure functions
│   └── package.json
├── mobile/              # React Native app (iOS/Android) [Coming soon]
├── web/                 # Next.js web app [Coming soon]
├── supabase/            # Database, migrations, functions [Coming soon]
└── package.json         # Monorepo root
```

## 📚 Documentation

- **[Market Analysis](./docs/1_MARKET_ANALYSIS.md)** - Competitive landscape, market opportunity
- **[Product Specification](./docs/2_PRODUCT_SPECIFICATION.md)** - Features, UX, user personas
- **[Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)** - Technical roadmap, timeline, budget
- **[Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)** - System design, data flow
- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI coding assistant guidelines

## 🛠 Technology Stack

### Frontend
- **Mobile:** React Native + TypeScript + Expo
- **Web:** Next.js 14 (App Router) + Tailwind CSS
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **UI:** React Native Paper + Shadcn/ui

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Email, Google, Apple)
- **Realtime:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (encrypted)
- **Functions:** Supabase Edge Functions (Deno)

### Infrastructure
- **Monorepo:** Turborepo
- **Testing:** Jest + React Testing Library + Playwright
- **CI/CD:** GitHub Actions
- **Linting:** ESLint + Prettier + TypeScript
- **Deployment:** Vercel (web) + EAS (mobile)

## 📦 Packages

### `@receiptor/shared`
Core business logic, types, and utilities shared across all platforms.

```typescript
import { formatCurrency, calculateBudgetProgress } from '@receiptor/shared';

const formatted = formatCurrency(1234.56, 'SEK'); // "1 234,56 kr"
const progress = calculateBudgetProgress(receipts, 5000);
```

**Status:** ✅ Complete (v0.1.0)
- TypeScript types for all entities
- Zod validation schemas
- Budget calculation utilities
- Currency/date formatters
- 80%+ test coverage

### `mobile` (React Native)
**Status:** 🚧 Coming in Phase 4

### `web` (Next.js)
**Status:** 🚧 Coming in Phase 5

### `supabase` (Database)
**Status:** 🚧 Coming in Phase 2

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Type check
npm run type-check

# Lint
npm run lint
```

## 🎨 Code Quality

This project enforces strict code quality standards:

- ✅ TypeScript strict mode (no `any` types)
- ✅ ESLint + Prettier (auto-format on commit)
- ✅ Conventional commits
- ✅ Pre-commit hooks (Husky + lint-staged)
- ✅ 80%+ test coverage requirement
- ✅ Maximum function size: 50 lines
- ✅ Feature-based architecture

See [.github/copilot-instructions.md](./.github/copilot-instructions.md) for detailed standards.

## 🚦 Development Status

### Phase 1: Foundation ✅ COMPLETE
- [x] Monorepo setup (Turborepo)
- [x] TypeScript configuration
- [x] ESLint + Prettier
- [x] Shared package with types & utils
- [x] Unit tests (80%+ coverage)
- [x] Git hooks

### Phase 2: Database & Backend 🚧 IN PROGRESS
- [ ] Supabase project setup
- [ ] Database schema & migrations
- [ ] Row Level Security policies
- [ ] Edge Functions
- [ ] Authentication flows

### Phase 3: Shared Business Logic 📋 PLANNED
- [ ] Receipt parsing logic
- [ ] Category classification
- [ ] Analytics engine
- [ ] Budget tracking

### Phase 4: Mobile App 📋 PLANNED
- [ ] React Native setup
- [ ] Navigation structure
- [ ] Authentication screens
- [ ] Core features (receipts, budgets, analytics)

### Phase 5: Web App 📋 PLANNED
- [ ] Next.js setup
- [ ] Responsive design
- [ ] Dashboard
- [ ] Admin features

### Phase 6: Core Features 📋 PLANNED
- [ ] Store OAuth integrations
- [ ] OCR receipt scanning
- [ ] AI categorization
- [ ] Premium subscriptions

### Phase 7: Testing & Quality 📋 PLANNED
- [ ] E2E tests (Playwright/Detox)
- [ ] Performance testing
- [ ] Security audit
- [ ] Accessibility compliance

### Phase 8: CI/CD & Deployment 📋 PLANNED
- [ ] GitHub Actions pipelines
- [ ] Automated testing
- [ ] Deployment workflows
- [ ] Monitoring & alerts

## 🤝 Contributing

This is currently a private project in active development. Contribution guidelines will be added once we reach beta.

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(receipts): add OCR scanning for manual receipts
fix(auth): resolve OAuth callback redirect issue
docs(api): update Supabase schema documentation
test(budgets): add unit tests for budget calculations
```

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

**Last Updated:** October 8, 2025  
**Version:** 0.1.0 (Phase 1 Complete)  
**Status:** Active Development 🚀

Made with ❤️ by the Receiptor Team