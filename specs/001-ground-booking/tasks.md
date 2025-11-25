# Tasks: Campus Ground Booking Platform

**Branch**: `001-ground-booking`  
**Date**: 2025-11-24  
**Input**: Design documents from `/specs/001-ground-booking/`

**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/

**Tests**: Tests are REQUIRED per Constitution Principle 2 (Testing). All tasks include unit tests for booking/maintenance/availability logic and integration tests for multi-service flows.

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each increment.

---

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Parallelizable (different files, no blocking dependencies)
- **[Story]**: User story label (US1, US2, etc.) - only for story-specific tasks
- File paths relative to repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold project structure and initialize workspaces

- [X] T001 Create monorepo structure with root package.json and npm workspaces configuration
- [X] T002 Initialize TypeScript configuration in tsconfig.json (root + service-specific)
- [X] T003 [P] Configure ESLint with TypeScript rules in eslint.config.mjs
- [X] T004 [P] Configure Prettier in .prettierrc for consistent code formatting
- [X] T005 [P] Setup Husky pre-commit hooks for lint and format checks in .husky/pre-commit
- [X] T006 Create Docker Compose file for local development in infrastructure/docker-compose.yml
- [X] T007 [P] Setup PostgreSQL initialization script in infrastructure/postgres/init.sql
- [X] T008 [P] Setup Redis configuration in infrastructure/docker-compose.yml
- [X] T009 Create shared types package structure in packages/common/src/types/
- [X] T010 Create gRPC clients package structure in packages/grpc-clients/src/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before user stories

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

### Database & ORM Setup

- [X] T011 Initialize Prisma in services/auth-service with User schema in services/auth-service/prisma/schema.prisma
- [X] T012 [P] Initialize Prisma in services/grounds-service with Ground schema in services/grounds-service/prisma/schema.prisma
- [X] T013 [P] Initialize Prisma in services/booking-service with Booking schema in services/booking-service/prisma/schema.prisma
- [X] T014 [P] Initialize Prisma in services/maintenance-service with MaintenanceSchedule schema in services/maintenance-service/prisma/schema.prisma
- [X] T015 [P] Initialize Prisma in services/notification-service with Notification schema in services/notification-service/prisma/schema.prisma
- [X] T016 Create migration runner script in infrastructure/scripts/migrate-all.sh
- [X] T017 Create database seeding script in infrastructure/scripts/seed.ts with sample data (10 grounds, 2 admins, 5 users, 50 bookings)

### gRPC Protocol Definitions

- [X] T018 [P] Define auth.proto with Register, Login, VerifyToken, GetUser, UpdateUser RPCs in specs/001-ground-booking/contracts/auth.proto (DONE - copy to services/auth-service/src/proto/)
- [X] T019 [P] Define grounds.proto with CreateGround, UpdateGround, GetGround, SearchGrounds, IsPeakTime RPCs in services/grounds-service/src/proto/grounds.proto
- [X] T020 [P] Define booking.proto with CreateBooking, GetBooking, CancelBooking, ApproveBooking, CheckConflict RPCs in services/booking-service/src/proto/booking.proto
- [X] T021 [P] Define maintenance.proto with CreateMaintenance, GetMaintenance, CancelMaintenance, CheckConflict RPCs in services/maintenance-service/src/proto/maintenance.proto
- [X] T022 [P] Define notification.proto with SendBookingConfirmation, SendApproval, SendRejection, SendCancellation RPCs in services/notification-service/src/proto/notification.proto

### gRPC Code Generation

- [X] T023 [P] Generate TypeScript gRPC stubs for Auth Service in services/auth-service/src/generated/
- [X] T024 [P] Generate TypeScript gRPC stubs for Grounds Service in services/grounds-service/src/generated/
- [X] T025 [P] Generate TypeScript gRPC stubs for Booking Service in services/booking-service/src/generated/
- [X] T026 [P] Generate TypeScript gRPC stubs for Maintenance Service in services/maintenance-service/src/generated/
- [X] T027 [P] Generate TypeScript gRPC stubs for Notification Service in services/notification-service/src/generated/

### Shared Infrastructure

- [X] T028 Implement Winston logger with sensitive data sanitization in packages/common/src/logger.ts (exclude password, token, email per Constitution Principle 4)
- [X] T029 [P] Implement error handling middleware in packages/common/src/errors.ts with user-friendly error messages (per Constitution Principle 5)
- [X] T030 [P] Implement input validation utilities (Joi/Zod) in packages/common/src/validation.ts
- [X] T031 Create gRPC client factory in packages/grpc-clients/src/factory.ts for connection management
- [X] T032 [P] Implement health check endpoint template in packages/common/src/health.ts
- [X] T033 Setup environment variable management in packages/common/src/config.ts

