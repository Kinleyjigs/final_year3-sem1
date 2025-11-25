# Data Model

**Feature**: Campus Ground Booking Platform  
**Date**: 2025-11-24  
**Phase**: 1 - Data Model Design

## Overview

This document defines the database schema for the One Stop Book platform. The data model is implemented using PostgreSQL 15+ with Prisma ORM. Each microservice manages its own schema within the shared database for logical separation while maintaining referential integrity through foreign keys.

---

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │     Ground      │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ email           │         │ name            │
│ passwordHash    │         │ college         │
│ fullName        │         │ location        │
│ college         │         │ description     │
│ role            │         │ capacity        │
│ createdAt       │         │ amenities       │
│ updatedAt       │         │ peakHours       │
└────────┬────────┘         │ photos          │
         │                  │ isActive        │
         │                  │ createdAt       │
         │                  │ updatedAt       │
         │                  │ adminUserId (FK)│
         │                  └────────┬────────┘
         │                           │
         │                           │
         │         ┌─────────────────┴───────────────────┐
         │         │                                     │
         │    ┌────▼───────────┐              ┌─────────▼──────────┐
         │    │    Booking     │              │ MaintenanceSchedule│
         │    ├────────────────┤              ├────────────────────┤
         │    │ id (PK)        │              │ id (PK)            │
         └───►│ userId (FK)    │              │ groundId (FK)      │
              │ groundId (FK)  │              │ startDateTime      │
              │ bookingDate    │              │ endDateTime        │
              │ startTime      │              │ description        │
              │ endTime        │              │ createdByUserId(FK)│
              │ status         │              │ createdAt          │
              │ confirmationCode              │ updatedAt          │
              │ cancellationReason            └────────────────────┘
              │ createdAt      │
              │ updatedAt      │
              └────────┬───────┘
                       │
                       │
              ┌────────▼───────────┐
              │   Notification     │
              ├────────────────────┤
              │ id (PK)            │
              │ userId (FK)        │
              │ bookingId (FK)     │
              │ type               │
              │ subject            │
              │ message            │
              │ deliveryStatus     │
              │ sentAt             │
              │ createdAt          │
              └────────────────────┘
