# Research & Technology Decisions

**Feature**: Campus Ground Booking Platform  
**Date**: 2025-11-24  
**Phase**: 0 - Research & Investigation

## Overview

This document captures research findings and technology decisions for the One Stop Book platform. All decisions align with the project constitution principles and address the specific requirements from the feature specification.

---

## 1. Microservices Architecture

### Decision
Adopt a microservices architecture with 5 independent services: Auth Service, Grounds Service, Booking Service, Maintenance Service, and Notification Service.

### Rationale
- **Single Responsibility**: Each service owns a distinct domain (authentication, ground management, booking logic, maintenance scheduling, notifications)
- **Independent Scaling**: Booking Service can scale independently during peak booking periods
- **Replaceability**: Services can be rewritten or replaced without affecting others (Constitution Principle 1)
- **Fault Isolation**: Failure in Notification Service doesn't block booking creation
- **Team Autonomy**: Multiple developers can work on different services without conflicts

### Alternatives Considered
1. **Monolithic Next.js API Routes**: Simpler deployment but violates Constitution Principle 1 (services must be small, single-purpose, replaceable). Would tightly couple all business logic, making testing and scaling difficult.
2. **Serverless Functions (AWS Lambda/Vercel Functions)**: Good for auto-scaling but adds complexity in local development, debugging, and increases vendor lock-in. Doesn't align with Docker-based deployment preference.
3. **Modular Monolith**: Middle ground with separate modules in one codebase. Rejected because module boundaries tend to blur over time, and independent deployment is not possible.

### Implementation Notes
- Each service runs in its own Docker container
- Services communicate via gRPC (see Section 2)
- Health check endpoint (/health) required per Constitution Principle 3
- Shared PostgreSQL database with separate schemas per service (see Section 4)

---

## 2. gRPC for Internal Service Communication

### Decision
Use gRPC for all internal service-to-service communication. Expose REST API via API Gateway for external clients (React SPA, mobile apps in future).

### Rationale
- **Type Safety**: Protocol Buffers provide strongly-typed contracts, preventing integration errors
- **Performance**: Binary serialization is faster than JSON for internal calls
- **Clear Contracts**: .proto files serve as single source of truth for service interfaces (Constitution Principle 6)
- **Bi-directional Streaming**: Supports future real-time features (e.g., live availability updates)
- **Code Generation**: Auto-generate TypeScript clients and servers, reducing boilerplate

### Alternatives Considered
1. **REST for Internal Communication**: Easier to debug with tools like Postman, but slower than gRPC and lacks type safety. JSON serialization overhead is unnecessary for internal calls.
2. **GraphQL**: Excellent for frontend-to-backend but overkill for internal service communication. Adds complexity without clear benefits for backend-to-backend calls.
3. **Message Queue (RabbitMQ/Kafka)**: Suitable for asynchronous events but not for synchronous request-response patterns (e.g., "check booking conflicts"). Adds operational complexity for pilot phase.

### Implementation Notes
- API Gateway translates REST → gRPC for external clients
- Use `@grpc/grpc-js` library (official Node.js gRPC implementation)
- Shared package `@one-stop-book/grpc-clients` contains typed client instances
- Implement circuit breakers for fail-fast behavior (Constitution Principle 3)
- Propagate JWT claims via gRPC metadata for authorization (Constitution Principle 4)

---

## 3. JWT Authentication Strategy

### Decision
Use JSON Web Tokens (JWT) for stateless authentication. Auth Service issues tokens upon login, API Gateway validates tokens, and identity propagates to downstream services via gRPC metadata.

### Rationale
- **Stateless**: No server-side session storage required, simplifying horizontal scaling
- **Decentralized Validation**: Services can verify tokens independently using shared secret/public key
- **Identity Propagation**: JWT claims (user ID, role) can be passed through gRPC calls for downstream authorization (Constitution Principle 4)
- **Standard**: Widely adopted, well-documented, compatible with future OAuth2 integration

