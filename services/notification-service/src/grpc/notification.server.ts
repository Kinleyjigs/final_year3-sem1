import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { notificationService } from '../services/notification.service';
import { logger } from '@one-stop-book/common';

// Load the proto file
const PROTO_PATH = path.join(__dirname, '../proto/notification.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const notificationPackage = grpc.loadPackageDefinition(packageDefinition) as any;

/**
 * T126: gRPC server implementation for Notification Service
 */
export class NotificationServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.addService(notificationPackage.notification.NotificationService.service, {
      SendBookingConfirmation: this.handleSendBookingConfirmation.bind(this),
      SendBookingCancellation: this.handleSendBookingCancellation.bind(this),
    });
  }

  /**
   * T126: Handle SendBookingConfirmation RPC
   */
  private async handleSendBookingConfirmation(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const {
        user_name,
        user_email,
        ground_name,
        college,
        location,
        booking_date,
        start_time,
        end_time,
        confirmation_code,
        status,
      } = call.request;

      logger.info('SendBookingConfirmation RPC called', {
        userEmail: user_email,
        confirmationCode: confirmation_code,
      });

      const success = await notificationService.sendBookingConfirmation({
        userName: user_name,
        userEmail: user_email,
        groundName: ground_name,
        college,
        location,
        bookingDate: booking_date,
        startTime: start_time,
        endTime: end_time,
        confirmationCode: confirmation_code,
        status: status || 'APPROVED',
      });

      callback(null, { success });
    } catch (error) {
      logger.error('SendBookingConfirmation RPC error', { error });
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to send booking confirmation',
      });
    }
  }

  /**
   * Handle SendBookingCancellation RPC
   */
  private async handleSendBookingCancellation(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const {
        user_name,
        user_email,
        ground_name,
        college,
        location,
        booking_date,
        start_time,
        end_time,
        confirmation_code,
      } = call.request;

      const success = await notificationService.sendBookingCancellation({
        userName: user_name,
        userEmail: user_email,
        groundName: ground_name,
        college,
        location,
        bookingDate: booking_date,
        startTime: start_time,
        endTime: end_time,
        confirmationCode: confirmation_code,
        status: 'CANCELED',
      });

      callback(null, { success });
    } catch (error) {
      logger.error('SendBookingCancellation RPC error', { error });
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to send cancellation notification',
      });
    }
  }

  /**
   * Start the gRPC server
   */
  start(port: number = 50055): Promise<void> {
    return new Promise((resolve, reject) => {
      const bindAddress = `0.0.0.0:${port}`;

      this.server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            logger.error('Failed to start Notification gRPC server', { error });
            reject(error);
          } else {
            logger.info(`Notification gRPC server running on port ${port}`);
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
        logger.info('Notification gRPC server shut down');
        resolve();
      });
    });
  }
}

// Create server instance
export const notificationServer = new NotificationServer();

// Start server if run directly
if (require.main === module) {
  const port = parseInt(process.env.NOTIFICATION_SERVICE_PORT || '50055', 10);
  notificationServer.start(port).catch((error) => {
    logger.error('Failed to start server', { error });
    process.exit(1);
  });
}
