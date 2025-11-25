import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { ConflictError, ValidationError } from '@one-stop-book/common';

// Define types locally until grpc-clients are fully implemented
type GroundsClient = any;
type MaintenanceClient = any;
type NotificationClient = any;

// Define Booking type from Prisma
type Booking = {
  id: string;
  userId: string;
  groundId: string;
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  confirmationCode: string;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export interface CreateBookingDTO {
  userId: string;
  groundId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
}

export interface CancelBookingDTO {
  bookingId: string;
  userId: string;
  reason?: string;
}

export class BookingService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly groundsClient?: GroundsClient,
    private readonly maintenanceClient?: MaintenanceClient,
    private readonly notificationClient?: NotificationClient
  ) {}

  /**
   * T111: Generate a unique confirmation code using crypto.randomBytes
   * Format: 16 uppercase alphanumeric characters
   */
  generateConfirmationCode(): string {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
  }

  /**
   * T109: Check for booking conflicts with SELECT FOR UPDATE locking
   * Returns true if conflict exists, false if slot is available
   */
  async checkConflict(data: CreateBookingDTO): Promise<boolean> {
    const conflicts = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM bookings."bookings"
      WHERE ground_id = ${data.groundId}::uuid
        AND booking_date = ${data.bookingDate}::date
        AND status IN ('APPROVED', 'PENDING')
        AND (start_time, end_time) OVERLAPS (${data.startTime}::time, ${data.endTime}::time)
      FOR UPDATE;
    `;

    return conflicts.length > 0;
  }

  /**
   * T110: Create a booking with conflict detection in transaction
   * Includes peak hours check and confirmation code generation
   */
  async createBooking(data: CreateBookingDTO): Promise<Booking> {
    return await this.prisma.$transaction(
      async (tx) => {
        // 1. Lock overlapping bookings for this ground
        const conflicts = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT id FROM bookings."bookings"
          WHERE ground_id = ${data.groundId}::uuid
            AND booking_date = ${data.bookingDate}::date
            AND status IN ('APPROVED', 'PENDING')
            AND (start_time, end_time) OVERLAPS (${data.startTime}::time, ${data.endTime}::time)
          FOR UPDATE;
        `;

        if (conflicts.length > 0) {
          throw new ConflictError('This time slot is no longer available.');
        }

        // 2. Check maintenance windows (if maintenance client available)
        if (this.maintenanceClient) {
          const maintenanceConflict = await this.maintenanceClient.checkConflict({
            groundId: data.groundId,
            startDateTime: `${data.bookingDate.toISOString().split('T')[0]}T${data.startTime}`,
            endDateTime: `${data.bookingDate.toISOString().split('T')[0]}T${data.endTime}`,
          });

          if (maintenanceConflict.hasConflict) {
            throw new ConflictError('Ground under maintenance during selected time.');
          }
        }

        // 3. Determine status (auto-approve or pending based on peak hours)
        let status: BookingStatus = BookingStatus.APPROVED;

        if (this.groundsClient) {
          const isPeakTime = await this.groundsClient.isPeakTime({
            groundId: data.groundId,
            dateTime: `${data.bookingDate.toISOString().split('T')[0]}T${data.startTime}`,
          });

          if (isPeakTime.isPeak) {
            status = BookingStatus.PENDING;
          }
        }

        // 4. Generate confirmation code
        const confirmationCode = this.generateConfirmationCode();

        // 5. Create booking
        const booking = await tx.booking.create({
          data: {
            userId: data.userId,
            groundId: data.groundId,
            bookingDate: data.bookingDate,
            startTime: new Date(`1970-01-01T${data.startTime}`),
            endTime: new Date(`1970-01-01T${data.endTime}`),
            status,
            confirmationCode,
          },
        });

        // 6. Send notification (async via gRPC)
        if (this.notificationClient) {
          this.notificationClient
            .sendBookingConfirmation({ bookingId: booking.id })
            .catch((error: Error) => {
              console.error('Failed to send booking confirmation:', error);
            });
        }

        return booking;
      },
      {
        timeout: 5000, // 5 second transaction timeout
        isolationLevel: 'Serializable', // Strictest isolation level
      }
    );
  }

  /**
   * T116: Get all bookings for a specific user
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.prisma.booking.findMany({
      where: { userId },
      orderBy: [{ bookingDate: 'desc' }, { startTime: 'desc' }],
    });
  }

  /**
   * T117: Cancel a booking with validations
   * Validates: not past booking, not already canceled/rejected
   */
  async cancelBooking(data: CancelBookingDTO): Promise<Booking> {
    // 1. Get booking details
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new ValidationError('Booking not found');
    }

    // 2. Verify ownership
    if (booking.userId !== data.userId) {
      throw new ValidationError('You are not authorized to cancel this booking');
    }

    // 3. Check if already canceled or rejected
    if (booking.status === BookingStatus.CANCELED) {
      throw new ValidationError('This booking is already canceled');
    }

    if (booking.status === BookingStatus.REJECTED) {
      throw new ValidationError('Cannot cancel a rejected booking');
    }

    // 4. Check if booking is in the past
    const bookingDateTime = new Date(
      `${booking.bookingDate.toISOString().split('T')[0]}T${booking.startTime.toISOString().split('T')[1]}`
    );

    if (bookingDateTime < new Date()) {
      throw new ValidationError('Cannot cancel a past booking');
    }

    // 5. Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: data.bookingId },
      data: {
        status: BookingStatus.CANCELED,
        cancellationReason: data.reason || 'User requested cancellation',
      },
    });

    // 6. Send cancellation notification (async)
    if (this.notificationClient) {
      this.notificationClient
        .sendBookingCancellation({ bookingId: updatedBooking.id })
        .catch((error: Error) => {
          console.error('Failed to send cancellation notification:', error);
        });
    }

    return updatedBooking;
  }

  /**
   * Get a single booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking | null> {
    return await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
  }

  /**
   * Get bookings for a specific ground (optionally filtered by date)
   */
  async getGroundBookings(groundId: string, date?: Date): Promise<Booking[]> {
    const where: any = { groundId };

    if (date) {
      where.bookingDate = date;
    }

    return await this.prisma.booking.findMany({
      where,
      orderBy: [{ bookingDate: 'asc' }, { startTime: 'asc' }],
    });
  }
}

// Create singleton instance for use in gRPC server
const prisma = new PrismaClient();

export const bookingService = new BookingService(
  prisma,
  undefined, // groundsClient - will be injected by gRPC server
  undefined, // maintenanceClient - will be injected by gRPC server
  undefined  // notificationClient - will be injected by gRPC server
);