```

---

## Entities

### 1. User

**Purpose**: Represents a platform user (student or college admin).

**Schema**: `auth` (managed by Auth Service)

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (login identifier) |
| `passwordHash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `fullName` | VARCHAR(255) | NOT NULL | User's full name |
| `college` | VARCHAR(255) | NOT NULL | College affiliation |
| `role` | ENUM | NOT NULL | `VISITOR`, `USER`, `ADMIN` |
| `createdAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updatedAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last profile update timestamp |

**Validation Rules**:
- Email must match regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- Password must be ≥8 characters before hashing
- Role defaults to `USER` on registration
- `ADMIN` role can only be assigned by existing admins

**Indexes**:
- `idx_user_email` on `email` (UNIQUE)
- `idx_user_college_role` on `(college, role)` for admin queries

**Relationships**:
- One User → Many Bookings (user can create multiple bookings)
- One User (admin) → Many Grounds (admin manages grounds for their college)
- One User → Many Notifications

**State Transitions**: N/A (no state machine; role can change but requires admin action)

---

### 2. Ground

**Purpose**: Represents a football ground available for booking.

**Schema**: `grounds` (managed by Grounds Service)

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Ground name (e.g., "Main Field") |
| `college` | VARCHAR(255) | NOT NULL | College owning the ground |
| `location` | TEXT | NOT NULL | Physical address or campus location |
| `description` | TEXT | NULLABLE | Detailed description |
| `capacity` | INTEGER | NOT NULL, CHECK > 0 | Maximum number of players/users |
| `amenities` | TEXT[] | DEFAULT [] | List of amenities (e.g., "Floodlights", "Changing Rooms") |
| `peakHours` | JSONB | NULLABLE | Peak hours requiring manual approval: `{"monday": ["18:00-20:00"], "saturday": ["09:00-12:00"]}` |
| `photos` | TEXT[] | DEFAULT [] | Array of photo URLs |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether ground is available for booking |
| `timezone` | VARCHAR(50) | NOT NULL, DEFAULT 'UTC' | Timezone for booking times (e.g., 'Asia/Kolkata') |
| `adminUserId` | UUID | FOREIGN KEY → User.id | Admin who manages this ground |
| `createdAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Ground creation timestamp |
| `updatedAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- Name must be unique within a college (unique constraint on `(college, name)`)
- Capacity must be > 0
- `peakHours` JSON must match schema: `{ [dayOfWeek: string]: string[] }`
- Photo URLs must be valid HTTP(S) URLs
- Only admins from the same college can manage the ground

**Indexes**:
- `idx_ground_college_active` on `(college, isActive)` for search queries
- `idx_ground_admin` on `adminUserId`

**Relationships**:
- One Ground → Many Bookings
- One Ground → Many MaintenanceSchedules
- One Ground → One User (admin)

**State Transitions**:
- `isActive: TRUE` ↔ `isActive: FALSE` (admin can activate/deactivate)

---

### 3. Booking

**Purpose**: Represents a reservation of a ground for a specific time period.

**Schema**: `bookings` (managed by Booking Service)

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `userId` | UUID | FOREIGN KEY → User.id, NOT NULL | User who created the booking |
| `groundId` | UUID | FOREIGN KEY → Ground.id, NOT NULL | Ground being booked |
| `bookingDate` | DATE | NOT NULL | Date of the booking |
| `startTime` | TIME | NOT NULL | Start time (e.g., 09:00) |
| `endTime` | TIME | NOT NULL | End time (e.g., 10:00 or 11:00) |
| `status` | ENUM | NOT NULL | `PENDING`, `APPROVED`, `REJECTED`, `CANCELED` |
| `confirmationCode` | VARCHAR(16) | UNIQUE, NOT NULL | Alphanumeric confirmation code (e.g., "BK1A2B3C4D") |
| `cancellationReason` | TEXT | NULLABLE | Reason for cancellation (user-provided or admin-provided) |
| `createdAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Booking creation timestamp |
| `updatedAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last status update timestamp |

**Validation Rules**:
- `startTime` must be before `endTime`
- Duration must be 1 hour or 2 hours (enforced in application logic)
- `bookingDate` must be today or future date (cannot book past dates)
- User can only cancel bookings in `PENDING` or `APPROVED` status
- Confirmation code generated using `crypto.randomBytes(8).toString('hex').toUpperCase()`
- No overlapping bookings for same ground (enforced via SELECT FOR UPDATE)

**Indexes**:
- `idx_booking_user` on `userId` (user's booking history)
- `idx_booking_ground_date` on `(groundId, bookingDate)` (availability queries)
- `idx_booking_status` on `status` (admin pending bookings view)
- `idx_booking_confirmation` on `confirmationCode` (UNIQUE)

**Relationships**:
- Many Bookings → One User
- Many Bookings → One Ground
- One Booking → Many Notifications

**State Transitions**:
```
         ┌──────────┐
         │ PENDING  │ (created during peak hours)
         └────┬─────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
┌──────────┐    ┌──────────┐
│ APPROVED │    │ REJECTED │
└────┬─────┘    └──────────┘
     │
     ▼
┌──────────┐
│ CANCELED │
└──────────┘

