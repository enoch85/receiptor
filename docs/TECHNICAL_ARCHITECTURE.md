# Receiptor - Technical Architecture

**App Name:** Receiptor  
**Purpose:** Technical architecture and system design for building a household-first grocery budget tracking app

---

## Competitive Analysis - Technical Architecture (Reference)

## System Architecture (Inferred)

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LAYER                                │
│  ┌──────────────┐              ┌──────────────┐                │
│  │   Android    │              │     iOS      │                │
│  │     App      │              │     App      │                │
│  └──────────────┘              └──────────────┘                │
│         │                             │                          │
└─────────┼─────────────────────────────┼──────────────────────────┘
          │                             │
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │   Firebase Services (GCP)    │
          │                              │
          │  ┌────────────────────────┐ │
          │  │  Firebase Auth         │ │
          │  │  - Email/Password      │ │
          │  │  - Social Login        │ │
          │  │  - IP Logging          │ │
          │  └────────────────────────┘ │
          │                              │
          │  ┌────────────────────────┐ │
          │  │  Cloud Functions       │ │
          │  │  - Business Logic      │ │
          │  │  - Receipt Sync        │ │
          │  │  - Categorization      │ │
          │  │  - Analytics           │ │
          │  └────────────────────────┘ │
          │                              │
          │  ┌────────────────────────┐ │
          │  │  Firestore/DB          │ │
          │  │  - User Profiles       │ │
          │  │  - Receipt Data        │ │
          │  │  - Categories          │ │
          │  │  - Statistics          │ │
          │  └────────────────────────┘ │
          │                              │
          └──────────────┬───────────────┘
                         │
          ┌──────────────▼───────────────┐
          │   Third-Party Integrations   │
          │                              │
          │  ┌────────────────────────┐ │
          │  │  Storebox API          │ │
          │  └────────────────────────┘ │
          │  ┌────────────────────────┐ │
          │  │  Coop App API          │ │
          │  └────────────────────────┘ │
          │  ┌────────────────────────┐ │
          │  │  Lidl+ API             │ │
          │  └────────────────────────┘ │
          │  ┌────────────────────────┐ │
          │  │  Nemlig.com API        │ │
          │  └────────────────────────┘ │
          └──────────────────────────────┘
```

## Data Flow

### 1. User Onboarding
```
User Opens App
    → Firebase Auth (Create Account)
    → User Profile Creation
        - Email
        - Household Info (zip, size, age, gender)
        - Budget Amount
    → Store in Firestore
    → Connect Third-Party Services
        - User Provides Credentials
        - Credentials Encrypted & Stored
        - Initial Receipt Fetch Triggered
```

### 2. Receipt Sync (Periodic Background Job)
```
Cloud Function Scheduled Job (Cron)
    → For Each User:
        → Fetch Credentials from Secure Storage
        → Call Third-Party APIs
            - Storebox
            - Coop
            - Lidl+
            - Nemlig.com
        → Retrieve New Receipts
        → Parse Receipt Data
            {
              "receiptId": "...",
              "store": "Coop",
              "date": "2025-10-08",
              "total": 234.50,
              "items": [
                {
                  "name": "Organic Milk",
                  "category": "Dairy",
                  "price": 12.50,
                  "quantity": 1
                },
                ...
              ]
            }
        → Categorize Items
        → Store in Firestore
        → Update User Statistics
        → Check Budget Thresholds
            → Send Push Notification if needed
```

### 3. Categorization Engine
```
Receipt Item
    → Extract Product Name
    → Lookup in Product Database
        - If Found: Use Known Category
        - If Not Found:
            → Rule-Based Categorization
                - Keyword matching
                - Store department
            → OR ML Model (possible)
            → Store New Product → Category mapping
    → Assign Category
    → Return Categorized Item
```

### 4. Analytics & Aggregation
```
User Opens App
    → Request Dashboard Data
    → Cloud Function:
        → Query Firestore:
            - User's Receipts (time range)
            - User's Budget
            - User's Settings
        → Aggregate Data:
            - Total Spending by Category
            - Total Spending by Store
            - Total Spending by Time Period
            - Organic % Calculation
            - Bags & Deposits
            - Peer Comparison (anonymous)
        → Return JSON Response
    → App Displays:
        - Budget Progress
        - Category Breakdown
        - Store Analytics
        - Comparisons
