# Receiptor Mobile App

React Native mobile application for iOS and Android.

## Status

**Phase 4 Foundation: ✅ COMPLETE**

- ✅ Expo + React Native setup
- ✅ TypeScript strict mode
- ✅ Navigation structure (React Navigation 6)
- ✅ Authentication hook (Supabase)
- ✅ Theme configuration
- ✅ Type-safe navigation
- ✅ Core services (Supabase client)
- ✅ Loading screen
- ✅ Login screen (with validation)

## Tech Stack

- **Framework:** React Native 0.81 + Expo ~54.0
- **Language:** TypeScript (strict mode)
- **Navigation:** React Navigation 6
- **UI Library:** React Native Paper 5.14
- **State Management:** Zustand 5.0
- **Data Fetching:** TanStack Query (React Query) 5.90
- **Forms:** React Hook Form 7.64
- **Validation:** Zod 4.1
- **Backend:** Supabase 2.74
- **Charts:** Victory Native 41.20

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   └── common/          # Reusable UI components
│   ├── hooks/
│   │   └── useAuth.ts       # ✅ Authentication hook
│   ├── navigation/
│   │   ├── AppNavigator.tsx # ✅ Root navigator
│   │   ├── AuthNavigator.tsx # ✅ Auth flow
│   │   └── MainNavigator.tsx # ✅ Main app tabs
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx # ✅ Login with validation
│   │   ├── DashboardScreen.tsx # ✅ Placeholder dashboard
│   │   └── LoadingScreen.tsx   # ✅ Loading state
│   ├── services/
│   │   └── supabase.ts       # ✅ Supabase client
│   ├── types/
│   │   └── navigation.ts     # ✅ Type-safe navigation
│   └── utils/
│       ├── constants.ts      # ✅ App constants
│       └── theme.ts          # ✅ Theme config
├── App.tsx                   # ✅ App entry point
├── package.json
├── tsconfig.json
└── .env.example              # ✅ Environment template
```

## Setup

### Prerequisites

- Node.js 18+
- npm 9+
- iOS Simulator (macOS) or Android Studio (for emulators)
- Expo Go app (for physical device testing)

### Installation

```bash
# From project root
npm install

# Navigate to mobile directory
cd mobile

# Create .env file from template
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get these from: https://app.supabase.com/project/_/settings/api
```

### Environment Variables

Create a `.env` file with:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Development

```bash
# Start Expo dev server
npm start

# Run on iOS simulator (macOS only)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (for testing)
npm run web

# Type check
npm run type-check

# Lint
npm run lint
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Code Quality

This project enforces strict code quality standards:

- ✅ TypeScript strict mode (no `any` types)
- ✅ ESLint + Prettier
- ✅ Conventional commits
- ✅ Feature-based architecture
- ✅ Maximum function size: 50 lines

## Key Features Implemented

### Authentication

- ✅ Supabase Auth integration
- ✅ Email/password login
- ✅ Auto session persistence (AsyncStorage)
- ✅ Auth state management hook
- ✅ Form validation (Zod)
- ✅ Error handling

### Navigation

- ✅ Type-safe navigation with TypeScript
- ✅ Auth flow (Login, SignUp, etc.)
- ✅ Main app flow (Dashboard, Receipts, etc.)
- ✅ Conditional routing based on auth state
- ✅ Loading screen during auth check

### UI/UX

- ✅ Material Design (React Native Paper)
- ✅ Custom theme with brand colors
- ✅ Consistent spacing and typography
- ✅ Responsive layouts
- ✅ Form validation with error messages

## Next Steps (Phase 4 Continuation)

### Authentication Flow (In Progress)

- [ ] SignUp screen
- [ ] Forgot Password screen
- [ ] Onboarding flow
- [ ] Email verification
- [ ] Social auth (Google, Apple)

### Core UI Components

- [ ] Button (custom styled)
- [ ] Card
- [ ] Input with validation
- [ ] LoadingSpinner
- [ ] EmptyState
- [ ] ErrorBoundary

### Dashboard

- [ ] Budget progress card
- [ ] Recent receipts list
- [ ] Quick stats
- [ ] Real-time updates
- [ ] Pull-to-refresh

### Receipts

- [ ] Receipt list screen
- [ ] Receipt detail screen
- [ ] Manual receipt capture (camera)
- [ ] OCR integration (Veryfi)
- [ ] Edit receipt items
- [ ] Delete receipts

### Budgets

- [ ] Budget list screen
- [ ] Create budget screen
- [ ] Budget detail with analytics
- [ ] Budget alerts

### Household

- [ ] Household screen
- [ ] Member management
- [ ] Invite members
- [ ] Household settings

## Architecture Decisions

### Why Expo?

- Faster development with managed workflow
- Easy OTA updates
- Built-in camera, image picker, file system APIs
- Simple build process with EAS
- Can eject if needed

### Why React Navigation?

- Industry standard for React Native
- Type-safe navigation
- Deep linking support
- Great documentation

### Why Supabase?

- PostgreSQL with Row Level Security
- Real-time subscriptions
- Built-in auth
- Storage for receipt images
- Edge Functions for serverless logic

### Why Zustand over Redux?

- Simpler API, less boilerplate
- Better TypeScript support
- Smaller bundle size
- Easier to learn and maintain

## Contributing

See the main project [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](../LICENSE)

---

**Last Updated:** October 8, 2025  
**Version:** 0.1.0  
**Status:** Phase 4 Foundation Complete ✅