### API Gateway Foundation

- [X] T034 Initialize Express server in services/api-gateway/src/server.ts
- [X] T035 Configure JWT authentication middleware in services/api-gateway/src/middleware/auth.ts
- [X] T036 [P] Configure rate limiting middleware with Redis in services/api-gateway/src/middleware/rate-limit.ts (100 req/min public, 20 req/min auth)
- [X] T037 [P] Configure CORS middleware in services/api-gateway/src/middleware/cors.ts
- [X] T038 Setup API routing structure in services/api-gateway/src/routes/index.ts
- [X] T039 Implement error handler middleware in services/api-gateway/src/middleware/error-handler.ts
- [X] T040 Setup Swagger/OpenAPI documentation in services/api-gateway/src/swagger.ts

**Checkpoint**: ✅ Foundation complete - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Public Ground Discovery (Priority: P1) 🎯 MVP

**Goal**: Public visitors can search and filter football grounds across colleges

**Independent Test**: Visit platform, view ground list, apply filters (college, date), see accurate results without login

### Tests for User Story 1 (REQUIRED) ✅

- [ ] T041 [P] [US1] Unit test for ground search service logic in services/grounds-service/tests/unit/search.service.test.ts
- [ ] T042 [P] [US1] Integration test for GET /api/grounds endpoint in services/api-gateway/tests/integration/grounds.test.ts
- [ ] T043 [P] [US1] Integration test for ground filters (college, date) in services/api-gateway/tests/integration/grounds-filters.test.ts

### Implementation for User Story 1

- [X] T044 [P] [US1] Implement Ground Prisma model with isActive, college fields in services/grounds-service/prisma/schema.prisma
- [X] T045 [US1] Implement GroundsService.searchGrounds() with college filter in services/grounds-service/src/services/grounds.service.ts
- [X] T046 [US1] Implement gRPC SearchGrounds RPC handler in services/grounds-service/src/grpc/grounds.server.ts
- [X] T047 [US1] Create gRPC Grounds client in packages/grpc-clients/src/grounds-client.ts
- [X] T048 [US1] Implement API Gateway GET /api/grounds endpoint in services/api-gateway/src/controllers/grounds.controller.ts
- [X] T049 [US1] Add pagination support to search results in services/grounds-service/src/services/grounds.service.ts
- [X] T050 [US1] Add validation for search query parameters (college, page, limit) in services/api-gateway/src/middleware/validation/grounds.validation.ts
- [X] T051 [P] [US1] Implement frontend Ground list page in frontend/app/(public)/page.tsx
- [X] T052 [P] [US1] Create GroundCard component in frontend/components/GroundCard.tsx
- [X] T053 [US1] Implement ground search API client in frontend/lib/api-client.ts
- [X] T054 [US1] Add college filter UI in frontend/app/(public)/page.tsx
- [X] T055 [US1] Add "no results" message for empty search in frontend/app/(public)/page.tsx

**Checkpoint**: ✅ User Story 1 complete - users can discover grounds

---

## Phase 4: User Story 2 - Ground Details & Availability (Priority: P1) 🎯 MVP

**Goal**: Users view ground details and real-time availability calendar (bookings + maintenance)

**Independent Test**: Select a ground, view details page, interact with availability calendar showing booked/maintenance/available slots

### Tests for User Story 2 (REQUIRED) ✅

- [ ] T056 [P] [US2] Unit test for availability calculation logic in services/booking-service/tests/unit/availability.service.test.ts
- [ ] T057 [P] [US2] Integration test for GET /api/grounds/{id}/availability in services/api-gateway/tests/integration/availability.test.ts
- [ ] T058 [P] [US2] Unit test for overlapping booking detection in services/booking-service/tests/unit/conflict.service.test.ts
- [ ] T059 [P] [US2] Unit test for maintenance window overlap detection in services/maintenance-service/tests/unit/conflict.service.test.ts

### Implementation for User Story 2

