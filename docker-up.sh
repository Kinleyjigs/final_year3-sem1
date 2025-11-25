#!/bin/bash
# Convenience script to start Docker infrastructure (PostgreSQL + Redis)
# Services (auth, grounds, etc.) should be run locally with: npm run dev
echo "🚀 Starting infrastructure services (PostgreSQL + Redis)..."
docker compose -f infrastructure/docker-compose.dev.yml up -d

echo ""
echo "✅ Infrastructure ready!"
echo ""
echo "📦 Database: postgresql://osb_user:osb_password@localhost:5432/one_stop_book"
echo "🔴 Redis: redis://localhost:6379"
echo ""
echo "Next steps:"
echo "  1. Run Prisma migrations: cd services/auth-service && npx prisma migrate dev"
echo "  2. Start Auth Service: cd services/auth-service && npm run dev"
echo "  3. Start API Gateway: cd services/api-gateway && npm run dev"
echo "  4. Start Frontend: cd frontend && npm run dev"
