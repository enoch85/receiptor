# Password Reset Guide

## 🔒 Why Passwords Cannot Be Decrypted

Your password is **hashed** (not encrypted) using industry-standard bcrypt:

- **One-way function**: Mathematically impossible to reverse
- **GDPR compliant**: Passwords are never stored in plain text
- **Bank-grade security**: Same security used by financial institutions

Even with full database access, passwords cannot be recovered. This is by design and is a security feature, not a limitation.

---

## ✅ Password Reset Flow (Working!)

### 1. Request Password Reset

**URL**: `http://localhost:3000/auth/forgot-password`

**Steps**:

1. Enter your email address
2. Click "Send reset link"
3. Check MailHog for the reset email

### 2. Check MailHog for Email

**MailHog Web UI**: `http://localhost:8025`

MailHog captures all outgoing emails in development. You'll see:

- **From**: noreply@receiptor.app (or configured sender)
- **To**: Your email address
- **Subject**: Reset your password
- **Body**: Contains a magic link to reset password

### 3. Click Reset Link

The email contains a link like:

```
http://localhost:3000/auth/reset-password?token=...
```

This link:

- ✅ Is single-use (cannot be reused)
- ✅ Expires after 1 hour (configurable)
- ✅ Contains encrypted token
- ✅ Validates your identity

### 4. Set New Password

**URL**: `http://localhost:3000/auth/reset-password`

**Features**:

- Password strength indicator
- Real-time validation
- Minimum 8 characters
- Must match confirmation
- Shows password requirements

### 5. Automatic Login

After successful password reset:

- ✅ Automatically logged in
- ✅ Redirected to dashboard
- ✅ Old password invalidated
- ✅ All other sessions terminated (security)

---

## 🧪 Testing the Flow

### Test User Reset

```bash
# 1. Go to forgot password page
http://localhost:3000/auth/forgot-password

# 2. Enter email: mailto@danielhansson.nu

# 3. Open MailHog
http://localhost:8025

# 4. Click the reset link in the email

# 5. Set new password (min 8 chars)

# 6. You'll be logged in and redirected to dashboard
```

---

## 🔧 Configuration

### Email Settings (Supabase Auth)

Located in: `docker/docker-compose.simple.yml`

```yaml
auth:
  environment:
    GOTRUE_SMTP_HOST: mailhog
    GOTRUE_SMTP_PORT: 1025
    GOTRUE_SMTP_ADMIN_EMAIL: admin@receiptor.app
    GOTRUE_MAILER_AUTOCONFIRM: true # Auto-confirm emails in dev
```

### Reset Token Settings

Default Supabase configuration:

- **Token expiry**: 1 hour
- **Single use**: Yes
- **Secure**: Uses PKCE flow

---

## 📧 Email Templates

### Forgot Password Email

```
Subject: Reset your password

Hi there,

You requested to reset your password for Receiptor.

Click the link below to set a new password:
[Reset Password Button]

This link expires in 1 hour.

If you didn't request this, you can safely ignore this email.

Thanks,
The Receiptor Team
```

### Password Changed Confirmation

```
Subject: Your password was changed

Hi there,

Your password for Receiptor was successfully changed.

If you didn't make this change, please contact support immediately.

Thanks,
The Receiptor Team
```

---

## 🛡️ Security Features

### Password Requirements

- ✅ Minimum 8 characters
- ✅ Hashed with bcrypt (cost factor 10)
- ✅ Never stored in plain text
- ✅ Never logged or transmitted unencrypted

### Reset Token Security

- ✅ Cryptographically random
- ✅ Single-use (invalidated after use)
- ✅ Time-limited (1 hour expiry)
- ✅ Bound to user session
- ✅ Cannot be guessed or brute-forced

### Session Management

- ✅ Old sessions invalidated on password change
- ✅ Requires re-authentication on sensitive actions
- ✅ CSRF protection
- ✅ Rate limiting on reset requests

---

## 🐛 Troubleshooting

### Email Not Received

1. **Check MailHog**: http://localhost:8025
2. **Check auth logs**: `docker-compose logs auth | grep reset`
3. **Verify SMTP config**: Email sent to MailHog (not real email in dev)

### Reset Link Expired

- Links expire after 1 hour
- Request a new reset link
- Check system time is correct

### "Invalid or expired token"

- Link already used (single-use)
- Link expired (>1 hour old)
- Request new reset link

### Password Not Updating

- Check browser console for errors
- Verify password meets requirements (8+ chars)
- Check auth service logs: `docker-compose logs auth`

---

## 📊 Pages Created

### `/auth/forgot-password`

- Email input form
- Success state with instructions
- Back to login link
- Security notes

### `/auth/reset-password`

- New password input
- Password confirmation
- Strength indicator
- Real-time validation
- Success redirect to dashboard

---

## 🔗 Related Files

```
/web/src/app/auth/forgot-password/page.tsx  # Request reset page
/web/src/app/auth/reset-password/page.tsx   # Set new password page
/web/src/lib/auth.ts                        # resetPassword() & updatePassword()
/docker/docker-compose.simple.yml           # Email configuration
```

---

## ✅ Summary

**Password Recovery: IMPOSSIBLE** ✅ (This is good!)

- Passwords are hashed, not encrypted
- No backdoor or master password
- GDPR and security compliant

**Password Reset: WORKING** ✅

1. Request reset at `/auth/forgot-password`
2. Check MailHog at `http://localhost:8025`
3. Click reset link
4. Set new password at `/auth/reset-password`
5. Automatically logged in

**Security: MAXIMUM** 🔒

- Bank-grade password hashing
- Single-use, time-limited reset tokens
- All sessions invalidated on password change
- Rate limiting and CSRF protection

---

**Need to reset your password?** Visit: http://localhost:3000/auth/forgot-password
