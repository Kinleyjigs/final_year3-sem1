# Implementation Plan: Campus Ground Booking Platform

**Branch**: `001-ground-booking` | **Date**: 2025-11-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ground-booking/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

One Stop Book is a campus football ground booking platform enabling students to discover, view availability, and book football grounds across multiple colleges. College admins manage grounds, approve bookings during peak times, and schedule maintenance windows. The system implements a microservice architecture with gRPC for internal service communication, REST API Gateway for external clients, PostgreSQL for data persistence, and email-based notifications. The React SPA frontend delivers a mobile-friendly booking experience with real-time availability calendars, while backend services enforce role-based access control, prevent double-bookings through concurrency control, and ensure 99% uptime with comprehensive monitoring.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend: React 19.2.0, Backend: Node.js 20.x with Next.js 16.0.3)  
**Primary Dependencies**: 
- Frontend: Next.js 16.0.3, React 19.2.0, TailwindCSS 4.x, React Query (data fetching), Calendar UI library (react-big-calendar or similar)
- Backend Microservices: Node.js 20.x, @grpc/grpc-js (gRPC), Prisma ORM (PostgreSQL client), Express (API Gateway REST layer), JWT (jsonwebtoken)
- Testing: Jest (unit tests), Supertest (integration tests), Playwright (E2E tests)
- Infrastructure: Docker, Docker Compose (local dev), PostgreSQL 15+, Redis (session cache/rate limiting)

**Storage**: PostgreSQL 15+ (shared relational database for Users, Grounds, Bookings, MaintenanceSchedules, Notifications)

**Testing**: 
- Unit: Jest with mocked gRPC clients and database connections
- Integration: Supertest for API Gateway endpoints, in-memory PostgreSQL (pg-mem) or test containers
- E2E: Playwright for critical user flows (booking creation, admin approval)
- CI: GitHub Actions running all test suites before merge

**Target Platform**: Linux server (Docker containers), web browsers (Chrome/Safari/Firefox latest 2 versions), mobile web (responsive design for iOS/Android browsers)

**Project Type**: Web application (microservices backend + React SPA frontend)

**Performance Goals**: 
- Search/filter results: <2s response time (95th percentile)
- Availability calendar load: <1.5s (95th percentile)
- Booking creation: <1s (95th percentile)
- API Gateway p95 latency: <200ms
- Support 50 concurrent users (pilot target)
- Email notifications: delivered within 30 seconds

**Constraints**: 
- 99% uptime during pilot period (per Constitution Principle 3)
- Zero double-bookings (strict concurrency control required)
- Booking flow: <4 clicks from ground selection to confirmation (per Constitution Principle 5)
- Mobile-friendly: minimum screen width 375px
- RBAC enforcement: zero unauthorized access incidents (per Constitution Principle 4)
- Input validation: 100% prevention of injection attacks (per Constitution Principle 4)

**Scale/Scope**: 
- Campus pilot: 50 concurrent users, estimated 500-1000 total registered users
- 3-5 colleges initially, 10-20 football grounds
- ~100-200 bookings per week
- Indefinite data retention for historical analytics
- 5 microservices + API Gateway + React SPA = ~7 deployable components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Refer to `.specify/memory/constitution.md` for full principle definitions.

### Code Quality (Principle 1)
- [x] Coding style and naming conventions defined (TypeScript with ESLint, Prettier, camelCase for variables, PascalCase for components/classes)
- [x] Services are small, single-purpose, replaceable (5 microservices: Auth, Grounds, Booking, Maintenance, Notification - each with single responsibility)
- [x] Business logic isolated from controllers (API Gateway controllers call gRPC services; business logic in service layer)
- [x] DTOs defined for API boundaries (REST DTOs for API Gateway, gRPC message types for internal communication)
- [x] Services loosely coupled (dependency injection via gRPC clients, interface-based contracts)
- [x] Code reuse planned (shared libraries: @one-stop-book/common for types, @one-stop-book/grpc-clients for service clients)

### Testing (Principle 2)
- [x] Unit tests planned for booking, maintenance, availability logic (Jest tests for all service business logic with mocked dependencies)
- [x] Integration tests planned for multi-service flows (Supertest for API Gateway → gRPC service flows, test containers for database)
- [x] Mocking strategy defined for external services/DB (Jest mocks for gRPC clients, pg-mem or test containers for PostgreSQL, mock SMTP for email)
- [x] CI pipeline configured to run tests before merge (GitHub Actions workflow: lint → unit tests → integration tests → build)

