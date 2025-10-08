# Receiptor - Product Specification

**App Name:** Receiptor  
**Tagline:** "The smart receipt tracker for households"  
**Purpose:** Define what the app does for end users  
**Last Updated:** October 2025

---

## Product Vision

**Mission:** Help households track, understand, and optimize their grocery spending together.

**Vision:** Become the default grocery budget app for families worldwide.

**Value Proposition:**
> "See exactly where your grocery money goes, automatically. Track spending with your whole household, get AI-powered insights, and make smarter shopping decisions—without changing a single habit."

---

## User Personas

### Primary: Multi-Person Households

**Persona 1: Sarah - The Household Manager** 👩‍👧‍👦
- **Age:** 32
- **Family:** Married, 2 kids (ages 4 and 7)
- **Role:** Primary grocery shopper, manages household budget
- **Pain:** "I never know exactly how much we spend on groceries. My partner shops too, the kids grab snacks... I lose track."
- **Goal:** Unified view of all household grocery spending
- **Tech:** iPhone, shops at Coop and Lidl
- **Motivations:**
  - Stay within budget
  - Reduce food waste
  - Teach kids about money

**Persona 2: Marcus - The Partner** 👨‍💼
- **Age:** 35
- **Family:** Same household as Sarah
- **Role:** Secondary shopper, cares about finances but delegates details
- **Pain:** "Sarah asks me to track receipts but I forget. It's a hassle."
- **Goal:** Contribute to household budget without extra work
- **Tech:** Android, shops at ICA and Hemköp
- **Motivations:**
  - Support family finances
  - Minimal effort
  - See the bigger picture

**Persona 3: Emma - The Student Roommate** 👩‍🎓
- **Age:** 22
- **Family:** 3 roommates in shared apartment
- **Role:** Equal contributor to shared groceries
- **Pain:** "We try to split costs fairly but it's messy. Who bought what?"
- **Goal:** Fair, transparent cost sharing
- **Tech:** iPhone, shops at Willys and Lidl
- **Motivations:**
  - Fair split
  - Avoid conflicts
  - Easy reconciliation

### Secondary: Privacy-Conscious Users

**Persona 4: Anders - The Security-Aware User** 🔐
- **Age:** 41
- **Occupation:** IT professional
- **Pain:** "I don't trust apps that ask for my store passwords. That's a security nightmare."
- **Goal:** Track spending without compromising security
- **Tech:** Android, privacy-focused, uses password manager
- **Motivations:**
  - Data security
  - No credential sharing
  - Transparency

---

## User Journey Maps

### Journey 1: New User Onboarding (Sarah)

**Goal:** Connect first store and see first receipt

**Steps:**

1. **Discovery** (Day 0)
   - Searches App Store for "grocery budget app"
   - Sees our app, reads "Track spending with your whole household"
   - ✅ Downloads (free, no commitment)

2. **First Launch** (Day 0, Minute 0)
   - Splash screen → "Welcome! Let's set up your household."
   - Creates account (email or Apple/Google sign-in)
   - Names household: "Johnson Family"
   - Sets monthly budget: 8000 SEK

3. **Store Connection** (Day 0, Minute 2)
   - Prompted: "Connect your first store"
   - Selects "Coop Sweden"
   - **Clicks "Connect Securely"** → OAuth flow
   - Redirected to Coop login (official site)
   - Logs in, authorizes access
   - Returns to app: "✅ Coop connected!"

4. **First Sync** (Day 0, Minute 5)
   - App fetches last 30 days of receipts
   - Loading spinner: "Finding your receipts..."
   - Success! Shows 12 receipts, total 3,245 SEK
   - **Moment of delight:** "Wow, I can see everything!"

5. **Invite Household** (Day 0, Minute 7)
   - Prompted: "Invite your partner to see shared spending"
   - Enters Marcus's email
   - He gets invite link
   - **Joins in <2 minutes** → sees same data

6. **First Insight** (Day 1)
   - Push notification: "💡 Insight: You spend 23% on candy & snacks"
   - Opens app, explores categories
   - **Realizes:** "That's way more than I thought!"

7. **Habit Formation** (Week 1)
   - Shops at Coop Tuesday
   - Receipt appears automatically (no action needed)
   - Marcus shops at ICA Thursday (his connected store)
   - His receipt appears in shared view
   - **Sarah sees it in real-time** → "This is perfect!"

**Success Metric:** 70%+ complete onboarding (connect 1 store + invite 1 person)

### Journey 2: Monthly Budget Review (Marcus)

