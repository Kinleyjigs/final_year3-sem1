#!/bin/bash
# Run Prisma migrations for all services

set -e

echo "Running migrations for all services..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Auth Service
echo "📦 Migrating auth-service..."
cd "$PROJECT_ROOT/services/auth-service"
npx prisma migrate deploy

# Grounds Service
echo "📦 Migrating grounds-service..."
cd "$PROJECT_ROOT/services/grounds-service"
npx prisma migrate deploy

# Booking Service
echo "📦 Migrating booking-service..."
cd "$PROJECT_ROOT/services/booking-service"
npx prisma migrate deploy

# Maintenance Service
echo "📦 Migrating maintenance-service..."
cd "$PROJECT_ROOT/services/maintenance-service"
npx prisma migrate deploy

# Notification Service
echo "📦 Migrating notification-service..."
cd "$PROJECT_ROOT/services/notification-service"
npx prisma migrate deploy

echo "✅ All migrations complete!"