### Reliability & Performance (Principle 3)
- [x] API Gateway responsiveness and timeout rules defined (5s timeout for gRPC calls, circuit breaker pattern for degraded services, rate limiting via Redis)
- [x] Health endpoints planned for each microservice (HTTP /health endpoint exposing service status and DB connectivity)
- [x] 99% availability target accounted for (health checks + Docker restart policies + monitoring alerts)
- [x] Fail-fast and graceful degradation strategy defined (circuit breakers for gRPC calls, fallback responses for non-critical failures, booking conflicts fail fast with clear errors)
- [x] Performance budgets defined (p95 latency: API Gateway <200ms, search <2s, availability calendar <1.5s, booking creation <1s)

### Security (Principle 4)
- [x] RBAC roles defined (user vs college admin) (3 roles: Public Visitor, Registered User, College Admin with distinct permissions enforced at API Gateway and service layers)
- [x] JWT authentication enforced at gateway (JWT tokens issued by Auth Service, validated at API Gateway middleware, expiry 24 hours)
- [x] Identity propagation planned for internal RPC (JWT claims propagated via gRPC metadata for downstream authorization)
- [x] Sensitive data sanitization in logs enforced (Winston logger configured to exclude password, token, email fields from logs)
- [x] Input validation strategy defined (Joi/Zod schemas at API Gateway for all requests, Prisma validation at database layer, gRPC type enforcement)

### User Experience (Principle 5)
- [x] Booking flow designed for < 4 clicks (Ground list → Ground details → Select time slot → Confirm booking = 4 clicks)
- [x] Mobile-friendly UI planned (TailwindCSS responsive design, mobile-first approach, minimum 375px screen width support)
- [x] All states clearly communicated (pending, approved, rejected, canceled, maintenance) (Status badges in UI, color coding, clear text labels, email notifications for all state transitions)
- [x] Error messages user-friendly and actionable ("This time slot is no longer available. Please select another." instead of "CONFLICT_ERROR_409")

### Documentation & Process (Principle 6)
- [x] API contracts documented (OpenAPI/Swagger or equivalent) (OpenAPI 3.0 spec for REST API Gateway, Protocol Buffers .proto files for gRPC services)
- [x] ADRs planned for major architectural decisions (ADRs for: microservice architecture choice, gRPC vs REST for internal communication, PostgreSQL shared database, JWT authentication strategy)
- [x] DoD includes documentation, tests, and demo (Definition of Done checklist: unit tests written, integration tests passing, API docs updated, README updated, working demo recorded)
- [x] Change-log tracking planned (CHANGELOG.md following Keep a Changelog format, updated per release)

### Continuous Improvement (Principle 7)
- [x] Sprint retrospectives scheduled every 7 days (Weekly retrospective meetings documented in .specify/retrospectives/)
- [x] Lessons learned documentation process defined (Retrospective action items captured in retrospectives/YYYY-MM-DD.md)
- [x] Improvement backlog maintained (GitHub Issues with "improvement" label, prioritized in sprint planning)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Microservices Backend
services/
├── api-gateway/
│   ├── src/
│   │   ├── controllers/        # REST endpoint handlers
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── routes/             # Express routes
│   │   ├── grpc-clients/       # gRPC client instances
│   │   ├── dto/                # Request/response DTOs
│   │   └── server.ts           # Express app entry
│   ├── tests/
│   │   ├── integration/        # API endpoint tests
│   │   └── unit/               # Controller unit tests
│   ├── Dockerfile
│   └── package.json
│
├── auth-service/
│   ├── src/
│   │   ├── services/           # JWT issuance, role validation
│   │   ├── grpc/               # gRPC server implementation
│   │   ├── models/             # User Prisma models
│   │   ├── proto/              # auth.proto definition
│   │   └── server.ts           # gRPC server entry
│   ├── tests/
│   │   ├── unit/               # Service logic tests
│   │   └── integration/        # Database integration tests
│   ├── prisma/
│   │   └── schema.prisma       # User schema
│   ├── Dockerfile
│   └── package.json
│
├── grounds-service/
│   ├── src/
│   │   ├── services/           # Ground CRUD, photo management
│   │   ├── grpc/               # gRPC server implementation
│   │   ├── models/             # Ground Prisma models
│   │   ├── proto/              # grounds.proto definition
│   │   └── server.ts
│   ├── tests/
│   ├── prisma/
│   │   └── schema.prisma       # Ground schema
│   ├── Dockerfile
│   └── package.json
│
├── booking-service/
│   ├── src/
│   │   ├── services/           # Booking CRUD, conflict detection
│   │   ├── grpc/               # gRPC server implementation
│   │   ├── models/             # Booking Prisma models
│   │   ├── proto/              # booking.proto definition
│   │   └── server.ts
│   ├── tests/
│   │   ├── unit/               # Conflict detection logic tests
│   │   └── integration/        # Concurrency control tests
│   ├── prisma/
│   │   └── schema.prisma       # Booking schema
│   ├── Dockerfile
│   └── package.json
│
├── maintenance-service/
│   ├── src/
│   │   ├── services/           # Maintenance CRUD, conflict detection
│   │   ├── grpc/               # gRPC server implementation
│   │   ├── models/             # MaintenanceSchedule Prisma models
│   │   ├── proto/              # maintenance.proto definition
│   │   └── server.ts
│   ├── tests/
│   ├── prisma/
│   │   └── schema.prisma       # MaintenanceSchedule schema
│   ├── Dockerfile
│   └── package.json
│
└── notification-service/
    ├── src/
    │   ├── services/           # Email sending, template rendering
    │   ├── grpc/               # gRPC server implementation
    │   ├── templates/          # Email HTML templates
    │   ├── proto/              # notification.proto definition
    │   └── server.ts
    ├── tests/
    │   └── unit/               # Template rendering tests
    ├── Dockerfile
    └── package.json