### Alternatives Considered
1. **Session-Based Authentication (cookies + Redis)**: Requires centralized session store (Redis), adding operational complexity. Doesn't align with stateless microservices philosophy.
2. **OAuth2 with Third-Party Provider (Google/Facebook)**: Good for social login but adds external dependency. Pilot phase focuses on email/password authentication; OAuth2 can be added later.
3. **API Keys**: Simple but lacks user identity and role information. Not suitable for multi-role system (Public Visitor, Registered User, College Admin).

### Implementation Notes
- Auth Service uses `jsonwebtoken` library for token issuance
- Token payload: `{ userId, email, role, college, iat, exp }`
- Token expiry: 24 hours (configurable via environment variable)
- API Gateway validates tokens using middleware (express-jwt or custom)
- Refresh token mechanism deferred to post-pilot (use short-lived access tokens initially)
- Tokens stored in HTTP-only cookies (frontend) or localStorage (with XSS precautions)

---

## 4. PostgreSQL Shared Database

### Decision
Use PostgreSQL 15+ as the shared relational database for all services. Each service manages its own schema via Prisma ORM.

### Rationale
- **ACID Compliance**: Ensures booking conflict prevention through transactions (Constitution Principle 3)
- **Relational Model**: Natural fit for entities (User, Ground, Booking, MaintenanceSchedule) with foreign key relationships
- **Row-Level Locking**: Prevents double-booking race conditions (FR-011)
- **Mature Ecosystem**: Excellent tooling (pgAdmin, Prisma Studio), performance tuning, and community support
- **Cost-Effective**: Open-source, no licensing fees

### Alternatives Considered
1. **MongoDB (NoSQL)**: Flexible schema but lacks ACID guarantees for multi-document transactions. Booking conflict prevention would require complex application-level locking. Not worth the trade-off.
2. **Database-per-Service (PostgreSQL instances)**: Purest microservices pattern but adds operational overhead (5 databases to manage). Overkill for pilot with 500-1000 users. Can migrate later if needed.
3. **MySQL**: Similar to PostgreSQL but weaker JSON support and less robust concurrency control. PostgreSQL's MVCC (Multi-Version Concurrency Control) is superior for high-concurrency booking scenarios.

### Implementation Notes
- Each service has its own Prisma schema in `services/[service-name]/prisma/schema.prisma`
- Shared database URL via environment variable: `DATABASE_URL=postgresql://user:pass@postgres:5432/one_stop_book`
- Schema isolation: `auth` schema (auth-service), `grounds` schema (grounds-service), `bookings` schema (booking-service), `maintenance` schema (maintenance-service)
- Prisma migrations run per service during deployment
- Use PostgreSQL advisory locks or SELECT FOR UPDATE for critical booking operations

---

## 5. Email Notifications (SMTP)

### Decision
Use SMTP-based email delivery via Nodemailer library. Support configurable SMTP providers (Gmail, SendGrid, AWS SES, Mailgun).

### Rationale
- **Standard Protocol**: SMTP is universally supported by all email providers
- **Flexibility**: Easy to switch providers by changing environment variables (no vendor lock-in)
- **Cost-Effective**: Free tier available with Gmail (for pilot), SendGrid (100 emails/day free)
- **Simple Integration**: Nodemailer is mature, well-documented, and handles connection pooling

### Alternatives Considered
1. **SendGrid SDK**: Excellent API and deliverability but vendor lock-in. Switching to another provider requires code changes.
2. **AWS SES SDK**: Cost-effective for production but requires AWS account setup. Adds complexity for local development (requires mocking or test credentials).
3. **In-App Notifications Only**: Deferred email sending to future. Rejected because FR-023 explicitly requires email notifications, and email is critical for booking confirmations.

