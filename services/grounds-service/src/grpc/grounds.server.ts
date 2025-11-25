import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { groundsService } from '../services/grounds.service';
import { logger } from '@one-stop-book/common';
import { ValidationError, NotFoundError } from '@one-stop-book/common';

// Load the proto file
const PROTO_PATH = path.join(__dirname, '../proto/grounds.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const groundsPackage = grpc.loadPackageDefinition(packageDefinition) as any;

/**
 * gRPC server implementation for Grounds Service
 */
export class GroundsServer {
  private server: grpc.Server;

  constructor() {
    this.server = new grpc.Server();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.addService(groundsPackage.grounds.GroundsService.service, {
      SearchGrounds: this.handleSearchGrounds.bind(this),
      GetGround: this.handleGetGround.bind(this),
      IsPeakTime: this.handleIsPeakTime.bind(this),
    });
  }

  /**
   * Handle SearchGrounds RPC
   */
  private async handleSearchGrounds(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { college, is_active, page, limit } = call.request;

      const result = await groundsService.searchGrounds({
        college: college || undefined,
        isActive: is_active !== undefined ? is_active : true,
        page: page || 1,
        limit: limit || 10,
      });

      // Transform to gRPC response format
      const response = {
        grounds: result.grounds.map((ground: any) => ({
          id: ground.id,
          name: ground.name,
          college: ground.college,
          location: ground.location,
          description: ground.description || '',
          capacity: ground.capacity,
          amenities: ground.amenities,
          photos: ground.photos,
          is_active: ground.isActive,
          timezone: ground.timezone,
          created_at: ground.createdAt.toISOString(),
          updated_at: ground.updatedAt.toISOString(),
        })),
        total: result.total,
        page: result.page,
        limit: result.limit,
        total_pages: result.totalPages,
      };

      callback(null, response);
    } catch (error) {
      logger.error('SearchGrounds RPC error', { error });
      
      if (error instanceof ValidationError) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while searching grounds',
        });
      }
    }
  }

  /**
   * Handle GetGround RPC
   */
  private async handleGetGround(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;

      if (!id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Ground ID is required',
        });
      }

      const ground = await groundsService.getGround(id);

      // Transform to gRPC response format
      const response = {
        id: ground.id,
        name: ground.name,
        college: ground.college,
        location: ground.location,
        description: ground.description || '',
        capacity: ground.capacity,
        amenities: ground.amenities,
        peak_hours: ground.peakHours || {},
        photos: ground.photos,
        is_active: ground.isActive,
        timezone: ground.timezone,
        admin_user_id: ground.adminUserId,
        created_at: ground.createdAt.toISOString(),
        updated_at: ground.updatedAt.toISOString(),
      };

      callback(null, response);
    } catch (error) {
      logger.error('GetGround RPC error', { error });
      
      if (error instanceof NotFoundError) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while retrieving ground',
        });
      }
    }
  }

  /**
   * Handle IsPeakTime RPC
   */
  private async handleIsPeakTime(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { ground_id, date_time } = call.request;

      if (!ground_id || !date_time) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Ground ID and date_time are required',
        });
      }

      const isPeak = await groundsService.isPeakTime(ground_id, date_time);

      callback(null, { is_peak: isPeak });
    } catch (error) {
      logger.error('IsPeakTime RPC error', { error });
      
      if (error instanceof NotFoundError) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: error.message,
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'An error occurred while checking peak time',
        });
      }
    }
  }

  /**
   * Start the gRPC server
   */
  start(port: number = 50052): Promise<void> {
    return new Promise((resolve, reject) => {
      const bindAddress = `0.0.0.0:${port}`;
      
      this.server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            logger.error('Failed to start Grounds gRPC server', { error });
            reject(error);
          } else {
            logger.info(`Grounds gRPC server running on port ${port}`);
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
        logger.info('Grounds gRPC server shut down');
        resolve();
      });
    });
  }
}

// Create server instance
export const groundsServer = new GroundsServer();

// Start server if run directly
if (require.main === module) {
  const port = parseInt(process.env.GROUNDS_SERVICE_PORT || '50052', 10);
  groundsServer.start(port).catch((error) => {
    logger.error('Failed to start server', { error });
    process.exit(1);
  });
}
