#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    if [ ! -z "$FRONTEND_PID" ]; then
        print_step "Stopping frontend (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null
    fi
    print_step "Stopping Docker services"
    docker-compose -f docker-compose.dev.yml down
    exit 0
}

# Trap cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Check if required files exist
if [ ! -f "docker-compose.dev.yml" ]; then
    print_error "docker-compose.dev.yml not found!"
    exit 1
fi

if [ ! -d "frontend" ]; then
    print_error "frontend directory not found!"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Make sure environment variables are set."
fi

print_step "Starting DPP Development Environment"
echo "================================================="

# Start Docker services
print_step "Starting Docker services (backend, gas-station, redis)..."
docker-compose -f docker-compose.dev.yml up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start Docker services"
    exit 1
fi

print_success "Docker services started"

# Wait a bit for services to be ready
print_step "Waiting for services to initialize..."
sleep 5

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    print_step "Installing frontend dependencies..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
    print_success "Frontend dependencies installed"
fi

# Create/update .env.local for frontend with dev settings
print_step "Configuring frontend environment..."

# Load environment variables from main .env file if it exists
if [ -f ".env" ]; then
    source .env
fi

cat > frontend/.env.local << EOF
# Development environment configuration
BACKEND_ENDPOINT=http://localhost:3001
GAS_STATION_URL=http://localhost:9527

# Frontend environment variables
NEXT_PUBLIC_EXPLORER_URL=${NEXT_PUBLIC_EXPLORER_URL:-https://explorer.rebased.iota.org}
NEXT_PUBLIC_DAPP_URL=http://localhost:3000
NEXT_PUBLIC_AUDIT_TRAIL_PKG=${NEXT_PUBLIC_AUDIT_TRAIL_PKG:-}
NEXT_PUBLIC_REWARD_WHITELIST_ID=${NEXT_PUBLIC_REWARD_WHITELIST_ID:-}
NEXT_PUBLIC_REWARD_VAULT_ID=${NEXT_PUBLIC_REWARD_VAULT_ID:-}
NEXT_PUBLIC_ADMIN_CAP_ID=${NEXT_PUBLIC_ADMIN_CAP_ID:-}
NEXT_PUBLIC_REFRESH_INTERVAL_MS=${NEXT_PUBLIC_REFRESH_INTERVAL_MS:-5000}
NEXT_PUBLIC_HAS_REWARD=${NEXT_PUBLIC_HAS_REWARD:-true}
NEXT_PUBLIC_NETWORK=${NEXT_PUBLIC_NETWORK:-testnet}
NEXT_PUBLIC_PRODUCT_ID=${NEXT_PUBLIC_PRODUCT_ID:-}
IOTA_IDENTITY_PKG_ID=${IOTA_IDENTITY_PKG_ID:-}
EOF

print_success "Frontend environment configured"

# Start frontend
print_step "Starting frontend development server..."
cd frontend

# Start frontend in background and capture PID
npm run dev &
FRONTEND_PID=$!

print_success "Frontend started (PID: $FRONTEND_PID)"
cd ..

# Display status
echo "================================================="
print_success "🚀 Development environment is ready!"
echo ""
echo "📍 Services running:"
echo "   • Backend:     http://localhost:3001"
echo "   • Frontend:    http://localhost:3000"
echo "   • Gas Station: http://localhost:9527"
echo ""
echo "📊 Docker services:"
docker-compose -f docker-compose.dev.yml ps
echo ""
echo "💡 Tips:"
echo "   • Press Ctrl+C to stop all services"
echo "   • Frontend has hot reload enabled"
echo "   • Backend logs: docker-compose -f docker-compose.dev.yml logs backend"
echo "   • Gas Station logs: docker-compose -f docker-compose.dev.yml logs iota-gas-station"
echo ""
print_step "Watching for changes... (Press Ctrl+C to stop)"

# Keep script running and show frontend logs
wait $FRONTEND_PID