```

## Database Schema (Firestore - Inferred)

### Collections

#### 1. users
```javascript
{
  "userId": "abc123",
  "email": "user@example.com",
  "profile": {
    "zipCode": "12345",
    "householdSize": 3,
    "age": 35,
    "gender": "female",
    "budget": 5000,
    "currency": "SEK"
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-10-08T12:00:00Z",
  "settings": {
    "pushNotifications": true,
    "newsletter": false
  }
}
```

#### 2. connectedServices
```javascript
{
  "userId": "abc123",
  "serviceId": "service_xyz",
  "serviceName": "Storebox",
  "connectedAt": "2025-01-02T10:00:00Z",
  "credentials": {
    // Encrypted credentials
    "encryptedData": "..."
  },
  "lastSyncedAt": "2025-10-08T06:00:00Z",
  "status": "active" // active, error, disconnected
}
```

#### 3. receipts
```javascript
{
  "receiptId": "receipt_12345",
  "userId": "abc123",
  "serviceId": "service_xyz",
  "store": {
    "name": "Coop",
    "location": "Stockholm",
    "chain": "Coop"
  },
  "date": "2025-10-07T14:30:00Z",
  "total": 234.50,
  "currency": "SEK",
  "items": [
    {
      "itemId": "item_001",
      "name": "Organic Milk 1L",
      "category": "Dairy",
      "isOrganic": true,
      "price": 12.50,
      "quantity": 1,
      "unit": "pcs"
    },
    // ... more items
  ],
  "metadata": {
    "bags": 1,
    "bagCost": 2.00,
    "deposit": 0,
    "discount": 5.00
  },
  "createdAt": "2025-10-08T06:15:00Z"
}
```

#### 4. categories
```javascript
{
  "categoryId": "cat_dairy",
  "name": "Dairy",
  "parentCategory": null, // or parent ID for subcategories
  "keywords": ["milk", "cheese", "yogurt", "butter", "cream"],
  "icon": "dairy_icon.png",
  "color": "#FFD700"
}
```

#### 5. userStatistics
```javascript
{
  "userId": "abc123",
  "period": "2025-10", // Month
  "totalSpent": 4800,
  "byCategory": {
    "Dairy": 450,
    "Meat": 1200,
    "FruitVeg": 800,
    // ...
  },
  "byStore": {
    "Coop": 3000,
    "Lidl": 1800
  },
  "organicSpent": 720,
  "organicPercentage": 15.0,
  "bagsCount": 12,
  "bagsCost": 24,
  "receiptsCount": 28,
  "updatedAt": "2025-10-08T12:00:00Z"
}
```

#### 6. aggregatedStats (for peer comparison)
```javascript
{
  "period": "2025-10",
  "zipCode": "12345", // for regional comparison
  "householdSize": 3,
  "anonymousData": {
    "averageSpent": 5200,
    "medianSpent": 4950,
    "categoryAverages": {
      "Dairy": 520,
      "Meat": 1400,
      // ...
    },
    "organicPercentage": 18.5,
    "userCount": 847 // anonymized user count
  }
}
```

## API Endpoints (Inferred Cloud Functions)

### Authentication
```
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/social-login (Facebook, Apple)
```

### User Profile
```
GET /user/profile
PUT /user/profile
DELETE /user/profile
```

### Connected Services
```
GET /user/services
POST /user/services/connect
DELETE /user/services/:serviceId
POST /user/services/:serviceId/sync
```

### Receipts
```
GET /receipts?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /receipts/:receiptId
```

### Statistics
```
GET /stats/dashboard?period=YYYY-MM
GET /stats/categories?period=YYYY-MM
GET /stats/stores?period=YYYY-MM
GET /stats/comparison?period=YYYY-MM
```

### Budget
```
GET /budget
PUT /budget
```

## Integration Architecture

### Third-Party Integration Pattern
```javascript
// Example for Storebox Integration
class StoreboxIntegration {
  async authenticate(username, password) {
    // 1. Call Storebox login API
    const response = await fetch('https://api.storebox.com/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    // 2. Get access token or session
    const { accessToken, refreshToken } = await response.json();
    
    // 3. Store encrypted tokens
    return { accessToken, refreshToken };
  }

  async fetchReceipts(accessToken, since) {
    // 1. Call Storebox receipts API
    const response = await fetch(`https://api.storebox.com/receipts?since=${since}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // 2. Parse response
    const receipts = await response.json();
    
    // 3. Transform to standard format
    return receipts.map(r => this.transformReceipt(r));
  }

  transformReceipt(storeboxReceipt) {
    // Convert Storebox format to our internal format
    return {
      receiptId: storeboxReceipt.id,
      store: storeboxReceipt.merchant,
      date: storeboxReceipt.purchaseDate,
      total: storeboxReceipt.totalAmount,
      items: storeboxReceipt.lineItems.map(item => ({
        name: item.description,
        price: item.amount,
        quantity: item.quantity
      }))
    };
  }
}
```

## Security Architecture

### Data Encryption
```
1. In Transit:
   - TLS 1.3 for all API calls
   - Certificate pinning in mobile apps

2. At Rest:
   - Firestore encryption (automatic)
   - Third-party credentials: AES-256 encryption
   - Encryption keys stored in Google Cloud KMS

3. Application Level:
   - Sensitive fields encrypted before storage
   - Decryption only in secure Cloud Functions
   - No credentials in client apps
```

### Access Control
```
1. Firebase Security Rules:
   - Users can only read/write their own data
   - Admin access for support team
   - Rate limiting to prevent abuse

2. Cloud Functions:
   - Service account authentication
   - Least privilege principle
   - Audit logging for all operations

3. Third-Party APIs:
   - Tokens rotated regularly
   - Revocation on disconnect
   - IP whitelisting where possible
```

## Performance Optimizations

### Caching Strategy
```
1. Client-side:
   - Cache dashboard data for 5 minutes
   - Local storage for offline viewing
   - Background sync when online

2. Server-side:
   - Redis/Memorystore for frequently accessed data
   - Pre-calculated statistics
   - Batch processing for aggregations

3. Database:
   - Compound indexes for common queries
   - Denormalization for read-heavy operations
   - Archive old receipts to cold storage
```

### Background Jobs
```
1. Receipt Sync:
   - Run every 6 hours per user
   - Stagger execution to avoid API limits
   - Retry logic for failures

2. Statistics Calculation:
   - Daily aggregation at midnight
   - Weekly/Monthly rollups
   - Peer comparison updates

3. Cleanup:
   - Delete old logs
   - Archive inactive accounts
   - Remove expired sessions
```

## Scalability Considerations

### Horizontal Scaling
```
1. Firebase Auto-scaling:
   - Cloud Functions scale automatically
   - Firestore handles high read/write loads
   - No server management needed

2. API Rate Limiting:
   - Per-user limits
   - Per-IP limits
   - Backoff strategies for third-party APIs

3. Data Partitioning:
   - By user ID (built-in to Firestore)
   - By date range for receipts
   - Regional data centers (GCP regions)
```

### Cost Optimization
```
1. Storage:
   - Move old receipts to cheaper storage (Cloud Storage)
   - Image compression for receipts
   - Data lifecycle policies

2. Compute:
   - Optimize Cloud Functions execution time
   - Batch operations where possible
   - Use scheduled functions vs real-time

3. Bandwidth:
   - CDN for static assets
   - Compress API responses
   - Pagination for large result sets
```

## Monitoring & Observability

### Metrics to Track
```
1. System Health:
   - API response times (p50, p95, p99)
   - Error rates by endpoint
   - Cloud Function execution times
   - Database query performance

2. Business Metrics:
   - Receipt sync success rate
   - Categorization accuracy
   - Active users (DAU, WAU, MAU)
   - Integration success rates

3. User Experience:
   - App crash rate
   - Session duration
   - Feature usage
   - Onboarding completion rate
```

### Logging & Alerts
```
1. Structured Logging:
   - JSON format
   - User ID (for debugging)
   - Request ID (for tracing)
   - Timestamp, level, message

2. Alerting:
   - Error rate > threshold
   - API downtime
   - Failed receipt syncs
   - Database performance degradation
   - Security anomalies
```

## Potential Tech Stack for OUR App

### Option 1: Firebase-based (Like Competitor Apps)
**Pros:** Fast development, auto-scaling, managed services  
**Cons:** Vendor lock-in, costs can grow, less control

```
Mobile: React Native or Flutter
Backend: Firebase
  - Authentication: Firebase Auth
  - Database: Firestore
  - Functions: Cloud Functions for Firebase
  - Storage: Cloud Storage
  - Analytics: Firebase Analytics
Hosting: Firebase Hosting (web version)
```

### Option 2: Supabase-based (Modern Alternative)
**Pros:** Open-source, PostgreSQL, self-hostable, cheaper  
**Cons:** Less mature, fewer integrations, more setup

```
Mobile: React Native or Flutter
Backend: Supabase
  - Authentication: Supabase Auth
  - Database: PostgreSQL (via Supabase)
  - Functions: Edge Functions (Deno)
  - Storage: Supabase Storage
  - Real-time: Supabase Realtime
API: RESTful or GraphQL (via Supabase)
```

### Option 3: Custom Backend (Maximum Control)
**Pros:** Full control, optimize for our needs, no vendor lock-in  
**Cons:** More development time, more maintenance, more complexity

```
Mobile: React Native or Flutter
Backend: Node.js (Express/Fastify) or Python (FastAPI)
Database: PostgreSQL or MongoDB
Cache: Redis
Queue: BullMQ or RabbitMQ
Authentication: JWT + OAuth 2.0
Hosting: AWS, GCP, or Azure
CDN: CloudFlare
```

## Recommended Approach for Our App

**Phase 1 (MVP):** Start with Supabase
- Faster than custom backend
- Cheaper than Firebase at scale
- Still get modern features
- Easy to migrate later if needed

**Phase 2 (Scale):** Optimize
- Add Redis caching
- Implement CDN
- Optimize database queries
- Add background job processing

**Phase 3 (Enterprise):** Consider Custom
- If Supabase limits reached
- If specific needs arise
- If cost becomes prohibitive
- Gradual migration possible

---

## Key Takeaways

1. **Architecture:** Competitor apps likely use Firebase (GCP) with Cloud Functions
2. **Integration:** Credential-based (risky) - we should use OAuth 2.0
3. **Database:** NoSQL (Firestore) - good for this use case
4. **Mobile:** Native apps - we could use cross-platform (React Native/Flutter)
5. **Security:** Encrypted in transit, Firebase handles most security
6. **Scalability:** Firebase auto-scales well for this type of app
7. **Cost:** Firebase can get expensive - Supabase might be better for us

**Our Advantages:**
- Modern tech stack from day one
- Better security (OAuth vs credentials)
- More features (household sharing, multi-user)
- International-ready architecture
- Cost-optimized from start
