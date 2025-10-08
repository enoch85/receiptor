# Building Development APK

## Overview

This guide explains how to build a production-like APK for testing on real Android devices with full Veryfi OCR functionality.

## Prerequisites

1. **Expo Account** (free)
   - Sign up at https://expo.dev/signup
   - No credit card required

2. **EAS CLI** (installed globally)
   ```bash
   npm install -g eas-cli
   ```

## Build Instructions

### 1. Login to Expo

```bash
cd /workspaces/receiptor/mobile
eas login
```

Enter your Expo credentials.

### 2. Configure Project (First Time Only)

```bash
eas build:configure
```

This will:

- Link your project to Expo
- Set up build credentials
- Configure Android keystore (auto-generated)

### 3. Build Development APK

```bash
# Build APK with Veryfi credentials embedded
eas build --platform android --profile preview --local
```

**Options:**

- `--platform android` - Build for Android
- `--profile preview` - Use the preview profile (APK, not AAB)
- `--local` - Build locally and save to `builds/` directory

**Build Time:** ~15-20 minutes (first build), ~5-10 minutes (subsequent builds)

**Output:** APK file in `builds/` directory with name like:

```
builds/receiptor-0.1.0-preview-123456.apk
```

### 4. Alternative: Cloud Build (Faster)

If local build is slow, use Expo's cloud builders:

```bash
eas build --platform android --profile preview
```

This will:

- Build on Expo's servers (much faster)
- Generate a download link
- You can download the APK directly

**Build Time:** ~5-10 minutes

### 5. Download APK (Cloud Build)

After cloud build completes, you'll get a link:

```
✔ Build finished
📦 https://expo.dev/artifacts/eas/[build-id].apk
```

Download with:

```bash
wget -O builds/receiptor-latest.apk "https://expo.dev/artifacts/eas/[build-id].apk"
```

## Installing APK on Android Device

### Method 1: Direct USB Install (ADB)

```bash
# Enable USB debugging on your Android device
# Settings > Developer Options > USB Debugging

# Install APK
adb install builds/receiptor-latest.apk
```

### Method 2: Download on Device

1. **Upload APK to accessible location:**

   ```bash
   # Option A: Start simple HTTP server
   cd builds
   python3 -m http.server 8080
   ```

2. **On your Android device:**
   - Open browser to `http://[dev-container-ip]:8080`
   - Download the APK file
   - Install when prompted (may need to allow "Install from unknown sources")

### Method 3: File Transfer

1. **Copy APK to your device:**

   ```bash
   # Via USB
   adb push builds/receiptor-latest.apk /sdcard/Download/

   # Or use file sharing (Google Drive, Dropbox, etc.)
   ```

2. **On your device:**
   - Open "Files" or "Downloads" app
   - Tap the APK file
   - Allow installation from unknown sources
   - Install

## Testing Veryfi OCR

Once installed:

1. **Open the app** - Should show login screen
2. **Create account or login** - Use your test credentials
3. **Navigate to "Receipts" tab**
4. **Tap "+" or "Scan Receipt"**
5. **Take photo of a receipt**
6. **Wait for OCR processing** - Should see real Veryfi data!

### Verify Real API is Working

Check these indicators:

- ✅ Receipt data looks accurate (store name, items, prices)
- ✅ Processing takes 3-5 seconds (not instant like mock data)
- ✅ Store logo detected (if available)
- ✅ Line items properly parsed
- ✅ Tax and totals calculated

### Mock Data Fallback

If Veryfi credentials are missing/invalid, the app will automatically use **realistic mock data** (Swedish grocery store). This is expected for development without credentials.

## Build Profiles

### Development (`development`)

- Development client build
- Includes debugging tools
- Larger file size (~50MB)
- Hot reload support

### Preview (`preview`) ⭐ **RECOMMENDED**

- Production-like build
- Smaller file size (~25MB)
- Veryfi credentials embedded
- No debugging overhead
- **Best for testing real OCR**

### Production (`production`)

- Google Play Store release
- AAB format (not APK)
- Code signing required
- Optimized and minified

## Troubleshooting

### Error: "eas command not found"

```bash
npm install -g eas-cli
```

### Error: "Not logged in"

```bash
eas login
```

### Error: "Project not configured"

```bash
eas build:configure
```

### Build fails with Gradle error

- Check `mobile/android/` directory exists
- Run `npx expo prebuild` to generate native code

### APK won't install on device

- Enable "Install from unknown sources" in Android settings
- Check Android version (requires Android 5.0+)
- Verify APK is not corrupted (re-download)

### Veryfi not working in APK

- Verify credentials in `eas.json` are correct
- Check network connectivity
- Look for errors in device logs: `adb logcat | grep Veryfi`

## Environment Variables

Veryfi credentials are embedded in the APK via `eas.json`:

```json
{
  "build": {
    "preview": {
      "env": {
        "VERYFI_CLIENT_ID": "your-client-id",
        "VERYFI_CLIENT_SECRET": "your-secret",
        "VERYFI_API_KEY": "your-api-key",
        "VERYFI_USERNAME": "your-username"
      }
    }
  }
}
```

**⚠️ Security Note:** Never commit real credentials to public repositories. For production, use Expo Secrets:

```bash
eas secret:create --name VERYFI_CLIENT_ID --value "..."
eas secret:create --name VERYFI_CLIENT_SECRET --value "..."
```

## Next Steps

Once APK is working:

1. Test all receipt capture flows
2. Verify OCR accuracy with different receipt types
3. Test offline mode (should use cached data)
4. Test error handling (bad photos, network errors)
5. Gather feedback on UX

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Veryfi API Docs](https://docs.veryfi.com/)
- [Expo Forums](https://forums.expo.dev/)

---

**Last Updated:** October 8, 2025  
**Status:** Ready for Testing ✅
