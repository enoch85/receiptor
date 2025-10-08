#!/bin/bash
# Serve APK files for download
# Run from /workspaces/receiptor/mobile

set -e

echo "📦 Receiptor APK Server"
echo "======================="
echo ""

# Check if APK exists
if [ ! -f "builds/receiptor-latest.apk" ]; then
    echo "❌ No APK found in builds/ directory"
    echo ""
    echo "Please build the APK first:"
    echo "  ./build-apk.sh"
    exit 1
fi

# Get file size
size=$(du -h builds/receiptor-latest.apk | cut -f1)
echo "✅ APK found: $size"
echo ""

# Get container IP
IP=$(hostname -I | awk '{print $1}')

echo "🌐 Starting HTTP server..."
echo ""
echo "Download URL (from inside dev container):"
echo "  http://localhost:8080/receiptor-latest.apk"
echo ""
echo "Download URL (from your network):"
echo "  http://$IP:8080/receiptor-latest.apk"
echo ""
echo "📱 On your Android device:"
echo "  1. Open browser to http://$IP:8080"
echo "  2. Tap 'receiptor-latest.apk' to download"
echo "  3. Install when prompted (allow unknown sources if needed)"
echo ""
echo "Press Ctrl+C to stop server"
echo ""

cd builds
python3 -m http.server 8080