### Implementation Notes
- Notification Service handles all email sending
- Use Handlebars or EJS for email template rendering
- Templates: booking_confirmation.html, booking_approved.html, booking_rejected.html, booking_canceled.html, maintenance_cancellation.html
- Queue emails in database if SMTP fails, retry with exponential backoff
- Log email delivery status (sent/failed) for debugging
- Sanitize logs to exclude email content with sensitive data (Constitution Principle 4)

---

## 6. Availability Calendar UI Library

### Decision
Use `react-big-calendar` or build a custom calendar component with TailwindCSS and date-fns library.

### Rationale
- **react-big-calendar**: Full-featured calendar with day/week/month views, drag-and-drop support, and extensive customization. Well-maintained (200k+ weekly downloads).
- **Custom Component**: Full control over UI/UX, smaller bundle size, but requires more development time.
- **Recommended Approach**: Start with `react-big-calendar` for rapid prototyping, replace with custom component if performance or customization becomes a bottleneck.

### Alternatives Considered
1. **FullCalendar (React wrapper)**: Feature-rich but has paid tiers for advanced features (resource scheduling). Licensing complexity for future commercial use.
2. **React Calendar (react-calendar)**: Simple month picker but lacks time slot selection and multi-day views. Not sufficient for booking use case.
3. **Material-UI DatePicker**: Good for date selection but not designed for availability visualization with booked/available/maintenance states.

### Implementation Notes
- Display availability in day/week view (1-hour and 2-hour slots)
- Color-coded slots: green (available), red (booked), orange (maintenance)
- Click on available slot → opens booking confirmation dialog
- Fetch availability via REST API: `GET /api/grounds/{id}/availability?start=2025-11-24&end=2025-11-30`
- Optimistic UI updates: immediately mark slot as "pending" after booking submission

---

## 7. Concurrency Control for Booking Conflicts

### Decision
Use PostgreSQL row-level locking with `SELECT FOR UPDATE` in Booking Service to prevent double-booking race conditions.

### Rationale
- **Database-Level Guarantee**: PostgreSQL ensures only one transaction can hold the lock, preventing race conditions
- **ACID Compliance**: Transactions are atomic; either booking succeeds or rolls back (no partial state)
- **Simpler Than Application-Level Locking**: No need for distributed locks (Redis, Zookeeper) for pilot phase
- **Proven Pattern**: Standard approach for inventory-style systems (booking slots are like inventory)

### Alternatives Considered
1. **Optimistic Locking (Version Field)**: Check version number before update, retry if conflict detected. Requires retry logic and can lead to poor UX if many users compete for same slot. Rejected because database locking is more deterministic.
2. **Distributed Lock (Redis)**: Requires additional infrastructure (Redis) and adds complexity. Overkill for pilot with 50 concurrent users and single PostgreSQL instance.
3. **Application-Level Mutex**: Doesn't work in multi-instance deployments (API Gateway runs multiple containers). Would require distributed locking anyway.

### Implementation Notes
- Booking creation flow:
  ```sql
  BEGIN TRANSACTION;
  
  -- Lock the time range to prevent concurrent bookings
  SELECT * FROM bookings
  WHERE ground_id = $1
    AND status IN ('Approved', 'Pending')
    AND (start_time, end_time) OVERLAPS ($2, $3)
  FOR UPDATE;
  
  -- If no overlapping bookings found, insert new booking
  INSERT INTO bookings (ground_id, user_id, start_time, end_time, status)
  VALUES ($1, $4, $2, $3, $5);
  
  COMMIT;
  ```
- Transaction timeout: 5 seconds (fail-fast if deadlock occurs)
- Return clear error message: "This time slot is no longer available. Please select another." (Constitution Principle 5)

---

## 8. Testing Strategy

### Decision
- **Unit Tests**: Jest with mocked gRPC clients and database (pg-mem or Jest mocks)
- **Integration Tests**: Supertest for API Gateway, Docker test containers for PostgreSQL
- **E2E Tests**: Playwright for critical user flows (booking creation, admin approval)
- **CI Pipeline**: GitHub Actions running lint → unit → integration → build on every PR

