import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { maintenanceService } from '../services/maintenance.service';
import { logger } from '@one-stop-book/common';
import { ValidationError } from '@one-stop-book/common';

// Load the proto file
const PROTO_PATH = path.join(__dirname, '../proto/maintenance.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const maintenancePackage = grpc.loadPackageDefinition(packageDefinition) as any;

/**
 * gRPC server implementation for Maintenance Service
 */
export class MaintenanceServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.addService(maintenancePackage.maintenance.MaintenanceService.service, {
      GetGroundMaintenance: this.handleGetGroundMaintenance.bind(this),
      CheckConflict: this.handleCheckConflict.bind(this),
      // Other handlers will be added in future phases
    });
  }

  /**
   * Handle GetGroundMaintenance RPC
   */
  private async handleGetGroundMaintenance(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { ground_id, start_date, end_date } = call.request;

      if (!ground_id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Ground ID is required',
        });
      }

      const maintenanceWindows = await maintenanceService.getGroundMaintenance({
        groundId: ground_id,
        startDate: start_date,
        endDate: end_date,
      });

      // Transform to gRPC response format
      const response = {
        maintenance_windows: maintenanceWindows.map((mw) => ({
          id: mw.id,
          ground_id: mw.groundId,
          ground_name: '', // Will be populated by API Gateway if needed
          start_date_time: mw.startDateTime,
          end_date_time: mw.endDateTime,
          description: mw.description,
          created_by_user_id: mw.createdByUserId,
          created_at: mw.createdAt.toISOString(),
          updated_at: mw.updatedAt.toISOString(),
        })),
      };

      callback(null, response);
    } catch (error) {
      logger.error('GetGroundMaintenance RPC error', { error });

      if (error instanceof ValidationError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while retrieving maintenance windows',
        });
      }
    }
  }

  /**
   * Handle CheckConflict RPC
   */
  private async handleCheckConflict(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { ground_id, start_date_time, end_date_time } = call.request;

      if (!ground_id || !start_date_time || !end_date_time) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Ground ID, start_date_time, and end_date_time are required',
        });
      }

      const hasConflict = await maintenanceService.checkConflict(
        ground_id,
        start_date_time,
        end_date_time
      );

      callback(null, {
        has_conflict: hasConflict,
        message: hasConflict
          ? 'Ground under maintenance during selected time.'
          : 'No maintenance conflicts.',
        conflicting_windows: [], // Will be populated if needed
      });
    } catch (error) {
      logger.error('CheckConflict RPC error', { error });

      if (error instanceof ValidationError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while checking maintenance conflicts',
        });
      }
    }
  }

  /**
   * Start the gRPC server
   */
  start(port: number = 50054): Promise<void> {
    return new Promise((resolve, reject) => {
      const bindAddress = `0.0.0.0:${port}`;

      this.server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            logger.error('Failed to start Maintenance gRPC server', { error });
            reject(error);
          } else {
            logger.info(`Maintenance gRPC server running on port ${port}`);
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
        logger.info('Maintenance gRPC server shut down');
        resolve();
      });
    });
  }
}

// Create server instance
export const maintenanceServer = new MaintenanceServer();

// Start server if run directly
if (require.main === module) {
  const port = parseInt(process.env.MAINTENANCE_SERVICE_PORT || '50054', 10);
  maintenanceServer.start(port).catch((error) => {
    logger.error('Failed to start server', { error });
    process.exit(1);
  });
}
