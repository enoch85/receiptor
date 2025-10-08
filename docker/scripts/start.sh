#!/bin/bash
# Receiptor Testing Environment - Start Script

set -e

echo "🧾 Starting Receiptor Testing Environment..."
echo ""

cd "$(dirname "$0")/.."

# Start all services
docker-compose -f docker/docker-compose.yml up -d

echo ""
echo "✅ All services starting!"
echo ""
echo "📱 Access your apps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Web App (Next.js):      http://localhost:3000"
echo "  📱 Mobile App (Expo Web):  http://localhost:19006"
echo "  🎨 Supabase Studio:        http://localhost:3001"
echo "  📧 Email Inbox:            http://localhost:9000"
echo "  🔌 Supabase API:           http://localhost:8000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Useful commands:"
echo "  npm run docker:logs    - View logs"
echo "  npm run docker:down    - Stop all services"
echo "  ./docker/scripts/stop.sh   - Stop (script version)"
echo ""
echo "⏳ Services are starting... check logs with: docker-compose -f docker/docker-compose.yml logs -f"