### Rationale
- **Comprehensive Coverage**: Unit tests verify business logic, integration tests verify service interactions, E2E tests verify user flows (Constitution Principle 2)
- **Fast Feedback**: Unit tests run in <10 seconds, integration tests in <1 minute
- **Isolated Tests**: Mocking external dependencies ensures deterministic tests (Constitution Principle 2)
- **CI Enforcement**: Automated testing prevents broken code from merging (Constitution Principle 2)

### Alternatives Considered
1. **Manual Testing Only**: Fast to start but doesn't scale. Regressions will occur as codebase grows. Violates Constitution Principle 2.
2. **Integration Tests Only (No Unit Tests)**: Slower test suite, harder to debug failures. Unit tests provide faster feedback for business logic.
3. **Cypress (E2E)**: Excellent for component testing but Playwright has better cross-browser support and is faster for full E2E scenarios.

### Implementation Notes
- Unit test coverage target: >80% for service business logic
- Integration test coverage: all API Gateway endpoints
- E2E test scenarios: booking creation (auto-approve), booking creation (manual approve), booking cancellation, admin approval, maintenance scheduling with cancellation
- Mock SMTP in tests (use ethereal.email for testing email templates)
- Run integration tests in Docker Compose with test database
- CI pipeline fails if any test suite fails

---

## 9. Rate Limiting & DDoS Prevention

### Decision
Implement rate limiting at API Gateway using Redis-backed middleware (express-rate-limit + rate-limit-redis).

### Rationale
- **Security**: Prevents abuse and DDoS attacks (Constitution Principle 4)
- **Fair Usage**: Ensures single user doesn't monopolize resources during peak times
- **Graceful Degradation**: Returns 429 Too Many Requests instead of crashing (Constitution Principle 3)

### Alternatives Considered
1. **In-Memory Rate Limiting (express-rate-limit only)**: Doesn't work in multi-instance deployments (each instance has separate memory). Rejected because we plan to run multiple API Gateway instances.
2. **No Rate Limiting**: Risky for public-facing API. Single malicious user could overload the system.
3. **Cloud WAF (Cloudflare, AWS WAF)**: Excellent but adds cost and complexity. Can be added later for production.

### Implementation Notes
- Rate limits:
  - Public endpoints (ground search, ground details): 100 requests/minute per IP
  - Authenticated endpoints (booking creation): 20 requests/minute per user
  - Admin endpoints: 50 requests/minute per user
- Use Redis for distributed rate limiting (shared across API Gateway instances)
- Return clear error: "Rate limit exceeded. Please try again in X seconds."

---

## 10. Development & Deployment Workflow

### Decision
- **Local Development**: Docker Compose with hot-reload for all services
- **CI/CD**: GitHub Actions for testing and building Docker images
- **Deployment**: Docker Compose for pilot, Kubernetes-ready for future scaling

### Rationale
- **Consistency**: Docker ensures "works on my machine" issues are eliminated
- **Simple Deployment**: Docker Compose is sufficient for pilot with single-server deployment
- **Future-Proof**: Service architecture is Kubernetes-ready (each service already containerized)
- **Fast Iteration**: Hot-reload (nodemon, Next.js dev server) speeds up development

### Alternatives Considered
1. **Kubernetes from Day 1**: Overkill for pilot with 50 concurrent users. Adds operational complexity (cluster management, YAML configuration). Can migrate later.
2. **Serverless (AWS Lambda/Vercel)**: Lock-in to cloud provider, harder to debug locally. Doesn't fit microservices architecture well.
3. **Manual Deployment (PM2, systemd)**: Error-prone, no rollback mechanism. Docker provides better isolation and reproducibility.

