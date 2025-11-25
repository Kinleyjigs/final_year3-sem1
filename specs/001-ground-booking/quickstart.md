# Quickstart Guide: One Stop Book

**Last Updated**: 2025-11-24  
**Branch**: `001-ground-booking`

## Overview

This guide will help you set up the One Stop Book platform locally for development. The system consists of 5 microservices, an API Gateway, a React frontend, PostgreSQL database, and Redis cache.

---

## Prerequisites

**Required Software**:
- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **Docker**: v24.x or higher ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: v2.x or higher (included with Docker Desktop)
- **Git**: v2.x or higher

**Optional Tools**:
- **Postman** or **Insomnia**: For API testing
- **pgAdmin** or **DBeaver**: For database management
- **VS Code** with extensions: Prisma, ESLint, Prettier, Docker

**System Requirements**:
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 5GB free space
- **OS**: macOS, Linux, or Windows with WSL2

---

## Quick Start (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/Kinleyjigs/final_year3-sem1.git
cd final_year3-sem1
git checkout 001-ground-booking
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install dependencies for all services and frontend
npm run install:all
```

### 3. Set Up Environment Variables

```bash
# Copy example environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp services/api-gateway/.env.example services/api-gateway/.env
# Repeat for all services...

# Or use the setup script
npm run setup:env
```

**Edit `.env` file** (root directory):

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/one_stop_book

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

# SMTP (for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# gRPC Service Ports
AUTH_SERVICE_URL=localhost:50051
GROUNDS_SERVICE_URL=localhost:50052
BOOKING_SERVICE_URL=localhost:50053
MAINTENANCE_SERVICE_URL=localhost:50054
NOTIFICATION_SERVICE_URL=localhost:50055
```

### 4. Start Services with Docker Compose

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start all microservices and frontend
docker-compose up
```

**Alternative (Run Locally Without Docker)**:

```bash
# Start PostgreSQL and Redis in Docker
docker-compose up -d postgres redis

# Run migrations and seed
npm run db:migrate
npm run db:seed

# Start services in separate terminals
cd services/auth-service && npm run dev
cd services/grounds-service && npm run dev
cd services/booking-service && npm run dev
cd services/maintenance-service && npm run dev
cd services/notification-service && npm run dev
cd services/api-gateway && npm run dev
cd frontend && npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3001
- **API Gateway**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api/docs (Swagger UI)
- **Prisma Studio**: `npm run db:studio` → http://localhost:5555

---

## Project Structure

```
one-stop-book/
├── services/                   # Backend microservices
│   ├── api-gateway/            # REST API Gateway (Express)
│   ├── auth-service/           # Auth Service (gRPC)
│   ├── grounds-service/        # Grounds Service (gRPC)
│   ├── booking-service/        # Booking Service (gRPC)
│   ├── maintenance-service/    # Maintenance Service (gRPC)
│   └── notification-service/   # Notification Service (gRPC)
├── frontend/                   # React SPA (Next.js 16)
├── packages/                   # Shared libraries
│   ├── common/                 # Shared types and utilities
│   └── grpc-clients/           # gRPC client instances
├── infrastructure/             # Docker, scripts, migrations
│   ├── docker-compose.yml      # Local development
│   ├── docker-compose.prod.yml # Production deployment
│   └── scripts/
│       └── seed.ts             # Database seeding
├── docs/                       # Documentation
│   ├── architecture/           # ADRs
│   └── api/                    # API specs (OpenAPI, proto)
└── specs/                      # Feature specifications
    └── 001-ground-booking/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md (this file)
        └── contracts/
```

---

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/booking-service
npm test

# Run integration tests
npm run test:integration

# Run E2E tests (requires services running)
npm run test:e2e

# Watch mode
npm run test:watch
```

### Database Management

```bash
# Create a new migration
cd services/booking-service
npx prisma migrate dev --name add_timezone_field

# Apply migrations (production)
npm run db:migrate:deploy

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Open Prisma Studio (visual database editor)
npm run db:studio
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

### Debugging