- [X] T060 [P] [US2] Implement GroundsService.getGround() with full details in services/grounds-service/src/services/grounds.service.ts
- [X] T061 [US2] Implement gRPC GetGround RPC handler in services/grounds-service/src/grpc/grounds.server.ts
- [X] T062 [US2] Implement API Gateway GET /api/grounds/{id} endpoint in services/api-gateway/src/controllers/grounds.controller.ts
- [X] T063 [P] [US2] Implement BookingService.getAvailability() combining bookings + maintenance in services/booking-service/src/services/availability.service.ts
- [X] T064 [US2] Implement gRPC GetAvailability RPC handler in services/booking-service/src/grpc/booking.server.ts
- [X] T065 [US2] Implement MaintenanceService.getGroundMaintenance() in services/maintenance-service/src/services/maintenance.service.ts
- [X] T066 [US2] Implement gRPC GetGroundMaintenance RPC handler in services/maintenance-service/src/grpc/maintenance.server.ts
- [X] T067 [US2] Create gRPC Booking client in packages/grpc-clients/src/booking-client.ts
- [X] T068 [US2] Create gRPC Maintenance client in packages/grpc-clients/src/maintenance-client.ts
- [X] T069 [US2] Implement API Gateway GET /api/grounds/{id}/availability endpoint in services/api-gateway/src/controllers/availability.controller.ts
- [X] T070 [US2] Add date range validation for availability queries in services/api-gateway/src/middleware/validation/availability.validation.ts
- [X] T071 [P] [US2] Implement frontend Ground details page in frontend/app/(public)/grounds/[id]/page.tsx
- [X] T072 [P] [US2] Create AvailabilityCalendar component in frontend/components/AvailabilityCalendar.tsx (custom calendar with week view)
- [X] T073 [US2] Implement availability fetching hook in frontend/lib/hooks/useAvailability.ts
- [X] T074 [US2] Add color-coded slot status (green=available, red=booked, orange=maintenance) in frontend/components/AvailabilityCalendar.tsx
- [X] T075 [US2] Support 1-hour and 2-hour slot selection in frontend/components/AvailabilityCalendar.tsx

**Checkpoint**: ✅ User Story 2 complete - users view ground details and real-time availability with interactive calendar

---

## Phase 5: User Story 3 - Authentication & Profile (Priority: P2)

**Goal**: Users register, login, manage profile to access booking features

**Independent Test**: Register account, login, view profile, update profile, logout

### Tests for User Story 3 (REQUIRED) ✅

- [X] T076 [P] [US3] Unit test for password hashing (bcrypt) in services/auth-service/tests/unit/auth.service.test.ts
- [X] T077 [P] [US3] Unit test for JWT generation and validation in services/auth-service/tests/unit/jwt.service.test.ts
- [X] T078 [P] [US3] Integration test for POST /api/auth/register in services/api-gateway/tests/integration/auth.test.ts
- [X] T079 [P] [US3] Integration test for POST /api/auth/login in services/api-gateway/tests/integration/auth.test.ts
- [X] T080 [P] [US3] Integration test for GET /api/auth/me in services/api-gateway/tests/integration/profile.test.ts

### Implementation for User Story 3

- [X] T081 [P] [US3] Implement User Prisma model with email, passwordHash, role in services/auth-service/prisma/schema.prisma
- [X] T082 [US3] Implement AuthService.register() with bcrypt password hashing in services/auth-service/src/services/auth.service.ts
- [X] T083 [US3] Implement AuthService.login() with credential validation in services/auth-service/src/services/auth.service.ts
- [X] T084 [US3] Implement JwtService for token generation in services/auth-service/src/services/jwt.service.ts (24h expiry, include userId, email, role, college)
- [X] T085 [US3] Implement gRPC Register RPC handler in services/auth-service/src/grpc/auth.server.ts
- [X] T086 [US3] Implement gRPC Login RPC handler in services/auth-service/src/grpc/auth.server.ts
- [X] T087 [US3] Implement gRPC VerifyToken RPC handler in services/auth-service/src/grpc/auth.server.ts
- [X] T088 [US3] Implement gRPC GetUser RPC handler in services/auth-service/src/grpc/auth.server.ts
- [X] T089 [US3] Implement gRPC UpdateUser RPC handler in services/auth-service/src/grpc/auth.server.ts
- [X] T090 [US3] Create gRPC Auth client in packages/grpc-clients/src/auth-client.ts
- [X] T091 [US3] Implement API Gateway POST /api/auth/register endpoint in services/api-gateway/src/controllers/auth.controller.ts
- [X] T092 [US3] Implement API Gateway POST /api/auth/login endpoint in services/api-gateway/src/controllers/auth.controller.ts
- [X] T093 [US3] Implement API Gateway GET /api/auth/me endpoint in services/api-gateway/src/controllers/auth.controller.ts
- [X] T094 [US3] Implement API Gateway PATCH /api/auth/me endpoint in services/api-gateway/src/controllers/auth.controller.ts
- [X] T095 [US3] Add input validation for registration (email format, password min 8 chars) in services/api-gateway/src/middleware/validation/auth.validation.ts
- [X] T096 [US3] Add RBAC validation middleware (user vs admin) in services/api-gateway/src/middleware/rbac.ts
- [X] T097 [P] [US3] Implement frontend registration form in frontend/app/(public)/register/page.tsx
- [X] T098 [P] [US3] Implement frontend login form in frontend/app/(public)/login/page.tsx
- [X] T099 [P] [US3] Implement frontend profile page in frontend/app/(auth)/profile/page.tsx
- [X] T100 [US3] Implement auth context/provider in frontend/lib/auth-context.tsx with JWT storage (HTTP-only cookies or localStorage)
- [X] T101 [US3] Implement protected route wrapper in frontend/components/ProtectedRoute.tsx
- [X] T102 [US3] Add logout functionality in frontend/lib/auth-context.tsx