**Goal:** Understand spending, identify savings

**Trigger:** End of month (Day 30)

**Steps:**

1. **Notification:** "📊 Your April report is ready - 7,856 SEK spent"
2. **Opens App:** Clean dashboard shows:
   - Monthly total vs budget (98% used)
   - Top categories breakdown
   - Trend vs last month (+12%)
3. **Explores Categories:**
   - Clicks "Meat & Fish" (largest)
   - Sees every purchase, by date, by store
   - AI insight: "You bought chicken 6 times this month. Buying in bulk could save 15%."
4. **Shares with Sarah:**
   - Screenshot to chat
   - Discussion: "Let's try Costco for meat?"
5. **Sets Goal:**
   - Adjusts next month's budget to 7,500 SEK
   - Enables "Budget alert at 80%"

**Success Metric:** 40%+ users view monthly summary

### Journey 3: Manual Receipt Upload (Emma)

**Goal:** Add receipt from store without integration

**Trigger:** Shops at small local market

**Steps:**

1. **After Checkout:** Opens app → "+" button → "Add Receipt"
2. **Captures Photo:** Phone camera opens, takes photo of paper receipt
3. **AI Processing:**
   - OCR extracts: Store, date, items, prices, total
   - Shows extracted data for confirmation
   - Emma corrects 1 item (OCR misread)
4. **Categorization:**
   - App auto-categorizes items
   - "Milk" → Dairy
   - "Bread" → Bakery
   - Emma confirms
5. **Saved:**
   - Receipt added to household
   - Roommates see it instantly
   - Budget updated: 245 SEK added

**Success Metric:** 90%+ OCR accuracy, <30 seconds to process

---

## Core Features

### 1. Household Management

**Purpose:** Enable multiple people to track shared grocery spending

#### 1.1 Create Household
- **Input:** Household name (e.g., "Smith Family," "Apt 4B")
- **Default:** Uses user's last name + "Household"
- **Unique:** Each household has unique invite code

#### 1.2 Invite Members
- **Methods:**
  - Email invitation (link)
  - SMS invitation (link)
  - QR code (in-person)
  - Share link (any app)
- **Flow:**
  1. User clicks "Invite Member"
  2. Enters email/phone or shows QR
  3. Invitee receives link
  4. Clicks link → prompted to create account or sign in
  5. Auto-joins household upon account creation
- **Limits:**
  - Free tier: Up to 3 members
  - Premium: Unlimited members

#### 1.3 Member Roles
- **Admin:** Can invite/remove members, edit budget, manage settings
- **Member:** Can see all data, add receipts, connect own stores
- **View-Only:** Can see data only (for kids, observers)

#### 1.4 Member Management
- **View Members:** List all household members with roles
- **Edit Roles:** Admin can change member roles
- **Remove Member:** Admin can remove (their data stays)
- **Leave Household:** Any member can leave (keeps own account)

#### 1.5 Household Settings
- **Name:** Edit household name
- **Budget:** Set monthly grocery budget (shared)
- **Currency:** Auto-detected, but can override
- **Notifications:** Who gets alerts (budget, insights, etc.)

**Success Metric:** 60%+ of users create multi-member household

---

### 2. Store Integrations

**Purpose:** Automatically collect receipts from grocery stores

