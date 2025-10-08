# @receiptor/shared

Shared TypeScript types, utilities, and business logic for Receiptor project.

## Overview

This package contains:
- **Types**: TypeScript interfaces and enums for all entities
- **Validation**: Zod schemas for input validation
- **Utilities**: Pure functions for calculations and formatting
- **Business Logic**: Shared logic used across mobile and web apps

## Installation

```bash
npm install
```

## Development

```bash
# Watch mode for development
npm run dev

# Build package
npm run build

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## Usage

```typescript
import { 
  formatCurrency, 
  calculateBudgetProgress,
  type Receipt,
  CreateBudgetSchema 
} from '@receiptor/shared';

// Format currency
const formatted = formatCurrency(1234.56, 'SEK', 'sv-SE');
// => "1 234,56 kr"

// Calculate budget progress
const progress = calculateBudgetProgress(receipts, 5000);
// => { spent: 3200, budget: 5000, percentage: 64, remaining: 1800, is_exceeded: false }

// Validate input
const result = CreateBudgetSchema.parse({
  name: 'Monthly Groceries',
  amount: 5000,
  period: 'monthly'
});
```

## Structure

```
src/
├── types/
│   ├── enums.ts      # Enumerations (UserRole, Currency, etc.)
│   └── entities.ts   # Interface definitions
├── validation/
│   └── schemas.ts    # Zod validation schemas
├── utils/
│   ├── formatters.ts # Formatting utilities
│   └── calculations.ts # Business calculations
└── index.ts          # Public API
```

## Testing

All utilities and calculations have unit tests with >80% coverage requirement.

```bash
npm test -- --coverage
```

## Type Safety

This package enforces strict TypeScript mode. No `any` types allowed.

## License

MIT