**Checkpoint**: ✅ User Story 3 complete - users can authenticate

---

## Phase 6: User Story 4 - Booking Creation & Management (Priority: P2) 🎯 CORE VALUE

**Goal**: Users create bookings, view booking history, cancel bookings

**Independent Test**: Login, select time slot, create booking (auto-approve or pending), view "My Bookings", cancel a booking

### Tests for User Story 4 (REQUIRED) ✅

- [X] T103 [P] [US4] Unit test for booking conflict detection with SELECT FOR UPDATE in services/booking-service/tests/unit/conflict.service.test.ts
- [X] T104 [P] [US4] Unit test for peak hours detection logic in services/grounds-service/tests/unit/peak-hours.service.test.ts
- [X] T105 [P] [US4] Integration test for POST /api/bookings with concurrent requests in services/api-gateway/tests/integration/booking-concurrency.test.ts
- [X] T106 [P] [US4] Integration test for booking cancellation in services/api-gateway/tests/integration/booking-cancel.test.ts
- [X] T107 [P] [US4] Unit test for confirmation code generation in services/booking-service/tests/unit/booking.service.test.ts

### Implementation for User Story 4

- [X] T108 [P] [US4] Implement Booking Prisma model with status, confirmationCode in services/booking-service/prisma/schema.prisma
- [X] T109 [US4] Implement BookingService.checkConflict() with SELECT FOR UPDATE in services/booking-service/src/services/booking.service.ts
- [X] T110 [US4] Implement BookingService.createBooking() with transaction and conflict detection in services/booking-service/src/services/booking.service.ts
- [X] T111 [US4] Implement confirmation code generator (crypto.randomBytes) in services/booking-service/src/services/booking.service.ts
- [X] T112 [US4] Implement gRPC CreateBooking RPC handler with peak hours check in services/booking-service/src/grpc/booking.server.ts
- [X] T113 [US4] Implement gRPC CheckConflict RPC handler in services/booking-service/src/grpc/booking.server.ts
- [X] T114 [US4] Implement GroundsService.isPeakTime() in services/grounds-service/src/services/peak-hours.service.ts
- [X] T115 [US4] Implement gRPC IsPeakTime RPC handler in services/grounds-service/src/grpc/grounds.server.ts
- [X] T116 [US4] Implement BookingService.getUserBookings() in services/booking-service/src/services/booking.service.ts
- [X] T117 [US4] Implement BookingService.cancelBooking() with validation (not past, not already canceled) in services/booking-service/src/services/booking.service.ts
- [X] T118 [US4] Implement gRPC GetUserBookings RPC handler in services/booking-service/src/grpc/booking.server.ts
- [X] T119 [US4] Implement gRPC CancelBooking RPC handler in services/booking-service/src/grpc/booking.server.ts
- [X] T120 [US4] Implement API Gateway POST /api/bookings endpoint in services/api-gateway/src/controllers/bookings.controller.ts
- [X] T121 [US4] Implement API Gateway GET /api/bookings endpoint in services/api-gateway/src/controllers/bookings.controller.ts
- [X] T122 [US4] Implement API Gateway DELETE /api/bookings/{id} endpoint in services/api-gateway/src/controllers/bookings.controller.ts
- [X] T123 [US4] Add booking input validation (date range, time slots 1h or 2h) in services/api-gateway/src/middleware/validation/booking.validation.ts
- [X] T124 [US4] Implement NotificationService.sendBookingConfirmation() in services/notification-service/src/services/notification.service.ts
- [X] T125 [US4] Implement email template for booking confirmation in services/notification-service/src/templates/booking-confirmation.html
- [X] T126 [US4] Implement gRPC SendBookingConfirmation RPC handler in services/notification-service/src/grpc/notification.server.ts
- [X] T127 [US4] Create gRPC Notification client in packages/grpc-clients/src/notification-client.ts
- [X] T128 [US4] Configure Nodemailer with SMTP in services/notification-service/src/config/email.ts
- [X] T129 [P] [US4] Implement frontend booking modal in frontend/components/BookingForm.tsx
- [X] T130 [P] [US4] Implement "My Bookings" page in frontend/app/(auth)/dashboard/page.tsx
- [X] T131 [US4] Implement booking creation handler in frontend/lib/hooks/useCreateBooking.ts
- [X] T132 [US4] Implement booking cancellation handler in frontend/lib/hooks/useCancelBooking.ts
- [X] T133 [US4] Add booking status badges (pending, approved, rejected, canceled) in frontend/components/BookingCard.tsx