Notes:
- Auto-approved bookings skip PENDING and go directly to APPROVED
- REJECTED and CANCELED are terminal states
- APPROVED → CANCELED (user or admin can cancel)
- PENDING → APPROVED (admin approval)
- PENDING → REJECTED (admin rejection)
- PENDING → CANCELED (user cancellation before approval)
```

---

### 4. MaintenanceSchedule

**Purpose**: Represents a scheduled maintenance period for a ground.

**Schema**: `maintenance` (managed by Maintenance Service)

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `groundId` | UUID | FOREIGN KEY → Ground.id, NOT NULL | Ground under maintenance |
| `startDateTime` | TIMESTAMPTZ | NOT NULL | Maintenance start date and time |
| `endDateTime` | TIMESTAMPTZ | NOT NULL | Maintenance end date and time |
| `description` | TEXT | NOT NULL | Reason for maintenance (e.g., "Grass resurfacing") |
| `createdByUserId` | UUID | FOREIGN KEY → User.id, NOT NULL | Admin who scheduled the maintenance |
| `createdAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Maintenance schedule creation timestamp |
| `updatedAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `startDateTime` must be before `endDateTime`
- `startDateTime` must be now or future (cannot schedule maintenance in the past)
- Only admins from the same college as the ground can schedule maintenance
- When maintenance is created, automatically cancel conflicting bookings (status `APPROVED` or `PENDING`)

**Indexes**:
- `idx_maintenance_ground_time` on `(groundId, startDateTime, endDateTime)` (availability queries)
- `idx_maintenance_admin` on `createdByUserId`

**Relationships**:
- Many MaintenanceSchedules → One Ground
- Many MaintenanceSchedules → One User (admin)

**State Transitions**: N/A (maintenance is created and can be deleted; no status field)

---

### 5. Notification

**Purpose**: Represents a message sent to users regarding booking or maintenance events.

**Schema**: `notifications` (managed by Notification Service)

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `userId` | UUID | FOREIGN KEY → User.id, NOT NULL | Recipient user |
| `bookingId` | UUID | FOREIGN KEY → Booking.id, NULLABLE | Related booking (if applicable) |
| `type` | ENUM | NOT NULL | `CONFIRMATION`, `APPROVAL`, `REJECTION`, `CANCELLATION`, `REMINDER`, `MAINTENANCE_CANCELLATION` |
| `subject` | VARCHAR(255) | NOT NULL | Email subject line |
| `message` | TEXT | NOT NULL | Email body (HTML or plain text) |
| `deliveryStatus` | ENUM | NOT NULL | `PENDING`, `SENT`, `FAILED` |
| `sentAt` | TIMESTAMPTZ | NULLABLE | Timestamp when email was sent |
| `createdAt` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Notification creation timestamp |

**Validation Rules**:
- `type` determines the email template used
- `deliveryStatus` starts as `PENDING`, changes to `SENT` on success or `FAILED` after max retries
- `sentAt` is set when `deliveryStatus` changes to `SENT`
- Failed notifications are retried with exponential backoff (1min, 5min, 15min)

**Indexes**:
- `idx_notification_user_created` on `(userId, createdAt)` (user notification history)
- `idx_notification_status` on `deliveryStatus` (retry queue)
- `idx_notification_booking` on `bookingId`

**Relationships**:
- Many Notifications → One User
- Many Notifications → One Booking (nullable for non-booking notifications)

**State Transitions**:
```
┌─────────┐
│ PENDING │
└────┬────┘
     │
     ├──────► ┌──────┐
     │        │ SENT │
     │        └──────┘
     │
     └──────► ┌────────┐
              │ FAILED │ (after 3 retries)
              └────────┘
```

---

## Prisma Schema Examples

### Auth Service (schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  fullName     String
  college      String
  role         Role     @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([college, role])
  @@map("users")
}

enum Role {
  VISITOR
  USER
  ADMIN
}
```

### Booking Service (schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Booking {
  id                 String        @id @default(uuid())
  userId             String
  groundId           String
  bookingDate        DateTime      @db.Date
  startTime          DateTime      @db.Time
  endTime            DateTime      @db.Time
  status             BookingStatus @default(PENDING)
  confirmationCode   String        @unique
  cancellationReason String?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  @@index([userId])
  @@index([groundId, bookingDate])
  @@index([status])
  @@map("bookings")
}

