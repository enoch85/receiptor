# 🧾 Receiptor

> ⚠️ **WORK IN PROGRESS** - Active development. Authentication is working, core features are being built.

**Smart grocery budget tracking for households**

A modern household grocery budget tracker with automatic receipt collection, AI-powered insights, and secure multi-user collaboration.

---

## 🎯 What It Does

**Core Features:**

- 📱 **Cross-platform** - iOS, Android, and Web apps
- 🏠 **Household Collaboration** - Unlimited family members share receipts and budgets
- 🤖 **AI-Powered** - Automatic categorization and spending insights
- 🔐 **Secure** - OAuth 2.0, BankID support (Nordic), bank-grade security
- 🧾 **Receipt Collection** - Automatic from stores + manual OCR scanning
- 📊 **Analytics** - Spending trends, category breakdown, budget health
- 🌍 **International** - Multi-country, multi-currency, multi-language
- 💰 **Freemium** - Free tier + Premium features ($4.99/mo)

---

## 🚧 Development Status

**What's Working:** ✅

- Authentication (email/password, OAuth ready, BankID UI)
- Database with complete schema
- Business logic (parsers, categorization, analytics)
- Web app foundation
- Docker development environment

**In Progress:** 🔄

- Receipt upload and management
- Budget tracking screens
- Analytics dashboard
- Store integrations
- Mobile app

**Planned:** 📋

- BankID backend integration
- Premium subscriptions
- Household invitations
- OAuth providers (Google, Apple)

---

## 🚀 Quick Start

```bash
# Start development environment
docker-compose -f docker/docker-compose.simple.yml up -d

# Access the app
open http://localhost:3000
```

**Try it now:**

- Sign up at http://localhost:3000/auth/signup
- View dashboard at http://localhost:3000/dashboard

---

## 📚 Documentation

- **[Current Status](./docs/CURRENT_STATUS_REALITY_CHECK.md)** - Detailed progress and what's working
- **[Market Analysis](./docs/1_MARKET_ANALYSIS.md)** - Competitive landscape and opportunity
- **[Product Spec](./docs/2_PRODUCT_SPECIFICATION.md)** - Features and user experience
- **[Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)** - Technical roadmap and timeline
- **[Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)** - System design and infrastructure
- **[Docker Setup](./docker/README.md)** - Development environment guide

---

## 🛠 Technology Stack

- **Frontend:** React Native (mobile), Next.js 14 (web)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI:** OpenAI GPT-4 for categorization
- **OCR:** Veryfi for receipt scanning
- **Payments:** Stripe for subscriptions
- **Infrastructure:** Docker, Vercel, EAS

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

**Made with ❤️ for households**