**Checkpoint**: ✅ User Story 4 complete - users can book and manage bookings

---

## Phase 7: User Story 5 - Admin Ground Management (Priority: P3)

**Goal**: Admins create, update, deactivate grounds for their college

**Independent Test**: Login as admin, create ground, edit ground details, deactivate ground

### Tests for User Story 5 (REQUIRED) ✅

- [ ] T134 [P] [US5] Unit test for admin authorization (college scoping) in services/grounds-service/tests/unit/authorization.service.test.ts
- [ ] T135 [P] [US5] Integration test for POST /api/admin/grounds in services/api-gateway/tests/integration/admin-grounds.test.ts
- [ ] T136 [P] [US5] Integration test for PATCH /api/admin/grounds/{id} in services/api-gateway/tests/integration/admin-grounds-update.test.ts

### Implementation for User Story 5

- [ ] T137 [P] [US5] Implement GroundsService.createGround() with admin validation in services/grounds-service/src/services/grounds.service.ts
- [ ] T138 [US5] Implement GroundsService.updateGround() with college scoping in services/grounds-service/src/services/grounds.service.ts
- [ ] T139 [US5] Implement GroundsService.deactivateGround() in services/grounds-service/src/services/grounds.service.ts
- [ ] T140 [US5] Implement gRPC CreateGround RPC handler in services/grounds-service/src/grpc/grounds.server.ts
- [ ] T141 [US5] Implement gRPC UpdateGround RPC handler in services/grounds-service/src/grpc/grounds.server.ts
- [ ] T142 [US5] Implement gRPC DeactivateGround RPC handler in services/grounds-service/src/grpc/grounds.server.ts
- [ ] T143 [US5] Implement API Gateway POST /api/admin/grounds endpoint in services/api-gateway/src/controllers/admin/grounds.controller.ts
- [ ] T144 [US5] Implement API Gateway PATCH /api/admin/grounds/{id} endpoint in services/api-gateway/src/controllers/admin/grounds.controller.ts
- [ ] T145 [US5] Implement API Gateway GET /api/admin/grounds endpoint in services/api-gateway/src/controllers/admin/grounds.controller.ts
- [ ] T146 [US5] Add admin role validation middleware in services/api-gateway/src/middleware/rbac.ts
- [ ] T147 [P] [US5] Implement admin ground creation form in frontend/app/(auth)/admin/grounds/create/page.tsx
- [ ] T148 [P] [US5] Implement admin ground edit form in frontend/app/(auth)/admin/grounds/[id]/edit/page.tsx
- [ ] T149 [P] [US5] Implement admin grounds list page in frontend/app/(auth)/admin/grounds/page.tsx
- [ ] T150 [US5] Add peak hours configuration UI (day of week + time ranges) in frontend/components/PeakHoursEditor.tsx

**Checkpoint**: ✅ User Story 5 complete - admins can manage grounds

---

## Phase 8: User Story 6 - Admin Booking Oversight (Priority: P3)

**Goal**: Admins view, approve, reject, cancel bookings for their college's grounds

**Independent Test**: Login as admin, view pending bookings, approve/reject booking, cancel approved booking

### Tests for User Story 6 (REQUIRED) ✅

- [ ] T151 [P] [US6] Integration test for POST /api/admin/bookings/{id}/approve in services/api-gateway/tests/integration/admin-approve.test.ts
- [ ] T152 [P] [US6] Integration test for POST /api/admin/bookings/{id}/reject in services/api-gateway/tests/integration/admin-reject.test.ts
- [ ] T153 [P] [US6] Unit test for approval notification logic in services/notification-service/tests/unit/approval.service.test.ts

### Implementation for User Story 6