enum BookingStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELED
}
```

---

## Concurrency Control Strategy

### Booking Conflict Prevention

**Problem**: Two users simultaneously booking the same time slot must result in only one successful booking.

**Solution**: Use PostgreSQL `SELECT FOR UPDATE` to lock overlapping time ranges.

**Implementation** (Booking Service):

```typescript
async createBooking(data: CreateBookingDTO): Promise<Booking> {
  return await prisma.$transaction(async (tx) => {
    // 1. Lock overlapping bookings for this ground
    const conflicts = await tx.$queryRaw`
      SELECT id FROM bookings
      WHERE ground_id = ${data.groundId}
        AND booking_date = ${data.bookingDate}
        AND status IN ('APPROVED', 'PENDING')
        AND (start_time, end_time) OVERLAPS (${data.startTime}, ${data.endTime})
      FOR UPDATE;
    `;

    if (conflicts.length > 0) {
      throw new ConflictError('This time slot is no longer available.');
    }

    // 2. Check maintenance windows (handled by Maintenance Service via gRPC call)
    const maintenanceConflict = await maintenanceClient.checkConflict({
      groundId: data.groundId,
      startDateTime: `${data.bookingDate}T${data.startTime}`,
      endDateTime: `${data.bookingDate}T${data.endTime}`,
    });

    if (maintenanceConflict.hasConflict) {
      throw new ConflictError('Ground under maintenance during selected time.');
    }

    // 3. Determine status (auto-approve or pending based on peak hours)
    const isPeakTime = await groundsClient.isPeakTime({
      groundId: data.groundId,
      dateTime: `${data.bookingDate}T${data.startTime}`,
    });

    const status = isPeakTime.isPeak ? 'PENDING' : 'APPROVED';

    // 4. Create booking
    const booking = await tx.booking.create({
      data: {
        ...data,
        status,
        confirmationCode: generateConfirmationCode(),
      },
    });

    // 5. Send notification (async via gRPC)
    notificationClient.sendBookingConfirmation({ bookingId: booking.id });

    return booking;
  }, {
    timeout: 5000, // 5 second transaction timeout
    isolationLevel: 'Serializable', // Strictest isolation level
  });
}
```

### Maintenance Conflict Handling

When a maintenance window is created, automatically cancel conflicting bookings:

```typescript
async createMaintenance(data: CreateMaintenanceDTO): Promise<Maintenance> {
  return await prisma.$transaction(async (tx) => {
    // 1. Create maintenance window
    const maintenance = await tx.maintenanceSchedule.create({ data });

    // 2. Find conflicting bookings
    const conflicts = await tx.$queryRaw`
      SELECT id, user_id FROM bookings
      WHERE ground_id = ${data.groundId}
        AND status IN ('APPROVED', 'PENDING')
        AND (
          (booking_date::timestamp + start_time::interval, booking_date::timestamp + end_time::interval)
          OVERLAPS
          (${data.startDateTime}, ${data.endDateTime})
        )
      FOR UPDATE;
    `;

    // 3. Cancel conflicting bookings
    const bookingIds = conflicts.map(c => c.id);
    await tx.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: {
        status: 'CANCELED',
        cancellationReason: `Ground maintenance scheduled: ${data.description}`,
      },
    });

    // 4. Send cancellation notifications (async via gRPC)
    for (const conflict of conflicts) {
      notificationClient.sendMaintenanceCancellation({
        bookingId: conflict.id,
        userId: conflict.user_id,
      });
    }

    return maintenance;
  });
}
```

---

## Data Retention & Privacy

**Retention Policy** (per FR-030):
- All booking data retained indefinitely for historical records and analytics
- User data retained as long as account is active
- Deleted accounts: anonymize user data (replace fullName with "Deleted User", email with hash) but keep booking records

**Privacy Considerations** (per Constitution Principle 4):
- Password stored as bcrypt hash (salt rounds: 12)
- Sensitive fields (`passwordHash`, `email`) excluded from logs
- Notification message content not logged (only delivery status)
- GDPR compliance: users can request data export (JSON dump of bookings/notifications)

---

## Migration Strategy

1. **Initial Setup**: Run `prisma migrate dev` for each service to create schemas
2. **Seeding**: Use `infrastructure/scripts/seed.ts` to populate:
   - Admin users for each college
   - 10-20 sample grounds
   - Sample bookings (historical data for testing)
3. **Production**: Run `prisma migrate deploy` in CI/CD pipeline before deployment
4. **Rollback**: Prisma doesn't support automatic rollback; maintain manual rollback SQL scripts in `infrastructure/postgres/migrations/`

---

## Alignment with Constitution

| Principle | How Data Model Supports It |
|-----------|----------------------------|
| **Code Quality** | Prisma provides type-safe database access. Clear foreign key relationships enforce referential integrity. |
| **Testing** | Test database uses `pg-mem` or test containers with same schema. Prisma migrations ensure consistency. |
| **Reliability** | `SELECT FOR UPDATE` prevents race conditions. Transaction timeouts enforce fail-fast behavior. |
| **Security** | Password hashing (bcrypt). Role-based access enforced at database + application layer. |
| **UX** | Clear status transitions (PENDING → APPROVED → CANCELED) communicated in UI. |
| **Documentation** | This document serves as schema documentation. Prisma schema is self-documenting with `@@map` and comments. |
| **Continuous Improvement** | Schema versioning via Prisma migrations. `updatedAt` timestamps track changes for analytics. |

---

**Next Steps**: Define API contracts (REST for API Gateway, gRPC for internal services) in `/contracts/` directory.
