"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundsServer = exports.GroundsServer = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const grounds_service_1 = require("../services/grounds.service");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
// Load the proto file
const PROTO_PATH = path_1.default.join(__dirname, '../proto/grounds.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const groundsPackage = grpc.loadPackageDefinition(packageDefinition);
/**
 * gRPC server implementation for Grounds Service
 */
class GroundsServer {
    constructor() {
        this.server = new grpc.Server();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.addService(groundsPackage.grounds.GroundsService.service, {
            SearchGrounds: this.handleSearchGrounds.bind(this),
            GetGround: this.handleGetGround.bind(this),
            IsPeakTime: this.handleIsPeakTime.bind(this),
        });
    }
    /**
     * Handle SearchGrounds RPC
     */
    async handleSearchGrounds(call, callback) {
        try {
            const { college, is_active, page, limit } = call.request;
            const result = await grounds_service_1.groundsService.searchGrounds({
                college: college || undefined,
                isActive: is_active !== undefined ? is_active : true,
                page: page || 1,
                limit: limit || 10,
            });
            // Transform to gRPC response format
            const response = {
                grounds: result.grounds.map((ground) => ({
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
        }
        catch (error) {
            common_1.logger.error('SearchGrounds RPC error', { error });
            if (error instanceof common_2.ValidationError) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message,
                });
            }
            else {
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
    async handleGetGround(call, callback) {
        try {
            const { id } = call.request;
            if (!id) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Ground ID is required',
                });
            }
            const ground = await grounds_service_1.groundsService.getGround(id);
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
        }
        catch (error) {
            common_1.logger.error('GetGround RPC error', { error });
            if (error instanceof common_2.NotFoundError) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message,
                });
            }
            else {
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
    async handleIsPeakTime(call, callback) {
        try {
            const { ground_id, date_time } = call.request;
            if (!ground_id || !date_time) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Ground ID and date_time are required',
                });
            }
            const isPeak = await grounds_service_1.groundsService.isPeakTime(ground_id, date_time);
            callback(null, { is_peak: isPeak });
        }
        catch (error) {
            common_1.logger.error('IsPeakTime RPC error', { error });
            if (error instanceof common_2.NotFoundError) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message,
                });
            }
            else {
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
    start(port = 50052) {
        return new Promise((resolve, reject) => {
            const bindAddress = `0.0.0.0:${port}`;
            this.server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
                if (error) {
                    common_1.logger.error('Failed to start Grounds gRPC server', { error });
                    reject(error);
                }
                else {
                    common_1.logger.info(`Grounds gRPC server running on port ${port}`);
                    resolve();
                }
            });
        });
    }
    /**
     * Gracefully shutdown the server
     */
    shutdown() {
        return new Promise((resolve) => {
            this.server.tryShutdown(() => {
                common_1.logger.info('Grounds gRPC server shut down');
                resolve();
            });
        });
    }
}
exports.GroundsServer = GroundsServer;
// Create server instance
exports.groundsServer = new GroundsServer();
// Start server if run directly
if (require.main === module) {
    const port = parseInt(process.env.GROUNDS_SERVICE_PORT || '50052', 10);
    exports.groundsServer.start(port).catch((error) => {
        common_1.logger.error('Failed to start server', { error });
        process.exit(1);
    });
}
//# sourceMappingURL=grounds.server.js.map