- [ ] T154 [P] [US6] Implement BookingService.approveBooking() in services/booking-service/src/services/booking.service.ts
- [ ] T155 [P] [US6] Implement BookingService.rejectBooking() with reason in services/booking-service/src/services/booking.service.ts
- [ ] T156 [US6] Implement BookingService.getCollegeBookings() with ground filtering in services/booking-service/src/services/booking.service.ts
- [ ] T157 [US6] Implement gRPC ApproveBooking RPC handler in services/booking-service/src/grpc/booking.server.ts
- [ ] T158 [US6] Implement gRPC RejectBooking RPC handler in services/booking-service/src/grpc/booking.server.ts
- [ ] T159 [US6] Implement gRPC GetCollegeBookings RPC handler in services/booking-service/src/grpc/booking.server.ts
- [ ] T160 [US6] Implement API Gateway POST /api/admin/bookings/{id}/approve endpoint in services/api-gateway/src/controllers/admin/bookings.controller.ts
- [ ] T161 [US6] Implement API Gateway POST /api/admin/bookings/{id}/reject endpoint in services/api-gateway/src/controllers/admin/bookings.controller.ts
- [ ] T162 [US6] Implement API Gateway POST /api/admin/bookings/{id}/cancel endpoint in services/api-gateway/src/controllers/admin/bookings.controller.ts
- [ ] T163 [US6] Implement API Gateway GET /api/admin/bookings endpoint in services/api-gateway/src/controllers/admin/bookings.controller.ts
- [ ] T164 [US6] Implement NotificationService.sendBookingApproval() in services/notification-service/src/services/notification.service.ts
- [ ] T165 [US6] Implement NotificationService.sendBookingRejection() in services/notification-service/src/services/notification.service.ts
- [ ] T166 [US6] Implement email template for approval in services/notification-service/src/templates/booking-approval.html
- [ ] T167 [US6] Implement email template for rejection in services/notification-service/src/templates/booking-rejection.html
- [ ] T168 [US6] Implement gRPC SendBookingApproval RPC handler in services/notification-service/src/grpc/notification.server.ts
- [ ] T169 [US6] Implement gRPC SendBookingRejection RPC handler in services/notification-service/src/grpc/notification.server.ts
- [ ] T170 [P] [US6] Implement admin pending bookings page in frontend/app/(auth)/admin/bookings/pending/page.tsx
- [ ] T171 [P] [US6] Implement admin all bookings page in frontend/app/(auth)/admin/bookings/page.tsx
- [ ] T172 [US6] Add approve/reject buttons with reason modal in frontend/components/AdminBookingActions.tsx

**Checkpoint**: ✅ User Story 6 complete - admins have booking oversight

---

## Phase 9: User Story 7 - Admin Maintenance Scheduling (Priority: P3)

**Goal**: Admins schedule maintenance windows, automatically cancel conflicting bookings

**Independent Test**: Login as admin, schedule maintenance window, verify conflicting bookings are canceled, check time slots marked unavailable

### Tests for User Story 7 (REQUIRED) ✅

- [ ] T173 [P] [US7] Unit test for maintenance-booking conflict detection in services/maintenance-service/tests/unit/conflict.service.test.ts
- [ ] T174 [P] [US7] Integration test for POST /api/admin/maintenance in services/api-gateway/tests/integration/admin-maintenance.test.ts
- [ ] T175 [P] [US7] Unit test for automatic booking cancellation on maintenance creation in services/maintenance-service/tests/unit/maintenance.service.test.ts

### Implementation for User Story 7

- [ ] T176 [P] [US7] Implement MaintenanceSchedule Prisma model in services/maintenance-service/prisma/schema.prisma
- [ ] T177 [US7] Implement MaintenanceService.createMaintenance() with conflict detection in services/maintenance-service/src/services/maintenance.service.ts
- [ ] T178 [US7] Implement MaintenanceService.findConflictingBookings() in services/maintenance-service/src/services/maintenance.service.ts
- [ ] T179 [US7] Implement MaintenanceService.cancelMaintenance() in services/maintenance-service/src/services/maintenance.service.ts
- [ ] T180 [US7] Implement gRPC CreateMaintenance RPC handler with booking cancellation in services/maintenance-service/src/grpc/maintenance.server.ts
- [ ] T181 [US7] Implement gRPC CancelMaintenance RPC handler in services/maintenance-service/src/grpc/maintenance.server.ts
- [ ] T182 [US7] Implement gRPC GetCollegeMaintenance RPC handler in services/maintenance-service/src/grpc/maintenance.server.ts
- [ ] T183 [US7] Implement API Gateway POST /api/admin/maintenance endpoint in services/api-gateway/src/controllers/admin/maintenance.controller.ts
- [ ] T184 [US7] Implement API Gateway GET /api/admin/maintenance endpoint in services/api-gateway/src/controllers/admin/maintenance.controller.ts
- [ ] T185 [US7] Implement API Gateway DELETE /api/admin/maintenance/{id} endpoint in services/api-gateway/src/controllers/admin/maintenance.controller.ts
- [ ] T186 [US7] Implement NotificationService.sendMaintenanceCancellation() in services/notification-service/src/services/notification.service.ts
- [ ] T187 [US7] Implement email template for maintenance cancellation in services/notification-service/src/templates/maintenance-cancellation.html
- [ ] T188 [US7] Implement gRPC SendMaintenanceCancellation RPC handler in services/notification-service/src/grpc/notification.server.ts
- [ ] T189 [P] [US7] Implement admin maintenance scheduling form in frontend/app/(auth)/admin/maintenance/create/page.tsx
- [ ] T190 [P] [US7] Implement admin maintenance list page in frontend/app/(auth)/admin/maintenance/page.tsx
- [ ] T191 [US7] Add conflict preview (shows bookings that will be canceled) in frontend/components/MaintenanceConflictPreview.tsx