#### 2.1 Connect Store (OAuth Method - Preferred)
- **User Flow:**
  1. Browse list of supported stores (grouped by country)
  2. Select store (e.g., "Coop Sweden")
  3. Click "Connect Securely"
  4. **Redirect to store's official login page**
  5. User logs in with store credentials (on store's site)
  6. Store asks: "Allow Receiptor to access your receipts?"
  7. User clicks "Allow"
  8. **Redirected back to app** with OAuth token
  9. App fetches historical receipts (last 30-90 days)
  10. Success message + receipt count

- **Security:**
  - ✅ App NEVER sees or stores passwords
  - ✅ Uses official OAuth 2.0 protocol
  - ✅ User can revoke access anytime (in store settings)
  - ✅ Token encrypted at rest

- **Supported Stores (Launch - Scandinavia):**
  - 🇸🇪 Sweden: ICA, Coop, Willys, Hemköp, Citygross, LIDL (6)
  - 🇩🇰 Denmark: Coop, Føtex, Netto, LIDL, Rema 1000 (5)
  - 🇳🇴 Norway: Coop, Rema 1000, Kiwi, LIDL, Extra (5)
  - **Total:** 16+ stores at launch

#### 2.2 Connect Store (Fallback Method - Web Scraping)
- **When:** Store doesn't support OAuth
- **User Flow:**
  1. User enters store credentials in app
  2. App stores encrypted credentials
  3. Background job logs into store site (headless browser)
  4. Scrapes receipt data
  5. Logs out, deletes session
- **Security:**
  - ⚠️ Credentials encrypted with user-specific key
  - ⚠️ Warn user about security tradeoff
  - ⚠️ Option to use 2FA backup codes
  - ⚠️ Regular re-authentication required

#### 2.3 Receipt Syncing
- **Frequency:**
  - Initial: Immediate (after connection)
  - Ongoing: Every 4 hours (background job)
  - Manual: Pull-to-refresh in app
- **Scope:**
  - Historical: Last 90 days on first sync
  - Ongoing: New receipts only
- **Notifications:**
  - "New receipt from Coop: 245 SEK" (optional, default ON)
  - Silent sync if user prefers

#### 2.4 Manage Connections
- **View Connected Stores:** List per user
- **Disconnect Store:** Removes connection, keeps existing receipts
- **Reconnect:** If connection breaks (password changed, etc.)
- **Sync Status:** Last synced timestamp, error messages

**Success Metric:** Average 2.5+ stores per household

---

### 3. Receipt Management

**Purpose:** Store, organize, and search all grocery receipts

#### 3.1 Automatic Receipts (from integrations)
- **Data Captured:**
  - Store name + location
  - Receipt date & time
  - Total amount
  - Line items (product name, quantity, price)
  - Payment method (if available)
  - Receipt ID/number
  - Raw receipt image (if available)

- **Processing:**
  1. Receipt fetched via API/scraping
  2. Parsed into structured data
  3. AI categorizes each item (see § 5.1)
  4. Saved to household database
  5. Real-time sync to all members

#### 3.2 Manual Receipt Upload
- **Trigger:** "+" button → "Add Receipt"
- **Methods:**
  - **Photo:** Camera → capture paper receipt
  - **Upload:** Choose from photo library
  - **Manual Entry:** Type in details (rare)

- **OCR Processing:**
  1. User takes photo
  2. AI (Veryfi or Google Vision) extracts:
     - Store name (90%+ accuracy)
     - Date (95%+ accuracy)
     - Items (85%+ accuracy)
     - Prices (90%+ accuracy)
     - Total (95%+ accuracy)
  3. Shows extracted data for review
  4. User corrects any errors
  5. Saves to household

- **Smart Defaults:**
  - If store recognized → auto-selects from list
  - If store unknown → prompts for name
  - AI suggests categories for items

#### 3.3 Receipt List View
- **Default Sort:** Date (newest first)
- **Filters:**
  - Date range (custom, this month, last month, etc.)
  - Store
  - Member (who added it)
  - Amount range
  - Category
- **Display (per receipt):**
  - Store logo + name
  - Date
  - Total amount
  - Member avatar (who shopped)
  - Category icons (top 3)

#### 3.4 Receipt Detail View
- **Header:**
  - Store name + location
  - Full date & time
  - Receipt number
  - Total amount (large, bold)
- **Items:**
  - Scrollable list
  - Each item: Name, quantity, unit price, total
  - Category tag per item
- **Footer:**
  - Payment method
  - Member who added
  - "View Original" (if image available)
- **Actions:**
  - Edit (correct OCR errors, add notes)
  - Delete (admin only, asks confirmation)
  - Share (export as PDF/image)

#### 3.5 Search Receipts
- **Search Bar:** Searches items, stores, dates
- **Examples:**
  - "milk" → all receipts with milk
  - "Coop" → all Coop receipts
  - "December" → all December receipts
  - "Marcus" → receipts added by Marcus
- **Results:** Highlights matches in receipt details

**Success Metric:** 95%+ receipts captured automatically

---

### 4. Budget Tracking

**Purpose:** Help households stay within grocery budget

#### 4.1 Set Budget
- **Input:** Monthly amount (e.g., 8000 SEK)
- **Granularity:**
  - Total monthly budget (default)
  - OR per-category budgets (premium)
  - OR weekly budgets (premium)
- **Who Sets:** Admins (or shared setting in household)
- **Persistence:** Budget carries over month-to-month until changed

#### 4.2 Budget Dashboard
- **Hero Metric:** "7,245 SEK of 8,000 SEK spent" (90.5%)
- **Visual:**
  - Progress bar (green → yellow at 80% → red at 100%)
  - Days remaining in month
  - Average daily spending vs budget
- **Quick Stats:**
  - This month vs last month (+12%)
  - Projected end-of-month total
  - Top spending category

#### 4.3 Budget Alerts
- **Trigger Points:**
  - 50% spent → "You're halfway through your budget"
  - 80% spent → "⚠️ Budget Alert: 80% used, 10 days left"
  - 100% spent → "🚨 Budget Exceeded: 8,045 SEK / 8,000 SEK"
  - Custom thresholds (premium)
- **Delivery:**
  - Push notification (default)
  - Email (optional)
  - In-app banner
- **Settings:**
  - Who receives (all admins, all members, or specific people)
  - Enable/disable per threshold

#### 4.4 Budget Insights
- **Weekly Summary:**
  - "This week: 1,845 SEK (on pace for 7,800 SEK this month)"
  - Comparison to typical week
- **Monthly Report:**
  - Total spent vs budget
  - Category breakdown
  - Top 5 purchases
  - Savings opportunities (AI-generated)
  - Trend vs previous months (chart)

**Success Metric:** 70%+ set a budget, 50%+ stay within budget

---

### 5. Category Analytics

**Purpose:** Understand spending patterns by product type

#### 5.1 Auto-Categorization
- **Method:** AI model (GPT-4 or custom ML)
- **Input:** Product name from receipt
- **Output:** Category assignment
- **Categories:**
  1. Fruits & Vegetables 🥕
  2. Meat & Fish 🥩
  3. Dairy & Eggs 🥛
  4. Bread & Bakery 🍞
  5. Pantry & Dry Goods 🥫
  6. Frozen Foods ❄️
  7. Beverages 🥤
  8. Snacks & Candy 🍫
  9. Alcohol 🍷
  10. Household & Cleaning 🧼
  11. Personal Care 🧴
  12. Baby & Kids 👶
  13. Pet Supplies 🐾
  14. Other 📦

- **Accuracy:** Target 90%+
- **User Correction:**
  - If wrong, user can reassign
  - App learns from corrections (feedback loop)
  - "Is this correct?" prompt for low-confidence items

#### 5.2 Category Breakdown
- **View:** Pie chart or bar chart
- **Data:**
  - % of budget per category
  - Amount spent per category
  - Number of items per category
- **Interactivity:**
  - Tap category → see all items in that category
  - Date range filter
  - Compare to previous period

#### 5.3 Category Trends
- **Chart:** Line graph over time
- **Insights:**
  - "You spent 15% more on meat this month"
  - "Snack spending is trending up over 3 months"
  - "You haven't bought vegetables in 2 weeks" (nudge)

#### 5.4 Savings Opportunities
- **AI Analysis:**
  - Detects high-frequency purchases
  - Suggests bulk buying
  - Identifies expensive brands with cheaper alternatives
  - Flags food waste indicators (buying same item repeatedly)
- **Example Insights:**
  - "You buy milk 8x/month. Buying 2 liters instead of 1 could save 45 SEK."
  - "You spent 340 SEK on brand-name cereal. Store brand could save 120 SEK."

**Success Metric:** 80%+ auto-categorization accuracy

---

### 6. AI-Powered Insights (Premium)

**Purpose:** Provide actionable recommendations to save money

#### 6.1 Spending Patterns
- **Weekly Digest (Email/Push):**
  - "You spent 23% on snacks this week - that's 340 SEK!"
  - "Your grocery spending is up 12% vs last month"
  - "You shop most often on Wednesdays (5 trips)"

#### 6.2 Price Tracking (Future)
- **Feature:** Track price of specific products over time
- **Alert:** "🔔 Milk is 15% cheaper at ICA this week"
- **Comparison:** Show price differences across stores

#### 6.3 Carbon Footprint (Premium)
- **Calculation:** Estimate CO2 impact per product
- **Dashboard:**
  - Total monthly carbon footprint
  - Breakdown by category
  - Comparison to average household
- **Suggestions:**
  - "Buying local vegetables would reduce footprint by 20%"
  - "🌱 Eco-friendly choice: You bought 4 plant-based meals"

#### 6.4 Meal Planning Suggestions (Future)
- **Input:** Recent purchases
- **Output:** "You have chicken, rice, and broccoli - try this recipe!"
- **Integration:** Link to recipe sites

**Success Metric:** 15%+ premium conversion driven by insights

---

### 7. Household Collaboration

**Purpose:** Make shared budgeting transparent and fair

#### 7.1 Shared Dashboard
- **What Everyone Sees:**
  - All receipts (regardless of who added)
  - Total household spending
  - Budget status
  - Category breakdown
  - All insights

- **Member-Specific:**
  - Each member's stores (only they see their credentials)
  - Each member's manual uploads (attributed to them)

#### 7.2 Member Contributions
- **View:** "Who spent what"
- **Display:**
  - Sarah: 4,245 SEK (58%)
  - Marcus: 2,100 SEK (29%)
  - Kids: 895 SEK (12%) [if they shop]
- **Use Case:**
  - Roommates: Split costs fairly
  - Parents: See who's overspending
  - Transparency: No blame, just data

#### 7.3 Shopping List (Future)
- **Shared List:**
  - Any member can add items
  - Real-time sync
  - Check off when purchased
- **Smart Suggestions:**
  - "You usually buy milk on Wednesdays - add to list?"

#### 7.4 Comments & Notes
- **Per Receipt:**
  - Members can comment
  - "This was for the party, not our normal budget"
  - Tag receipts: #party #bulk #work-lunch
- **Use Case:**
  - Context for unusual purchases
  - Coordination between members

**Success Metric:** 3+ members per household (average)

---

### 8. Data Export & Privacy

**Purpose:** Give users control over their data

#### 8.1 Export Data
- **Format:** CSV, Excel, or PDF
- **Scope:**
  - All receipts
  - Specific date range
  - Specific category
  - Summary report
- **Use Case:**
  - Tax purposes
  - Personal records
  - External budgeting tools

#### 8.2 Delete Data
- **Granularity:**
  - Delete single receipt
  - Delete all receipts from a store
  - Delete all data (account deletion)
- **Process:**
  - Confirmation required
  - Permanent deletion (GDPR compliant)
  - Export option before deletion

#### 8.3 Privacy Controls
- **Visibility:**
  - Choose who sees what (per member)
  - Hide specific receipts (e.g., surprise gifts)
- **Data Sharing:**
  - Opt-in for anonymized data insights (revenue stream)
  - Opt-out anytime
  - Transparency report: "What data we collect and why"

#### 8.4 Security Settings
- **Biometric Lock:**
  - Require Face ID / Touch ID to open app
  - Auto-lock after inactivity
- **Store Connection Review:**
  - See all connected stores
  - Last sync time
  - Disconnect anytime

**Success Metric:** <1% support requests about privacy

---

## Feature Prioritization (MVP vs Future)

### Phase 1: MVP (Month 1-4)
**Goal:** Core functionality for families

✅ **Must Have:**
- Account creation (email, Google, Apple)
- Create household + invite members (up to 3)
- Connect stores via OAuth (6 stores: ICA, Coop, Willys, LIDL, Hemköp, Citygross)
- Automatic receipt syncing
- Manual receipt upload (OCR)
- Receipt list + detail view
- Category auto-tagging (14 categories)
- Monthly budget setting
- Budget progress dashboard
- Category breakdown (pie chart)
- Basic insights ("You spent X on Y")
- Free tier

**Success Criteria:**
- 5,000 downloads
- 1,000 MAU
- 70%+ complete onboarding
- 4.5+ star rating

---

### Phase 2: Growth (Month 5-8)
**Goal:** Retention and premium conversion

✅ **Add:**
- Premium tier ($4.99/mo)
  - Unlimited household members
  - All stores (expand to 20+)
  - Unlimited history
  - Advanced insights
- Budget alerts (50%, 80%, 100%)
- Weekly email summary
- Month-over-month trend charts
- Member contribution view
- Search receipts
- Export to CSV
- Denmark & Norway launch (5 stores each)

**Success Criteria:**
- 25,000 downloads
- 8,000 MAU
- 10% premium conversion
- 4.6+ star rating

---

### Phase 3: Scale (Month 9-12)
**Goal:** Market leadership in Scandinavia

✅ **Add:**
- Carbon footprint tracking
- Price tracking (per product)
- Store comparison ("Milk is cheaper at X")
- Shopping list (shared)
- Receipt comments & tags
- Category budget (granular)
- Weekly budget mode
- Biometric lock
- Western Europe launch (Germany, UK, France - 15 stores)

**Success Criteria:**
- 100,000 downloads
- 30,000 MAU
- 10,000 premium subscribers
- $650K ARR

---

### Phase 4: Future (Year 2+)

🔮 **Explore:**
- Meal planning integration
- Recipe suggestions from purchases
- Loyalty program integration (points tracking)
- Bill splitting (Splitwise integration)
- Multi-currency households
- B2B white label for grocery chains
- Developer API
- Smart home integration (Alexa, Google Home)
- Predictive budgeting (AI forecasts)
- Gamification (savings challenges, badges)

---

## User Interface & Experience

### Design Principles

1. **Simple by Default, Powerful When Needed**
   - Dashboard shows essentials only
   - Advanced features tucked in settings
   - Progressive disclosure

2. **Household-First Design**
   - Every screen shows "whose" data (avatars)
   - Shared = default, personal = opt-in
   - Collaboration > individual

3. **Trust & Transparency**
   - Explain why we need permissions
   - Show how data is used
   - Never surprise the user

4. **Delightful Moments**
   - Celebrate savings ("You saved 240 SEK this month! 🎉")
   - Positive framing ("You're on track!" vs "You're overspending")
   - Friendly tone, never judgmental

5. **Accessibility**
   - WCAG AA compliant
   - VoiceOver/TalkBack support
   - High contrast mode
   - Large text support

---

### Key Screens

#### 1. Dashboard (Home)
**Layout:**
```
[Header]
Good morning, Sarah!
Johnson Household 👨‍👩‍👧‍👦

[Hero Card: Budget This Month]
┌─────────────────────────────┐
│ 7,245 SEK / 8,000 SEK       │
│ [===== ==== ====|   ] 90%   │
│                             │
│ 14 days left                │
│ On pace for 7,800 SEK ✅    │
└─────────────────────────────┘

[Quick Stats]
This Week: 1,245 SEK
vs Last Month: +12% ↑

[Recent Receipts]
┌─────────────────────────────┐
│ [🛒] Coop · Today, 4:32 PM  │
│ Sarah · 245 SEK             │
│ 🥕🥛🍞                       │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [🛒] ICA · Yesterday        │
│ Marcus · 512 SEK            │
│ 🥩🥤🍫                       │
└─────────────────────────────┘

[+ Add Receipt]
```

**Actions:**
- Tap budget card → Budget details
- Tap receipt → Receipt detail
- Pull down → Refresh (manual sync)
- + button → Add manual receipt

---

#### 2. Receipts List
**Layout:**
```
[Header]
Receipts
[Filter 🔽] [Search 🔍]

[Filters Applied]
This Month · All Stores

[List]
┌─────────────────────────────┐
│ [Coop logo] Coop Downtown   │
│ Today, 4:32 PM              │
│ 245 SEK · Sarah             │
│ 🥕 Fruits 🥛 Dairy 🍞 Bakery│
└─────────────────────────────┘
┌─────────────────────────────┐
│ [ICA logo] ICA Maxi         │
│ Dec 28, 6:15 PM             │
│ 512 SEK · Marcus            │
│ 🥩 Meat 🥤 Beverages 🍫 Sna │
└─────────────────────────────┘
...
```

**Actions:**
- Tap receipt → Detail view
- Swipe → Quick actions (Edit, Delete)
- Filter → Date, store, member, amount
- Search → Find items

---

#### 3. Receipt Detail
**Layout:**
```
[Header]
← Back
Coop Downtown
Kungsgatan 45, Stockholm
Today, 4:32 PM

[Total]
245 SEK
[Share] [Edit] [Delete]

[Items]
┌─────────────────────────────┐
│ Milk, 3% 1L                 │
│ 1 × 18.50 SEK               │
│ 🥛 Dairy                    │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Bananas Organic             │
│ 0.8 kg × 22.00 SEK/kg       │
│ 17.60 SEK                   │
│ 🍌 Fruits                   │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Sourdough Bread             │
│ 1 × 35.00 SEK               │
│ 🍞 Bakery                   │
└─────────────────────────────┘
...

[Footer]
Payment: Card ending 4532
Added by: Sarah
Receipt #: 8472-3829
[View Original Receipt]
```

---

#### 4. Categories
**Layout:**
```
[Header]
Categories
This Month: 7,245 SEK

[Chart]
[Pie chart showing %]

[List]
┌─────────────────────────────┐
│ 🥩 Meat & Fish              │
│ 1,840 SEK (25%)             │
│ [===== =====|         ]     │
└─────────────────────────────┘
┌─────────────────────────────┐
│ 🥕 Fruits & Vegetables      │
│ 1,320 SEK (18%)             │
│ [===== ===|           ]     │
└─────────────────────────────┘
┌─────────────────────────────┐
│ 🍫 Snacks & Candy           │
│ 1,095 SEK (15%)             │
│ [===== ==|            ]     │
│ ⚠️ +23% vs last month       │
└─────────────────────────────┘
...
```

**Actions:**
- Tap category → See all items in category
- Swipe down → See trend over time
- Insight bubbles → Savings tips

---

#### 5. Household
**Layout:**
```
[Header]
Johnson Household
[⚙️ Settings]

[Members]
┌─────────────────────────────┐
│ [Avatar] Sarah Johnson      │
│ Admin · 4,245 SEK (58%)     │
│ 2 stores connected          │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [Avatar] Marcus Johnson     │
│ Member · 2,100 SEK (29%)    │
│ 1 store connected           │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [Avatar] Emma (8 yrs)       │
│ View-Only · 895 SEK (12%)   │
│ 0 stores connected          │
└─────────────────────────────┘

[+ Invite Member]

[Budget]
Monthly Budget: 8,000 SEK
[Edit Budget]

[Settings]
• Notifications
• Member Roles
• Leave Household
• Delete Household
```

---

#### 6. Store Connections
**Layout:**
```
[Header]
Connected Stores
[+ Connect New Store]

[Your Stores]
┌─────────────────────────────┐
│ [Coop logo] Coop Sweden     │
│ Connected · sarah@email.com │
│ Last synced: 2 min ago      │
│ ✅ 12 receipts this month   │
│ [Disconnect]                │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [LIDL logo] Lidl Plus       │
│ Connected · sarah@email.com │
│ Last synced: 1 hour ago     │
│ ✅ 4 receipts this month    │
│ [Disconnect]                │
└─────────────────────────────┘

[Household Stores]
(Shows Marcus's ICA connection)

[Available Stores]
🇸🇪 Sweden (6)
🇩🇰 Denmark (5)
🇳🇴 Norway (5)
```

**Actions:**
- Tap "Connect New Store" → Store list → OAuth flow
- Tap "Disconnect" → Confirmation → Removes connection
- Manual sync: Pull down to refresh

---

### Responsive Design

**Mobile (Primary):**
- Single column layout
- Bottom navigation (Dashboard, Receipts, Categories, Household, Profile)
- Optimized for one-handed use
- Thumb-friendly tap targets (44×44 pt minimum)

**Tablet:**
- Two-column layout (list + detail)
- Larger charts and visualizations
- Landscape optimization

**Web (Desktop):**
- Three-column layout (nav, list, detail)
- Keyboard shortcuts
- Hover states
- Responsive down to mobile

---

## Onboarding Flow

### First-Time User Experience (FTUE)

**Goal:** Get user to first receipt in <5 minutes

**Steps:**

1. **Welcome Screen**
   - App logo + tagline
   - "Track your household's grocery spending, together"
   - [Get Started]

2. **Sign Up**
   - [Continue with Apple]
   - [Continue with Google]
   - [Sign up with Email]
   - Terms & Privacy links

3. **Create Household** (Step 1 of 4)
   - "What should we call your household?"
   - Input: "Johnson Family" (pre-filled with user's last name)
   - [Next]

4. **Set Budget** (Step 2 of 4)
   - "What's your monthly grocery budget?"
   - Input: Amount + currency (auto-detected by location)
   - Skip option: "I'll set this later"
   - [Next]

5. **Connect Store** (Step 3 of 4)
   - "Connect your first grocery store"
   - Shows 3 most popular stores in user's country
   - [Connect Coop] [Connect ICA] [Connect LIDL]
   - "See all stores" (expands to full list)
   - OAuth flow on selection
   - [Skip] option (but discouraged)

6. **Invite Household** (Step 4 of 4)
   - "Who shops with you?"
   - "Invite your partner, family, or roommates to share spending"
   - Input: Email/phone
   - [Send Invite]
   - [Skip] option: "I'll do this later"

7. **Success!**
   - "All set! 🎉"
   - "We're syncing your receipts now..."
   - Loading animation (3-10 seconds)
   - Shows receipt count as they load

8. **First Dashboard**
   - Tooltip tour (optional):
     - "This is your budget for the month"
     - "Here are your recent receipts"
     - "Tap a receipt to see details"
   - [Got it]

**Metrics:**
- Time to complete: Target <5 min, Median 3 min
- Completion rate: Target 70%+
- Drop-off points: Monitor each step

---

## Notifications

### Push Notifications

**Types:**

1. **New Receipt**
   - "🧾 New receipt from Coop: 245 SEK"
   - Frequency: Real-time (after each sync)
   - Default: ON
   - Tap action: Open receipt detail

2. **Budget Alerts**
   - "⚠️ Budget Alert: 80% used, 14 days left"
   - Frequency: Once per threshold (50%, 80%, 100%)
   - Default: ON
   - Tap action: Open budget dashboard

3. **Weekly Summary**
   - "📊 Week in Review: 1,845 SEK spent"
   - Frequency: Sundays at 6 PM
   - Default: ON
   - Tap action: Open category breakdown

4. **Monthly Report**
   - "📅 December Report Ready: 7,856 SEK"
   - Frequency: 1st of month
   - Default: ON
   - Tap action: Open monthly summary

5. **Insights**
   - "💡 Insight: You spend 23% on candy - that's 340 SEK!"
   - Frequency: 2-3 per week (AI-determined)
   - Default: ON
   - Tap action: Open insight detail

6. **Sync Errors**
   - "⚠️ Couldn't sync Coop - please reconnect"
   - Frequency: When error occurs
   - Default: ON (cannot disable)
   - Tap action: Open store connections

**Settings:**
- Enable/disable per type
- Quiet hours (default 10 PM - 8 AM)
- Member-specific (e.g., only admins get budget alerts)

---

### Email Notifications

**Types:**

1. **Household Invite**
   - Subject: "Sarah invited you to join Johnson Household on Receiptor"
   - CTA: [Join Household]

2. **Weekly Summary**
   - Subject: "Your grocery week: 1,845 SEK"
   - Content: Category breakdown, top purchases, insights

3. **Monthly Report**
   - Subject: "Your December grocery report: 7,856 SEK"
   - Content: Full month summary, charts, savings tips

4. **Security Alerts**
   - Subject: "New device logged into your account"
   - Subject: "Store connection expired - please reconnect"

**Settings:**
- Enable/disable per type
- Frequency (immediate, daily digest, weekly)

---

## Monetization (Premium Features)

### Free Tier
✅ All core features  
✅ Up to 3 household members  
✅ 10 store integrations  
✅ 6 months history  
✅ Category tracking  
✅ Budget dashboard  
✅ Basic insights  

### Premium Tier ($4.99/month or $49.99/year)
✅ **Everything in Free, plus:**  
✅ Unlimited household members  
✅ All store integrations (20+)  
✅ Unlimited history (forever)  
✅ AI spending insights (weekly)  
✅ Carbon footprint tracking  
✅ Price trend tracking (per product)  
✅ Category budgets (granular)  
✅ Weekly budget mode  
✅ Export to CSV/Excel  
✅ Priority support  
✅ Ad-free experience  
✅ Early access to new features  

**Conversion Strategy:**
- Free trial: 14 days premium (on sign-up)
- Upsell prompts:
  - When adding 4th member: "Upgrade for unlimited members"
  - After 6 months: "Upgrade to see your full history"
  - On insights: "See all insights with Premium"
- Annual discount: 17% off ($49.99 vs $59.88)

**Target Conversion:** 10% free → premium

---

## Success Metrics (Recap)

### Acquisition
- Downloads per week: 1,000+ (Month 4)
- App Store ranking: Top 10 in Finance (Scandinavia)
- Cost per acquisition: <$5

### Activation
- % complete onboarding: 70%+
- % connect 1+ store: 60%+
- Time to first receipt: <5 minutes

### Engagement
- Monthly Active Users (MAU): 30,000 (Month 12)
- DAU/MAU ratio: 25%+
- Sessions per week: 3+

### Retention
- Day 7 retention: 40%+
- Day 30 retention: 25%+
- Monthly churn: <5%

### Revenue
- Free → Premium conversion: 10%
- Premium subscribers: 10,000 (Month 12)
- Annual Recurring Revenue (ARR): $650K (Month 12)

### Quality
- App Store rating: 4.7+ stars
- Crash-free rate: 99.5%+
- Support tickets per user: <0.1

---

## Conclusion

This product specification defines a **household-first grocery budget app** that solves real user problems:

✅ **For Sarah (Household Manager):** Unified view of all family spending, without manual tracking  
✅ **For Marcus (Partner):** Zero-effort contribution to household budget  
✅ **For Emma (Roommate):** Fair, transparent cost sharing  
✅ **For Anders (Security-Conscious):** No password sharing, OAuth only  

**Key Differentiators:**
1. True multi-user households (vs competitors' none or 1-to-1)
2. OAuth security (vs credential storage)
3. International from day 1 (vs Nordic-only)
4. AI insights (vs basic categories)

**Next Steps:**
- See `3_TECHNICAL_IMPLEMENTATION.md` for architecture, database schema, and build roadmap
- See `1_MARKET_ANALYSIS.md` for competitive landscape and go-to-market strategy

**Ready to build.** 🚀
