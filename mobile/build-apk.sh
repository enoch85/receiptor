#!/bin/bash
# Build and serve development APK
# Run from /workspaces/receiptor/mobile

set -e

echo "🚀 Receiptor APK Builder"
echo "========================"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if logged in
echo "Checking Expo login status..."
if ! eas whoami &> /dev/null; then
    echo ""
    echo "📝 Please login to your Expo account:"
    eas login
    echo ""
fi

# Build APK
echo ""
echo "🔨 Building APK (this will take 5-15 minutes)..."
echo ""
echo "Choose build method:"
echo "  1. Cloud build (faster, recommended)"
echo "  2. Local build (slower, builds in dev container)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Building on Expo's cloud servers..."
    eas build --platform android --profile preview
    
    echo ""
    echo "✅ Build complete! Download link above ☝️"
    echo ""
    echo "To download the APK:"
    echo "  1. Copy the download URL from above"
    echo "  2. Run: wget -O builds/receiptor-latest.apk \"[URL]\""
    echo "  3. Then run: ./serve-apk.sh"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "Building locally (may take 15-20 minutes)..."
    eas build --platform android --profile preview --local --output builds/receiptor-latest.apk
    
    echo ""
    echo "✅ Build complete! APK saved to builds/receiptor-latest.apk"
    echo ""
    echo "To serve the APK for download:"
    echo "  Run: ./serve-apk.sh"
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "📖 See BUILD_APK.md for installation instructions"
