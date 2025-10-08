#!/bin/bash
# Receiptor Testing Environment - View Logs

cd "$(dirname "$0")/.."

echo "📋 Viewing logs (Ctrl+C to exit)..."
echo ""

docker-compose -f docker/docker-compose.yml logs -f --tail=100
