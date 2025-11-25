#!/bin/bash
# Start all microservices for development

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Export project root for proto file resolution
export PROJECT_ROOT="$SCRIPT_DIR"

echo "🚀 Starting One-Stop-Book Services..."

# Start grounds-service
echo "📍 Starting grounds-service on port 50052..."
(cd services/grounds-service && PROJECT_ROOT="$PROJECT_ROOT" npx tsx src/server.ts) &
GROUNDS_PID=$!

# Start auth-service  
echo "🔐 Starting auth-service on port 50051..."
(cd services/auth-service && PROJECT_ROOT="$PROJECT_ROOT" npx tsx src/server.ts) &
AUTH_PID=$!

# Start booking-service
echo "📅 Starting booking-service on port 50053..."
(cd services/booking-service && PROJECT_ROOT="$PROJECT_ROOT" npx tsx src/server.ts) &
BOOKING_PID=$!

# Start maintenance-service
echo "🔧 Starting maintenance-service on port 50054..."
(cd services/maintenance-service && PROJECT_ROOT="$PROJECT_ROOT" npx tsx src/server.ts) &
MAINTENANCE_PID=$!

# Start notification-service
echo "📧 Starting notification-service on port 50055..."
(cd services/notification-service && PROJECT_ROOT="$PROJECT_ROOT" npx tsx src/server.ts) &
NOTIFICATION_PID=$!

# Wait a bit for gRPC services to start
sleep 3

# Start API Gateway
echo "🌐 Starting api-gateway on port 3000..."
(cd services/api-gateway && PROJECT_ROOT="$PROJECT_ROOT" npx tsx src/server.ts) &
GATEWAY_PID=$!

# Start Frontend (Next.js)
echo "💻 Starting frontend on port 3001..."
(cd frontend && PROJECT_ROOT="$PROJECT_ROOT" npm run dev -- -p 3001) &
FRONTEND_PID=$!

echo "
✅ All services started!

Services:
- API Gateway: http://localhost:3000
- Frontend: http://localhost:3001
- Auth Service (gRPC): localhost:50051
- Grounds Service (gRPC): localhost:50052
- Booking Service (gRPC): localhost:50053
- Maintenance Service (gRPC): localhost:50054
- Notification Service (gRPC): localhost:50055

Press Ctrl+C to stop all services...
"

# Trap SIGINT (Ctrl+C) and kill all child processes
trap "echo '\n🛑 Stopping all services...'; kill $GROUNDS_PID $AUTH_PID $BOOKING_PID $MAINTENANCE_PID $NOTIFICATION_PID $GATEWAY_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

# Wait for all background processes
wait
