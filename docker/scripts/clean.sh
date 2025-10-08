#!/bin/bash
# Receiptor Testing Environment - Clean Everything

set -e

echo "🧹 Cleaning Receiptor Testing Environment..."
echo "⚠️  This will remove all data and containers!"
echo ""
read -p "Are you sure? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd "$(dirname "$0")/.."
    
    echo "Stopping and removing containers..."
    docker-compose -f docker/docker-compose.yml down -v
    
    echo "Removing Docker images..."
    docker rmi receiptor-mobile-app receiptor-web-app 2>/dev/null || true
    
    echo "Pruning Docker system..."
    docker system prune -f
    
    echo ""
    echo "✅ Cleanup complete!"
    echo "💡 To start fresh: npm run docker:up"
else
    echo "Cancelled."
fi