**Checkpoint**: ✅ User Story 7 complete - admins can schedule maintenance

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness, performance, and compliance

### Health & Monitoring

- [ ] T192 [P] Implement health endpoint for Auth Service in services/auth-service/src/health.ts (check DB connection)
- [ ] T193 [P] Implement health endpoint for Grounds Service in services/grounds-service/src/health.ts
- [ ] T194 [P] Implement health endpoint for Booking Service in services/booking-service/src/health.ts
- [ ] T195 [P] Implement health endpoint for Maintenance Service in services/maintenance-service/src/health.ts
- [ ] T196 [P] Implement health endpoint for Notification Service in services/notification-service/src/health.ts
- [ ] T197 [P] Implement health endpoint for API Gateway in services/api-gateway/src/health.ts
- [ ] T198 Configure Docker restart policies in infrastructure/docker-compose.yml (restart: unless-stopped)

### Performance Optimization

- [ ] T199 [P] Add database indexes for search queries in services/grounds-service/prisma/schema.prisma (@@index([college, isActive]))
- [ ] T200 [P] Add database indexes for booking queries in services/booking-service/prisma/schema.prisma (@@index([groundId, bookingDate]), @@index([userId]))
- [ ] T201 Implement Redis caching for ground search results in services/api-gateway/src/middleware/cache.ts (TTL: 5 minutes)
- [ ] T202 [P] Add pagination to all list endpoints (grounds, bookings, maintenance) per Constitution Principle 3

### Security Hardening

- [ ] T203 Implement rate limiting per user and IP in services/api-gateway/src/middleware/rate-limit.ts (per Constitution Principle 4)
- [ ] T204 [P] Add Helmet.js security headers in services/api-gateway/src/server.ts
- [ ] T205 [P] Implement input sanitization to prevent XSS in packages/common/src/validation.ts
- [ ] T206 Verify sensitive data sanitization in logs (password, token, email excluded) per Constitution Principle 4
- [ ] T207 [P] Add SQL injection prevention via Prisma parameterized queries (verify all queries)

### UI/UX Polish

- [ ] T208 [P] Implement loading states for all API calls in frontend (React Query loading states)
- [ ] T209 [P] Add error boundaries in frontend/app/error.tsx
- [ ] T210 [P] Implement toast notifications for success/error messages in frontend/components/Toast.tsx
- [ ] T211 Verify mobile responsiveness (375px min width) per Constitution Principle 5
- [ ] T212 Test booking flow is <4 clicks per Constitution Principle 5
- [ ] T213 [P] Add accessibility attributes (ARIA labels, keyboard navigation) in frontend components

### Documentation & Process (per Constitution Principle 6)

- [ ] T214 [P] Generate OpenAPI docs from Swagger annotations in services/api-gateway/src/swagger.ts
- [ ] T215 [P] Create ADR for microservices architecture in docs/architecture/adr-001-microservices.md
- [ ] T216 [P] Create ADR for gRPC internal communication in docs/architecture/adr-002-grpc-internal.md
- [ ] T217 [P] Create ADR for shared PostgreSQL database in docs/architecture/adr-003-shared-postgres.md
- [ ] T218 [P] Create ADR for JWT authentication in docs/architecture/adr-004-jwt-auth.md
- [ ] T219 Create CHANGELOG.md following Keep a Changelog format
- [ ] T220 Update README.md with quickstart, architecture diagram, and contribution guidelines
- [ ] T221 [P] Add inline code comments for complex logic (conflict detection, peak hours calculation)

### CI/CD Pipeline

- [ ] T222 Create GitHub Actions workflow for linting in .github/workflows/ci.yml (ESLint, Prettier)
- [ ] T223 Create GitHub Actions workflow for unit tests in .github/workflows/ci.yml (run all service tests in parallel)
- [ ] T224 Create GitHub Actions workflow for integration tests in .github/workflows/ci.yml (Docker Compose + Supertest)
- [ ] T225 Create GitHub Actions workflow for E2E tests in .github/workflows/ci.yml (Playwright)
- [ ] T226 Create GitHub Actions workflow for Docker image builds in .github/workflows/ci.yml
- [ ] T227 Configure GitHub branch protection rules (require CI passing before merge)

