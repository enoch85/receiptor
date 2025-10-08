# BankID Integration Guide

**Purpose:** Implement secure Nordic authentication for Receiptor  
**Target Markets:** Sweden, Norway, Denmark  
**Last Updated:** October 8, 2025

---

## Overview

BankID is the de-facto authentication standard in Scandinavia, with:

- **Sweden:** 8.5M users (85% of population) - Swedish BankID
- **Norway:** 4.5M users (83% of population) - BankID Norway / Vipps
- **Denmark:** 5.5M users (95% of population) - MitID (replaced NemID in 2021)

**Why BankID matters:**

- ✅ Government-grade security (used for banking, healthcare, taxes)
- ✅ Users trust it more than email/password
- ✅ No password fatigue
- ✅ Required for Nordic market credibility
- ✅ Meets GDPR requirements by design

---

## Authentication Methods by Country

### Sweden: BankID

**Provider:** Finansiell ID-Teknik BID AB  
**Protocol:** Custom API (REST-based)  
**Implementation:**

1. Mobile BankID (QR code or same-device)
2. Desktop BankID (file-based, legacy)

**User Flow:**

1. User clicks "Login with BankID"
2. App calls BankID API to start authentication
3. User opens BankID app on mobile
4. Scans QR code or auto-launches
5. Confirms identity with PIN/biometric
6. Returns to app with verified identity

**Data Returned:**

- Personal number (personnummer) - 12 digits
- Full name (first + last)
- Age verification
- Digital signature

**Requirements:**

- BankID Relying Party (RP) certificate
- Production: Apply to BankID (4-6 weeks approval)
- Test Environment: Available immediately

**Cost:**

- Setup fee: ~5,000 SEK
- Per-transaction: ~0.50-1 SEK
- Test environment: FREE

---

### Norway: BankID / Vipps

**Provider:** BankID BankAxept (owned by Norwegian banks)  
**Protocol:** OpenID Connect (OIDC)  
**Implementation:**

1. BankID Norway (traditional)
2. **Vipps** (most popular - owned by Norwegian banks)

**User Flow (Vipps):**

1. User clicks "Login with Vipps"
2. Redirect to Vipps login page
3. User enters phone number
4. Confirms in Vipps app (PIN/biometric)
5. Returns with OIDC token

**Data Returned:**

- National ID number (fødselsnummer)
- Full name
- Phone number (verified)
- Email (if shared)

**Requirements:**

- Register as Vipps merchant
- Apply for "Vipps Login" product
- OIDC client credentials

**Cost:**

- Setup: FREE
- Per-transaction: FREE (monetization via payments)
- Test environment: FREE

**Recommendation:** Use **Vipps** instead of traditional BankID Norway

- Easier integration (standard OIDC)
- Better UX
- More users
- Free

---

### Denmark: MitID

**Provider:** Nets (via MitID broker)  
**Protocol:** OpenID Connect (OIDC)  
**Implementation:**

1. MitID app (replaced NemID in 2021)
2. Code Display (fallback)

**User Flow:**

1. User clicks "Login with MitID"
2. Redirect to MitID broker
3. User enters CPR number or username
4. Confirms in MitID app
5. Returns with OIDC token

**Data Returned:**

- CPR number (Danish national ID)
- Full name
- UUID (persistent identifier)

**Requirements:**

- Register with MitID broker
- Apply for Service Provider access
- OIDC credentials

**Cost:**

- Setup: ~2,000 DKK
- Per-transaction: ~1-2 DKK
- Test environment: FREE

---

## Implementation Strategy

### Phase 1: Foundation (Week 1)

**Goal:** Email/password + Google/Apple OAuth working

**Why start here:**

- BankID approval takes 2-6 weeks
- Need working auth while waiting
- Serves non-Nordic users

**Tasks:**

1. Set up Supabase Auth
2. Email/password registration
3. Google OAuth
4. Apple OAuth
5. Session management

**Timeline:** 6-8 hours

---

### Phase 2: BankID Integration (Week 2-3)

**Goal:** Add Nordic BankID support

**Sweden: BankID**

1. Apply for BankID RP certificate
2. Create Supabase Edge Function for BankID flow
3. Implement QR code generation
4. Handle mobile app deep-linking
5. Store verified identity

**Norway: Vipps**

1. Register for Vipps Login
2. Configure OIDC in Supabase
3. Add Vipps button to UI
4. Test flow

**Denmark: MitID**

1. Register with MitID broker
2. Configure OIDC in Supabase
3. Add MitID button to UI
4. Test flow

**Timeline:** 15-20 hours (excluding approval wait time)

---

## Technical Architecture

### Option 1: Supabase Custom Auth (Recommended)

**Approach:** Use Supabase Edge Functions + Database

