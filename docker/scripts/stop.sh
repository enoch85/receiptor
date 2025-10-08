#!/bin/bash
# Receiptor Testing Environment - Stop Script

set -e

echo "🛑 Stopping Receiptor Testing Environment..."
echo ""

cd "$(dirname "$0")/.."

docker-compose -f docker/docker-compose.yml down

echo ""
echo "✅ All services stopped!"
echo ""
echo "💡 To start again: npm run docker:up"