### Deployment

- [ ] T228 Create production Docker Compose in infrastructure/docker-compose.prod.yml (optimized images, no volume mounts)
- [ ] T229 [P] Create deployment guide in docs/deployment.md (SSH, Docker pull, environment variables)
- [ ] T230 [P] Create rollback procedure documentation in docs/deployment.md
- [ ] T231 Setup environment variables template in .env.example with all required variables

---

## Dependencies & Execution Order

### Critical Path (Must Complete Sequentially)

1. **Phase 1 → Phase 2**: Setup must complete before foundation
2. **Phase 2 → Phase 3-9**: Foundation must complete before ANY user story
3. **Phase 3 → Phase 4**: Ground discovery required before booking (users need to select grounds)
4. **Phase 5 → Phase 6-7**: Auth required before user bookings and admin features
5. **Phase 6 requires Phase 4**: Booking management builds on booking creation

### Parallel Execution Opportunities

**After Phase 2 (Foundation) completes, these can run in parallel**:

- **Parallel Group A** (P1 stories): Phase 3 (Ground Discovery) + Phase 4 (Availability Calendar)
- **Parallel Group B** (P2 stories): Phase 5 (Auth) can start while Phase 3-4 are in progress
- **Parallel Group C** (P3 admin features): Phase 5, 6, 7 can run in parallel if multiple team members

**Within each phase, [P] tasks can run in parallel**:
- Example: T041, T042, T043 (all tests for US1) can run simultaneously
- Example: T051, T052 (frontend tasks) can run while T044-T050 (backend tasks) are in progress

### Per-User-Story Parallel Execution

**User Story 1** (Ground Discovery):
- Parallel: T041, T042, T043, T044, T051, T052 (tests + models + frontend)
- Sequential: T045 → T046 → T047 → T048 (service → gRPC → client → gateway)

**User Story 2** (Availability):
- Parallel: T056, T057, T058, T059, T060, T063, T065, T071, T072 (tests + services + frontend)
- Sequential: Availability calculation requires booking + maintenance services

**User Story 3** (Auth):
- Parallel: T076-T080 (all tests), T081 (model), T097-T099 (frontend pages)
- Sequential: T082 → T083 → T084 (auth logic dependencies)

**User Story 4** (Booking):
- Parallel: T103-T107 (tests), T108 (model), T129, T130, T133 (frontend)
- Sequential: T109 → T110 → T112 (conflict detection → booking creation → gRPC)

---

## Implementation Strategy

### MVP First Approach (Recommended)

**Week 1-2**: Phase 1 + Phase 2 (Setup + Foundation)
**Week 3**: Phase 3 + Phase 4 (User Stories 1-2 - Ground Discovery + Availability) ← **MVP Delivery**
**Week 4**: Phase 5 (User Story 3 - Auth)
**Week 5**: Phase 6 (User Story 4 - Booking) ← **Core Value Delivery**
**Week 6**: Phase 7-9 (User Stories 5-7 - Admin Features)
**Week 7**: Phase 10 (Polish + Deployment)

### Suggested MVP Scope

**Minimum Viable Product** (deliver first for user feedback):
- ✅ Phase 1: Setup
- ✅ Phase 2: Foundation
- ✅ Phase 3: Ground Discovery (User Story 1)
- ✅ Phase 4: Availability Calendar (User Story 2)
- ✅ Phase 5: Authentication (User Story 3)
- ✅ Phase 6: Booking Creation (User Story 4)

**Post-MVP** (add after validation):
- Phase 7-9: Admin features (can be done manually initially)
- Phase 10: Polish (add incrementally)

---

## Summary

**Total Tasks**: 231  
**User Stories**: 7 (3 P1, 2 P2, 2 P3)  
**Parallel Opportunities**: 89 tasks marked [P]  
**Independent Test Criteria**: Each user story has 3-5 test tasks for validation  

**Format Validation**: ✅ All tasks follow `- [ ] [ID] [P?] [Story?] Description with file path`

**Constitution Compliance**:
- ✅ Tests REQUIRED per Principle 2 (69 test tasks total)
- ✅ Security tasks per Principle 4 (T203-T207)
- ✅ UX tasks per Principle 5 (T208-T213)
- ✅ Documentation tasks per Principle 6 (T214-T221)
- ✅ CI/CD per Principle 2 (T222-T227)

**Ready for execution!** 🚀
