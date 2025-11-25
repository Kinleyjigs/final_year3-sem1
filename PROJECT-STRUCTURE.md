# One Stop Book - Project Structure

Complete folder structure for the Campus Ground Booking Platform.

## Root Directory

```
one-stop-book/
├── frontend/                    # Next.js frontend application
├── services/                    # Microservices (gRPC)
├── packages/                    # Shared packages
├── infrastructure/              # Docker & deployment configs
├── specs/                       # Project specifications
├── package.json                 # Root package.json (workspace)
├── tsconfig.json                # Root TypeScript config
├── eslint.config.mjs            # ESLint configuration
├── start-services.sh            # Service startup script
└── README.md                    # Project documentation
```

## Frontend Structure (`frontend/`)

```
frontend/
├── app/
│   ├── (auth)/                  # Protected routes
│   │   ├── dashboard/page.tsx   # Booking dashboard
│   │   └── profile/page.tsx     # User profile
│   ├── (public)/                # Public routes  
│   │   ├── grounds/
│   │   │   ├── page.tsx         # Grounds listing (main)
│   │   │   └── [id]/page.tsx    # Ground details
│   │   ├── login/page.tsx       # Login
│   │   └── register/page.tsx    # Registration
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root → redirects to /grounds
│   └── globals.css
├── components/
│   ├── AvailabilityCalendar.tsx
│   ├── BookingCard.tsx
│   ├── BookingForm.tsx
│   ├── GroundCard.tsx
│   └── ProtectedRoute.tsx
├── lib/
│   ├── api-client.ts            # API communication
│   ├── auth-context.tsx         # Auth provider
│   └── hooks/
│       ├── useAvailability.ts
│       ├── useCancelBooking.ts
│       └── useCreateBooking.ts
├── public/                      # Static assets
├── package.json
├── tsconfig.json
└── STRUCTURE.md                 # Frontend structure docs
```

## Backend Services (`services/`)

```
services/
├── api-gateway/                 # Express REST API (port 3000)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── server.ts
│   │   └── swagger.ts
│   ├── tests/
│   └── package.json
│
├── auth-service/                # Authentication gRPC (port 50051)
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── grpc/auth.server.ts
│   │   ├── services/
│   │   ├── proto/
│   │   └── server.ts
│   └── tests/
│
├── grounds-service/             # Ground management gRPC (port 50052)
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── grpc/grounds.server.ts
│   │   ├── services/
│   │   ├── proto/
│   │   └── server.ts
│   └── tests/
│
├── booking-service/             # Booking gRPC (port 50053)
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── grpc/booking.server.ts
│   │   ├── services/
│   │   ├── proto/
│   │   └── server.ts
│   └── tests/
│
├── maintenance-service/         # Maintenance gRPC (port 50054)
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── grpc/maintenance.server.ts
│   │   ├── services/
│   │   └── server.ts
│   └── tests/
│
└── notification-service/        # Email notifications gRPC (port 50055)
    ├── prisma/schema.prisma
    ├── src/
    │   ├── grpc/notification.server.ts
    │   ├── services/
    │   ├── templates/           # Email templates
    │   ├── config/email.ts
    │   └── server.ts
    └── package.json
```

## Shared Packages (`packages/`)

```
packages/
├── common/                      # Shared utilities
│   ├── src/
│   │   ├── types.ts
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   ├── validation.ts
│   │   ├── config.ts
│   │   ├── health.ts
│   │   └── index.ts
│   └── package.json
│
└── grpc-clients/                # gRPC client factories
    ├── src/
    │   ├── factory.ts
    │   ├── auth-client.ts
    │   ├── grounds-client.ts
    │   ├── booking-client.ts
    │   ├── maintenance-client.ts
    │   ├── notification-client.ts
    │   └── index.ts
    └── package.json
```

## Infrastructure (`infrastructure/`)

```
infrastructure/
├── docker-compose.yml           # Production Docker setup
├── docker-compose.dev.yml       # Development Docker setup
├── postgres/
│   └── init.sql                 # Database initialization
└── scripts/
    ├── migrate-all.sh           # Run all Prisma migrations
    └── seed.ts                  # Seed database with sample data
```

## Specifications (`specs/`)

```
specs/
└── 001-ground-booking/
    ├── spec.md                  # Feature specification
    ├── plan.md                  # Technical implementation plan
    ├── data-model.md            # Database schema design
    ├── research.md              # Technical research & decisions
    ├── quickstart.md            # Getting started guide
    ├── tasks.md                 # Task breakdown (231 tasks)
    ├── checklists/              # QA checklists
    │   ├── ux.md
    │   ├── test.md
    │   └── security.md
    └── contracts/               # gRPC proto definitions
        ├── auth.proto
        ├── grounds.proto
        ├── booking.proto
        ├── maintenance.proto
        └── notification.proto
```

## Key Architectural Principles

### 1. Monorepo with npm Workspaces
- Single repository for all services
- Shared dependencies managed at root
- Independent service versioning

### 2. Route Organization (Frontend)
- **Route groups**: `(auth)` and `(public)` organize without URL impact
- **File-based routing**: Next.js 13+ App Router conventions
- **Colocated components**: Components near where they're used

### 3. Microservices Architecture (Backend)
- **gRPC for internal**: Fast, type-safe inter-service communication
- **REST for external**: API Gateway exposes HTTP endpoints
- **Service isolation**: Each service has own database schema

### 4. Shared Code Strategy
- **@one-stop-book/common**: Utilities, types, error handling
- **@one-stop-book/grpc-clients**: Type-safe gRPC clients
- **Proper boundaries**: No circular dependencies

### 5. Database Schema Separation
- Each service owns its Prisma schema
- Separate database schemas (auth, grounds, bookings, etc.)
- Single PostgreSQL instance with schema isolation

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context + Custom Hooks
- **HTTP Client**: Fetch API

### Backend
- **API Gateway**: Express.js
- **Services**: Node.js + gRPC
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Email**: Nodemailer + Handlebars

### DevOps
- **Containerization**: Docker & Docker Compose
- **Process Manager**: npm workspaces
- **Linting**: ESLint
- **Testing**: Jest + Supertest

## Port Allocation

| Service | Port | Protocol |
|---------|------|----------|
| Frontend | 3001 | HTTP |
| API Gateway | 3000 | HTTP |
| Auth Service | 50051 | gRPC |
| Grounds Service | 50052 | gRPC |
| Booking Service | 50053 | gRPC |
| Maintenance Service | 50054 | gRPC |
| Notification Service | 50055 | gRPC |
| PostgreSQL | 5432 | TCP |
| Redis | 6379 | TCP |

## File Naming Conventions

### Frontend
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **Components**: `PascalCase.tsx`
- **Hooks**: `useCamelCase.ts`
- **Utils**: `kebab-case.ts`

### Backend
- **Services**: `camelCase.service.ts`
- **Controllers**: `camelCase.controller.ts`
- **Middleware**: `kebab-case.ts`
- **gRPC Servers**: `service.server.ts`
- **Tests**: `*.test.ts`

## Getting Started

See the main README.md for:
- Installation instructions
- Running the project
- Running tests
- Deployment guide

---

**Last Updated**: 2025-11-24  
**Version**: Phase 6 Complete  
**Status**: ✅ Full-stack booking system operational
