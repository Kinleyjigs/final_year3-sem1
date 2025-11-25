import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { availabilityService } from '../services/availability.service';
import { bookingService } from '../services/booking.service';
import { logger } from '@one-stop-book/common';
import { ValidationError, ConflictError, NotFoundError, UnauthorizedError } from '@one-stop-book/common';

// Load the proto file
const PROTO_PATH = path.join(__dirname, '../proto/booking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const bookingPackage = grpc.loadPackageDefinition(packageDefinition) as any;

/**
 * gRPC server implementation for Booking Service
 */
export class BookingServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.addService(bookingPackage.booking.BookingService.service, {
      GetAvailability: this.handleGetAvailability.bind(this),
      CreateBooking: this.handleCreateBooking.bind(this),
      CheckConflict: this.handleCheckConflict.bind(this),
      GetUserBookings: this.handleGetUserBookings.bind(this),
      CancelBooking: this.handleCancelBooking.bind(this),
    });
  }

  /**
   * Handle GetAvailability RPC
   * Combines booking data and maintenance windows to return availability
   */
  private async handleGetAvailability(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { ground_id, start_date, end_date } = call.request;

      if (!ground_id || !start_date || !end_date) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Ground ID, start_date, and end_date are required',
        });
      }

      // Extract maintenance windows from request metadata (passed by API Gateway)
      // For now, we'll get them from the request directly
      const maintenanceWindows = call.request.maintenance_windows || [];

      const availability = await availabilityService.getAvailability({
        groundId: ground_id,
        startDate: start_date,
        endDate: end_date,
        maintenanceWindows: maintenanceWindows.map((mw: any) => ({
          id: mw.id,
          startDateTime: mw.start_date_time,
          endDateTime: mw.end_date_time,
        })),
      });

      // Transform to gRPC response format
      const response = {
        availability: availability.map((day) => ({
          date: day.date,
          slots: day.slots.map((slot) => ({
            start_time: slot.startTime,
            end_time: slot.endTime,
            status: slot.status === 'AVAILABLE' ? 0 : slot.status === 'BOOKED' ? 1 : 2,
            booking_id: slot.bookingId,
          })),
        })),
      };

      callback(null, response);
    } catch (error) {
      logger.error('GetAvailability RPC error', { error });

      if (error instanceof ValidationError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while retrieving availability',
        });
      }
    }
  }

  /**
   * T112: Handle CreateBooking RPC
   * Creates a booking with conflict detection and peak hours check
   */
  private async handleCreateBooking(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { user_id, ground_id, booking_date, start_time, end_time } = call.request;

      if (!user_id || !ground_id || !booking_date || !start_time || !end_time) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'All fields are required: user_id, ground_id, booking_date, start_time, end_time',
        });
      }

      const booking = await bookingService.createBooking({
        userId: user_id,
        groundId: ground_id,
        bookingDate: new Date(booking_date),
        startTime: start_time,
        endTime: end_time,
      });

      // Transform to gRPC response format
      const response = {
        id: booking.id,
        user_id: booking.userId,
        ground_id: booking.groundId,
        booking_date: booking.bookingDate.toISOString().split('T')[0],
        start_time: booking.startTime,
        end_time: booking.endTime,
        status: booking.status,
        confirmation_code: booking.confirmationCode,
        created_at: booking.createdAt.toISOString(),
        updated_at: booking.updatedAt.toISOString(),
      };

      callback(null, response);
    } catch (error) {
      logger.error('CreateBooking RPC error', { error });

      if (error instanceof ConflictError) {
        callback({
          code: grpc.status.ALREADY_EXISTS,
          message: error.message,
        });
      } else if (error instanceof ValidationError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while creating the booking',
        });
      }
    }
  }

  /**
   * T113: Handle CheckConflict RPC
   * Checks if a booking slot has conflicts
   */
  private async handleCheckConflict(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { ground_id, booking_date, start_time, end_time } = call.request;

      if (!ground_id || !booking_date || !start_time || !end_time) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'All fields are required: ground_id, booking_date, start_time, end_time',
        });
      }

      const hasConflict = await bookingService.checkConflict({
        userId: '', // Not needed for conflict check
        groundId: ground_id,
        bookingDate: new Date(booking_date),
        startTime: start_time,
        endTime: end_time,
      });

      callback(null, { has_conflict: hasConflict });
    } catch (error) {
      logger.error('CheckConflict RPC error', { error });

      callback({
        code: grpc.status.INTERNAL,
        message: 'An error occurred while checking for conflicts',
      });
    }
  }

  /**
   * T118: Handle GetUserBookings RPC
   * Retrieves all bookings for a user
   */
  private async handleGetUserBookings(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { user_id } = call.request;

      if (!user_id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'User ID is required',
        });
      }

      const bookings = await bookingService.getUserBookings(user_id);

      // Transform to gRPC response format
      const response = {
        bookings: bookings.map((booking) => ({
          id: booking.id,
          user_id: booking.userId,
          ground_id: booking.groundId,
          booking_date: booking.bookingDate.toISOString().split('T')[0],
          start_time: booking.startTime,
          end_time: booking.endTime,
          status: booking.status,
          confirmation_code: booking.confirmationCode,
          created_at: booking.createdAt.toISOString(),
          updated_at: booking.updatedAt.toISOString(),
        })),
      };

      callback(null, response);
    } catch (error) {
      logger.error('GetUserBookings RPC error', { error });

      callback({
        code: grpc.status.INTERNAL,
        message: 'An error occurred while retrieving user bookings',
      });
    }
  }

  /**
   * T119: Handle CancelBooking RPC
   * Cancels a booking with ownership and validation checks
   */
  private async handleCancelBooking(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { booking_id, user_id } = call.request;

      if (!booking_id || !user_id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Booking ID and User ID are required',
        });
      }

      const booking = await bookingService.cancelBooking({
        bookingId: booking_id,
        userId: user_id,
      });

      // Transform to gRPC response format
      const response = {
        id: booking.id,
        user_id: booking.userId,
        ground_id: booking.groundId,
        booking_date: booking.bookingDate.toISOString().split('T')[0],
        start_time: booking.startTime,
        end_time: booking.endTime,
        status: booking.status,
        confirmation_code: booking.confirmationCode,
        created_at: booking.createdAt.toISOString(),
        updated_at: booking.updatedAt.toISOString(),
      };

      callback(null, response);
    } catch (error) {
      logger.error('CancelBooking RPC error', { error });

      if (error instanceof NotFoundError) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: error.message,
        });
      } else if (error instanceof UnauthorizedError) {
        callback({
          code: grpc.status.PERMISSION_DENIED,
          message: error.message,
        });
      } else if (error instanceof ValidationError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while canceling the booking',
        });
      }
    }
  }

  /**
   * Start the gRPC server
   */
  start(port: number = 50053): Promise<void> {
    return new Promise((resolve, reject) => {
      const bindAddress = `0.0.0.0:${port}`;

      this.server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            logger.error('Failed to start Booking gRPC server', { error });
            reject(error);
          } else {
            logger.info(`Booking gRPC server running on port ${port}`);
            resolve();
          }
        }
      );
    });
  }

  /**
   * Gracefully shutdown the server
   */
  shutdown(): Promise<void> {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        logger.info('Booking gRPC server shut down');
        resolve();
      });
    });
  }
}

// Create server instance
export const bookingServer = new BookingServer();

// Start server if run directly
if (require.main === module) {
  const port = parseInt(process.env.BOOKING_SERVICE_PORT || '50053', 10);
  bookingServer.start(port).catch((error) => {
    logger.error('Failed to start server', { error });
    process.exit(1);
  });
}