**VS Code Launch Configuration** (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API Gateway",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/services/api-gateway",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Booking Service",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/services/booking-service",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Sample Data

After running `npm run db:seed`, you'll have:

**Admin Users**:
- Email: `[email protected]`
- Password: `admin123`
- Role: ADMIN
- College: Royal University of Bhutan

**Regular Users**:
- Email: `[email protected]`
- Password: `user123`
- Role: USER
- College: Royal University of Bhutan

**Sample Grounds**:
- 10 football grounds across 3 colleges
- Each with capacity, amenities, and photos

**Sample Bookings**:
- 50 historical bookings (mix of approved, pending, canceled)

---

## Common Tasks

### 1. Create a New User Account

**Via API**:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "[email protected]",
    "password": "SecurePass123",
    "fullName": "Jane Doe",
    "college": "Royal University of Bhutan"
  }'
```

**Via Frontend**:
1. Go to http://localhost:3001
2. Click "Sign Up"
3. Fill in registration form
4. Submit

### 2. Create a Booking

**Prerequisite**: Logged in as a regular user

**Via API**:

```bash
# 1. Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"[email protected]","password":"user123"}' \
  | jq -r '.token')

# 2. Get ground ID
GROUND_ID=$(curl http://localhost:3000/api/grounds | jq -r '.data[0].id')

# 3. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"groundId\": \"$GROUND_ID\",
    \"bookingDate\": \"2025-12-01\",
    \"startTime\": \"14:00\",
    \"endTime\": \"16:00\"
  }"
```

**Via Frontend**:
1. Login at http://localhost:3001
2. Browse grounds
3. Click on a ground
4. Select available time slot from calendar
5. Click "Book Now"
6. Confirm booking

### 3. Schedule Maintenance (Admin Only)

**Prerequisite**: Logged in as admin

```bash
# 1. Login as admin
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"[email protected]","password":"admin123"}' \
  | jq -r '.token')

# 2. Get ground ID
GROUND_ID=$(curl http://localhost:3000/api/admin/grounds \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.[0].id')

# 3. Schedule maintenance
curl -X POST http://localhost:3000/api/admin/maintenance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"groundId\": \"$GROUND_ID\",
    \"startDateTime\": \"2025-12-05T08:00:00Z\",
    \"endDateTime\": \"2025-12-05T18:00:00Z\",
    \"description\": \"Annual grass resurfacing\"
  }"
```

---

## Troubleshooting

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
export PORT=3001
npm run dev
```

### Database Connection Error

**Problem**: `Error: P1001: Can't reach database server`

**Solution**:

```bash
# Ensure PostgreSQL container is running
docker-compose up -d postgres

# Check container logs
docker-compose logs postgres

# Verify DATABASE_URL in .env file
echo $DATABASE_URL
```

### gRPC Service Not Responding

**Problem**: `Error: 14 UNAVAILABLE: No connection established`

**Solution**:

```bash
# Check if service is running
docker-compose ps

# Restart the service
docker-compose restart auth-service

# Check service logs
docker-compose logs auth-service

# Verify gRPC port is correct in .env
```

### Email Notifications Not Sending

**Problem**: Booking confirmation emails not received

**Solution**:

1. **Check SMTP credentials** in `.env`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password  # Not your regular password!
   ```

2. **Enable "Less Secure Apps"** for Gmail or create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Generate app-specific password
   - Use that in SMTP_PASSWORD

3. **Use Ethereal (Dev Mode)**:
   ```env
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=generated-user@ethereal.email
   SMTP_PASSWORD=generated-password
   ```
   - Create account at https://ethereal.email
   - Check sent emails at https://ethereal.email/messages

---

## Next Steps

1. **Read Architecture Docs**: `docs/architecture/adr-001-microservices.md`
2. **Review API Contracts**: `specs/001-ground-booking/contracts/rest-api-gateway.yaml`
3. **Explore Codebase**: Start with `services/api-gateway/src/server.ts`
4. **Write Tests**: `services/booking-service/tests/unit/booking.service.test.ts`
5. **Contribute**: See `CONTRIBUTING.md` for guidelines

---

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services in development mode |
| `npm test` | Run all tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `docker-compose up` | Start all services with Docker |
| `docker-compose down` | Stop all services |
| `docker-compose logs <service>` | View service logs |
| `docker-compose restart <service>` | Restart a service |

---

## Getting Help

- **Documentation**: `docs/` directory
- **API Docs**: http://localhost:3000/api/docs (Swagger UI)
- **Issues**: https://github.com/Kinleyjigs/final_year3-sem1/issues
- **Team Chat**: [Slack/Discord link]

---

**Happy Coding! 🚀**