### Implementation Notes
- `docker-compose.yml` for local development (includes PostgreSQL, Redis, all services with volume mounts for hot-reload)
- `docker-compose.prod.yml` for production (optimized images, no volume mounts, environment-specific configs)
- GitHub Actions workflow:
  1. Lint (ESLint, Prettier)
  2. Unit tests (all services in parallel)
  3. Integration tests (Docker Compose test environment)
  4. Build Docker images
  5. Push to Docker Hub or GitHub Container Registry
- Deployment: SSH to server, pull images, run `docker-compose -f docker-compose.prod.yml up -d`

---

## Summary of Key Technologies

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Frontend** | Next.js 16 + React 19 + TailwindCSS | Server-side rendering, app directory routing, responsive design |
| **API Gateway** | Express.js + REST | Standard REST API for external clients |
| **Internal Communication** | gRPC + Protocol Buffers | Type-safe, performant service-to-service calls |
| **Authentication** | JWT (jsonwebtoken) | Stateless, scalable, supports RBAC |
| **Database** | PostgreSQL 15+ | ACID compliance, row-level locking, relational model |
| **ORM** | Prisma | Type-safe database access, migration management |
| **Email** | Nodemailer + SMTP | Flexible, no vendor lock-in |
| **Calendar UI** | react-big-calendar | Full-featured, customizable |
| **Concurrency Control** | PostgreSQL SELECT FOR UPDATE | Database-level locking, prevents race conditions |
| **Testing** | Jest + Supertest + Playwright | Unit, integration, E2E coverage |
| **Rate Limiting** | express-rate-limit + Redis | DDoS prevention, fair usage |
| **Containerization** | Docker + Docker Compose | Consistent environments, simple deployment |
| **CI/CD** | GitHub Actions | Automated testing and builds |

---

## Open Questions & Future Research

1. **Notification Retry Strategy**: How many retries for failed email delivery? Exponential backoff intervals?
   - **Recommendation**: 3 retries with 1min, 5min, 15min delays. Move to dead letter queue after 3 failures.

2. **Time Zone Handling**: Should bookings store UTC or local college time zones?
   - **Recommendation**: Store UTC in database (`timestamptz`), convert to local timezone in frontend. Add `timezone` field to Ground entity.

3. **Peak Hours Configuration**: Should peak hours be global or per-ground?
   - **Recommendation**: Per-ground configuration (stored in `grounds.peak_hours` JSONB column). Allows flexibility for different colleges.

4. **Image Upload for Grounds**: Where to store ground photos?
   - **Recommendation**: Use cloud storage (AWS S3, Cloudflare R2) for production. Local file system for pilot. Grounds Service handles upload, returns URL.

5. **Booking Reminder Notifications**: Should system send reminder emails before booking start time?
   - **Recommendation**: Deferred to post-pilot. Requires cron job or scheduled task. Can be added later as enhancement.

---

## Alignment with Constitution Principles

| Principle | How Research Decisions Support It |
|-----------|-----------------------------------|
| **Code Quality** | Microservices ensure single-purpose services. gRPC enforces typed contracts. Prisma provides type-safe database access. |
| **Testing** | Jest, Supertest, Playwright provide comprehensive testing. CI enforces tests before merge. |
| **Reliability & Performance** | PostgreSQL locking prevents conflicts. Health endpoints enable monitoring. Performance budgets defined. |
| **Security** | JWT at gateway, RBAC enforcement, input validation, log sanitization planned. |
| **User Experience** | <4 click booking flow, mobile-first design, clear error messages, state communication via UI badges. |
| **Documentation & Process** | OpenAPI spec, .proto files, ADRs, DoD checklist, CHANGELOG.md. |
| **Continuous Improvement** | Weekly retrospectives, lessons learned docs, improvement backlog. |

---

**Conclusion**: All technology choices are justified, align with constitution principles, and address specific requirements from the feature specification. No blocking unknowns remain. Ready to proceed to Phase 1: Data Model & API Contracts.