# Frontend React SPA (Next.js)
frontend/
├── app/                        # Next.js 16 app directory
│   ├── (public)/               # Public routes
│   │   ├── page.tsx            # Ground search/list
│   │   └── grounds/
│   │       └── [id]/
│   │           └── page.tsx    # Ground details + availability calendar
│   ├── (auth)/                 # Authenticated routes
│   │   ├── dashboard/
│   │   │   └── page.tsx        # User dashboard (my bookings)
│   │   ├── booking/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Booking flow
│   │   └── admin/
│   │       ├── grounds/
│   │       │   └── page.tsx    # Ground management
│   │       ├── bookings/
│   │       │   └── page.tsx    # Booking oversight
│   │       └── maintenance/
│   │           └── page.tsx    # Maintenance scheduling
│   ├── layout.tsx              # Root layout
│   └── globals.css
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── GroundCard.tsx          # Ground list item
│   ├── AvailabilityCalendar.tsx # Interactive calendar
│   ├── BookingForm.tsx         # Booking creation form
│   └── AdminNav.tsx            # Admin navigation
├── lib/
│   ├── api-client.ts           # REST API client
│   ├── auth.ts                 # JWT auth utilities
│   └── types.ts                # TypeScript interfaces
├── tests/
│   ├── e2e/                    # Playwright tests
│   └── unit/                   # Component tests
├── public/
│   └── images/
├── Dockerfile
└── package.json

# Shared Libraries
packages/
├── common/
│   ├── src/
│   │   ├── types/              # Shared TypeScript types
│   │   ├── constants/          # Shared constants
│   │   └── utils/              # Shared utilities
│   └── package.json
└── grpc-clients/
    ├── src/
    │   ├── auth-client.ts      # Auth service gRPC client
    │   ├── grounds-client.ts   # Grounds service gRPC client
    │   ├── booking-client.ts   # Booking service gRPC client
    │   ├── maintenance-client.ts
    │   └── notification-client.ts
    └── package.json

# Infrastructure
infrastructure/
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production deployment
├── postgres/
│   └── init.sql                # Database initialization
└── scripts/
    ├── seed.ts                 # Data seeding tool
    └── migrate-all.sh          # Run Prisma migrations for all services

# Documentation
docs/
├── architecture/
│   ├── adr-001-microservices.md
│   ├── adr-002-grpc-internal.md
│   ├── adr-003-shared-postgres.md
│   └── adr-004-jwt-auth.md
├── api/
│   ├── openapi.yaml            # REST API Gateway spec
│   └── grpc/
│       ├── auth.proto
│       ├── grounds.proto
│       ├── booking.proto
│       ├── maintenance.proto
│       └── notification.proto
└── deployment.md

# CI/CD
.github/
└── workflows/
    ├── ci.yml                  # Lint, test, build
    └── deploy.yml              # Deployment pipeline

# Root Configuration
├── .eslintrc.js                # ESLint config
├── .prettierrc                 # Prettier config
├── tsconfig.json               # Root TypeScript config
├── package.json                # Root package.json (workspaces)
├── CHANGELOG.md
└── README.md
```

**Structure Decision**: Microservices architecture with separate Next.js frontend. Each backend service is independently deployable with its own Prisma schema, gRPC server, and tests. The API Gateway aggregates gRPC services and exposes REST endpoints. Shared libraries (@one-stop-book/common, @one-stop-book/grpc-clients) eliminate code duplication. Frontend uses Next.js 16 app directory for routing and React 19 for UI. Infrastructure directory contains Docker Compose configurations and database seeding scripts. This structure supports independent service development, clear separation of concerns, and scalable deployment via Docker containers.

## Complexity Tracking

> **No constitution violations detected. All principles are satisfied by the planned architecture.**

The microservice architecture adds structural complexity but is justified by:
- Clear separation of concerns (each service has single responsibility per Constitution Principle 1)
- Independent scalability and replaceability of services
- Alignment with constitution's emphasis on loose coupling and modularity
- Support for 99% availability target through independent service health monitoring

All constitution checks passed without requiring exceptions or simplified alternatives.
