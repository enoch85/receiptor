# 📱 Quick Start: Build & Test Production-Like APK

## TL;DR - 3 Simple Steps

```bash
cd /workspaces/receiptor/mobile

# 1. Build APK (cloud build - faster)
./build-apk.sh

# 2. Download APK from the link provided, then serve it
./serve-apk.sh

# 3. On your Android phone, open browser to the URL shown
#    Download and install receiptor-latest.apk
```

## What You Get

✅ **Production-like APK** with:

- Full Veryfi OCR integration
- Real API credentials embedded
- Camera permissions enabled
- Installable on any Android device
- No Expo Go required

## Step-by-Step Instructions

### 1️⃣ Build the APK

```bash
cd /workspaces/receiptor/mobile
./build-apk.sh
```

**First time only:**

- You'll be prompted to login to Expo (create free account if needed)
- Choose "1" for cloud build (faster, recommended)
- Wait 5-10 minutes for build to complete

**Output:** Download link like:

```
✔ Build finished
📦 https://expo.dev/artifacts/eas/abc123.apk
```

### 2️⃣ Download the APK

Copy the download link and run:

```bash
wget -O builds/receiptor-latest.apk "https://expo.dev/artifacts/eas/[your-build-id].apk"
```

Or download manually in browser and save to `builds/receiptor-latest.apk`

### 3️⃣ Serve the APK for Download

```bash
./serve-apk.sh
```

This will:

- Start HTTP server on port 8080
- Show you the download URL
- Display your dev container's IP address

**Example output:**

```
Download URL (from your network):
  http://192.168.1.100:8080/receiptor-latest.apk

📱 On your Android device:
  1. Open browser to http://192.168.1.100:8080
  2. Tap 'receiptor-latest.apk' to download
  3. Install when prompted
```

### 4️⃣ Install on Android Device

**On your Android phone/tablet:**

1. **Open browser** to the URL shown (e.g., `http://192.168.1.100:8080`)
2. **Tap** `receiptor-latest.apk` to download
3. **Allow** "Install from unknown sources" when prompted
4. **Install** the APK
5. **Open** the Receiptor app

## Testing Veryfi OCR

Once installed:

1. **Open app** → Should show login screen
2. **Create account** or login with test credentials
3. **Navigate to Receipts** tab
4. **Tap "+" button** to scan receipt
5. **Take photo** of any receipt
6. **Wait 3-5 seconds** → Real Veryfi OCR processing!
7. **Verify** receipt details are accurate

### ✅ How to Know It's Working

Real Veryfi API (not mock data):

- ✅ Processing takes 3-5 seconds (not instant)
- ✅ Store name, items, prices are accurate
- ✅ Line items properly parsed
- ✅ Tax and totals calculated correctly
- ✅ Timestamps are current

Mock data fallback (if credentials missing):

- ⚠️ Instant response (<1 second)
- ⚠️ Always returns "Coop" Swedish grocery store
- ⚠️ Same test items every time

## Alternative: Direct ADB Install

If you have ADB installed and device connected via USB:

```bash
# Build APK
./build-apk.sh

# Download from link to builds/receiptor-latest.apk

# Install directly
adb install builds/receiptor-latest.apk
```

## Troubleshooting

### "Connection refused" when downloading APK

**Problem:** Phone can't reach dev container

- Make sure phone is on same network as dev container
- Check firewall isn't blocking port 8080
- Try: `curl http://localhost:8080` from dev container to test

### "App not installed" error

**Problem:** Installation failed

- Enable "Install from unknown sources" in Android settings
- Check Android version (needs 5.0+)
- Try re-downloading APK (might be corrupted)

### "eas command not found"

**Problem:** EAS CLI not installed

```bash
npm install -g eas-cli
```

### Build fails

**Problem:** Various build errors

- Check you're logged in: `eas whoami`
- Try: `eas build:configure` to reset configuration
- Check `eas.json` has correct credentials

### Veryfi not working in APK

**Problem:** Using mock data instead of real API

- Check credentials in `eas.json` are correct
- Verify network connectivity on device
- Check device logs: `adb logcat | grep Veryfi`

## Build Profiles

| Profile       | Speed            | Size  | Use Case                                           |
| ------------- | ---------------- | ----- | -------------------------------------------------- |
| `preview` ⭐  | Fast (5-10 min)  | ~25MB | **Testing OCR** - Production-like with credentials |
| `development` | Slow (15-20 min) | ~50MB | Debugging with dev tools                           |
| `production`  | Slow (15-20 min) | ~20MB | Google Play Store (AAB format)                     |

**Recommendation:** Use `preview` profile for testing Veryfi OCR.

## Files Created

```
mobile/
├── eas.json              # ✅ Build configuration with Veryfi credentials
├── app.json              # ✅ Updated with package name and permissions
├── build-apk.sh          # ✅ Interactive build script
├── serve-apk.sh          # ✅ HTTP server to download APK
├── BUILD_APK.md          # ✅ Comprehensive documentation
├── QUICKSTART_APK.md     # ✅ This file
└── builds/
    ├── .gitkeep          # ✅ Keep directory in git
    └── *.apk             # APK files (git-ignored)
```

## Next Steps

1. ✅ Build APK with `./build-apk.sh`
2. ✅ Download APK from link provided
3. ✅ Serve with `./serve-apk.sh`
4. ✅ Install on Android device
5. ✅ Test Veryfi OCR with real receipts
6. 📝 Document any bugs or UX issues
7. 🎨 Polish UI based on real device testing

## Resources

- **Detailed guide:** [BUILD_APK.md](./BUILD_APK.md)
- **EAS Build docs:** https://docs.expo.dev/build/introduction/
- **Veryfi docs:** https://docs.veryfi.com/

---

**Status:** Ready to build! ✅  
**Last Updated:** October 8, 2025
