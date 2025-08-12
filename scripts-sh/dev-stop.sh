#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_step "Stopping DPP Development Environment"
echo "================================================="

# Stop Docker services
print_step "Stopping Docker services..."
docker-compose -f docker-compose.dev.yml down

if [ $? -eq 0 ]; then
    print_success "Docker services stopped"
else
    echo -e "${RED}[ERROR]${NC} Failed to stop some Docker services"
fi

# Kill any remaining Node.js processes (frontend)
print_step "Cleaning up frontend processes..."
pkill -f "next-server" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Clean up .env.local if it exists
if [ -f "frontend/.env.local" ]; then
    print_step "Cleaning up frontend environment..."
    rm frontend/.env.local
fi

print_success "🛑 Development environment stopped"
echo ""
echo "💡 To restart: ./dev-start.sh"