```typescript
// Supabase Edge Function: bankid-auth
async function handleBankIDAuth(country: 'se' | 'no' | 'dk') {
  switch (country) {
    case 'se':
      return initSwedishBankID();
    case 'no':
      return initVipps();
    case 'dk':
      return initMitID();
  }
}

async function initSwedishBankID() {
  // 1. Start BankID authentication
  const response = await fetch('https://appapi2.bankid.com/rp/v6.0/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BANKID_CERT}`,
    },
    body: JSON.stringify({
      endUserIp: userIP,
      requirement: {
        personalNumber: personalNumber, // Optional
      },
    }),
  });

  const { orderRef, autoStartToken, qrStartToken } = await response.json();

  // 2. Generate QR code
  const qrCode = generateQRCode(qrStartToken);

  // 3. Poll for completion
  const collectInterval = setInterval(async () => {
    const status = await collectBankIDStatus(orderRef);
    if (status.status === 'complete') {
      clearInterval(collectInterval);
      // 4. Create Supabase user
      await createUserFromBankID(status.completionData);
    }
  }, 2000);

  return { qrCode, orderRef };
}

async function createUserFromBankID(data: BankIDUserData) {
  // Create Supabase user with verified identity
  const { user, error } = await supabase.auth.admin.createUser({
    email: `${data.personalNumber}@bankid.receiptor.app`, // Synthetic email
    email_confirm: true,
    user_metadata: {
      full_name: data.name,
      personal_number: data.personalNumber,
      verified_by: 'bankid_se',
      verified_at: new Date().toISOString(),
    },
  });

  return user;
}
```

**Pros:**

- ✅ Full control over flow
- ✅ No third-party dependency
- ✅ Direct integration with Supabase
- ✅ Cheaper long-term

**Cons:**

- ❌ More development work
- ❌ Need to handle certificates
- ❌ Maintain Nordic API changes

---

### Option 2: Third-Party Service (Criipto/Signicat)

**Providers:**

1. **Criipto** (https://www.criipto.com)
   - Supports all Nordic BankID
   - OIDC standard
   - ~$0.10/auth
   - Free test environment

2. **Signicat** (https://www.signicat.com)
   - Nordic + EU eID
   - OIDC standard
   - Enterprise pricing
   - More expensive

**Implementation (Criipto):**

```typescript
// Use Supabase OIDC provider
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'criipto',
  options: {
    scopes: 'openid profile',
    queryParams: {
      acr_values: 'urn:grn:authn:se:bankid:same-device', // Swedish BankID
      // OR
      // acr_values: 'urn:grn:authn:no:vipps', // Vipps
      // acr_values: 'urn:grn:authn:dk:mitid:low', // MitID
    },
  },
});
```

**Pros:**

- ✅ Faster implementation (days not weeks)
- ✅ Handles all certificate management
- ✅ OIDC standard (works with Supabase)
- ✅ Automatic updates for API changes
- ✅ Test environment ready immediately

**Cons:**

- ❌ Ongoing per-transaction cost
- ❌ Dependency on third-party
- ❌ Slightly less control

---

## Recommended Approach

### **Use Criipto (Third-Party) Initially, Migrate Later**

**Reasoning:**

1. **Time to market:** Start testing BankID in days, not weeks
2. **Lower risk:** Proven solution, handles edge cases
3. **Cost-effective at low volume:** <10,000 auths/month = ~$1,000/month
4. **Easy migration:** Switch to custom later when volume justifies it

**Migration trigger:** >20,000 auths/month (~$2,000/month with Criipto)

- Build custom integration
- Save ~$1,500/month at scale

---

## UI/UX Design

### Login Screen (Mobile + Web)

```
┌─────────────────────────────────────┐
│         RECEIPTOR                    │
│                                      │
│  [🇸🇪 BankID (Sweden)]  ← Primary   │
│  [🇳🇴 Vipps (Norway)]               │
│  [🇩🇰 MitID (Denmark)]              │
│                                      │
│  ──────── or ────────                │
│                                      │
│  [📧 Sign in with Email]             │
│  [🍎 Sign in with Apple]             │
│  [🔵 Sign in with Google]            │
│                                      │
│  Don't have an account? Sign up      │
└─────────────────────────────────────┘
```

**Key UX Principles:**

1. **BankID FIRST** for Nordic users
2. Show only relevant BankID based on locale/IP
3. Email/OAuth as fallback
4. Clear trust indicators ("Bank-grade security")

---

### BankID Flow (Swedish Example)

**Same-Device (Mobile):**

1. Tap "BankID (Sweden)"
2. App deep-links to BankID app
3. User confirms with PIN/Face ID
4. Returns to Receiptor, logged in

**Cross-Device (Desktop):**

1. Click "BankID (Sweden)"
2. QR code appears
3. Scan with BankID app on phone
4. Confirm on phone
5. Desktop auto-refreshes, logged in

---

## Security Considerations

### Data Storage

**What to store:**

- ✅ Personal number (encrypted, for identity verification)
- ✅ Full name (plaintext, for display)
- ✅ Verification timestamp
- ✅ Verification method (bankid_se, vipps, mitid)

**What NOT to store:**

- ❌ BankID certificates
- ❌ BankID signatures (only verify, don't store)
- ❌ Temporary tokens

**Database schema:**

```sql
CREATE TABLE user_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  verification_method VARCHAR(20) NOT NULL, -- 'bankid_se', 'vipps', 'mitid'
  national_id_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for lookup
  national_id_encrypted TEXT NOT NULL, -- AES-256 encrypted
  full_name VARCHAR(255) NOT NULL,
  verified_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_verifications_user_id ON user_verifications(user_id);
CREATE UNIQUE INDEX idx_user_verifications_national_id ON user_verifications(national_id_hash);
```

### GDPR Compliance

**BankID authentication is GDPR-friendly:**

- ✅ Explicit consent (user initiates)
- ✅ Minimal data collection (name + ID number)
- ✅ Purpose limitation (identity verification only)
- ✅ Data minimization (don't store signatures)
- ✅ Right to erasure (can delete account)

**Required disclosures:**

- Privacy policy: Explain BankID data usage
- Terms: Clarify identity verification purpose
- Consent checkbox: "I agree to verify my identity with BankID"

---

## Testing Strategy

### Test Environments

**Sweden - BankID:**

- Test API: `https://appapi2.test.bankid.com`
- Test users: Provided by BankID (fake personal numbers)
- Test app: BankID app has "Test mode"

**Norway - Vipps:**

- Test API: Vipps Test Environment
- Test users: Create in Vipps portal
- Test app: Vipps app test mode

**Denmark - MitID:**

- Test API: MitID Pre-production
- Test users: Provided by Nets
- Test app: MitID test app

**Criipto Test:**

- Free test environment
- All Nordic countries
- Simulated BankID responses
- No real apps needed

---

## Implementation Checklist

### Week 1: Foundation

- [ ] Set up Supabase Auth
- [ ] Email/password authentication
- [ ] Google OAuth
- [ ] Apple OAuth
- [ ] Session management
- [ ] Protected routes

### Week 2: BankID Setup

- [ ] Choose provider (Criipto vs custom)
- [ ] Register accounts (Sweden, Norway, Denmark)
- [ ] Get test credentials
- [ ] Configure environment variables
- [ ] Create Edge Functions

### Week 3: Integration

- [ ] Swedish BankID flow
- [ ] Vipps flow
- [ ] MitID flow
- [ ] QR code generation
- [ ] Mobile deep-linking
- [ ] Error handling

### Week 4: Testing

- [ ] Test all flows in test environments
- [ ] Test same-device (mobile)
- [ ] Test cross-device (QR codes)
- [ ] Test error scenarios
- [ ] Load testing
- [ ] Security audit

### Week 5: Production

- [ ] Apply for production certificates
- [ ] Configure production endpoints
- [ ] Deploy to production
- [ ] Monitor first authentications
- [ ] Gather user feedback

---

## Cost Breakdown

### Initial Setup (One-time)

| Item         | Sweden    | Norway  | Denmark   | Total    |
| ------------ | --------- | ------- | --------- | -------- |
| BankID Setup | 5,000 SEK | FREE    | 2,000 DKK | ~$800    |
| Dev Time     | 8 hours   | 4 hours | 4 hours   | 16 hours |
| Testing      | 2 hours   | 2 hours | 2 hours   | 6 hours  |

**Total Initial:** ~$800 + 22 hours development

---

### Ongoing Costs (Monthly)

**Option A: Criipto (Recommended for MVP)**

- <10,000 auths/month: ~$1,000/month
- 10,000-50,000: ~$3,000/month
- > 50,000: Consider custom

**Option B: Custom Integration**

- Per-transaction: ~$0.50-1.00 (Sweden), FREE (Norway), ~$0.20 (Denmark)
- 10,000 auths/month: ~$500/month
- 50,000 auths/month: ~$2,500/month

**Break-even:** Custom becomes cheaper at ~15,000 auths/month

---

## Recommendation

### **Phase 1 (Now):**

1. Implement email/password + Google/Apple OAuth
2. Launch with basic auth
3. Gather Nordic user feedback

### **Phase 2 (Month 2):**

1. Integrate Criipto for all Nordic BankID
2. Add BankID buttons to login/signup
3. Market as "Nordic-first" feature

### **Phase 3 (Month 6, if volume justifies):**

1. Evaluate transaction costs
2. If >15,000 auths/month, build custom
3. Migrate from Criipto to custom integration

---

## Resources

### Official Documentation

- **Swedish BankID:** https://www.bankid.com/en/utvecklare
- **Vipps Login:** https://vipps.no/developer/
- **MitID:** https://www.mitid.dk/erhverv/

### Third-Party Providers

- **Criipto:** https://www.criipto.com/products/easy-onboarding
- **Signicat:** https://www.signicat.com/products/electronic-id

### Integration Libraries

- **BankID SDK (Node.js):** https://github.com/bankid/bankid-relying-party
- **Supabase Auth:** https://supabase.com/docs/guides/auth

---

**Status:** Ready to implement  
**Next Step:** Choose Criipto vs custom, create Supabase Edge Function
