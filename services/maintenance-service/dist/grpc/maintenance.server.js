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
exports.maintenanceServer = exports.MaintenanceServer = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const maintenance_service_1 = require("../services/maintenance.service");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
// Load the proto file
const PROTO_PATH = path_1.default.join(__dirname, '../proto/maintenance.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const maintenancePackage = grpc.loadPackageDefinition(packageDefinition);
/**
 * gRPC server implementation for Maintenance Service
 */
class MaintenanceServer {
    constructor() {
        this.server = new grpc.Server();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.addService(maintenancePackage.maintenance.MaintenanceService.service, {
            GetGroundMaintenance: this.handleGetGroundMaintenance.bind(this),
            CheckConflict: this.handleCheckConflict.bind(this),
            // Other handlers will be added in future phases
        });
    }
    /**
     * Handle GetGroundMaintenance RPC
     */
    async handleGetGroundMaintenance(call, callback) {
        try {
            const { ground_id, start_date, end_date } = call.request;
            if (!ground_id) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Ground ID is required',
                });
            }
            const maintenanceWindows = await maintenance_service_1.maintenanceService.getGroundMaintenance({
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
        }
        catch (error) {
            common_1.logger.error('GetGroundMaintenance RPC error', { error });
            if (error instanceof common_2.ValidationError) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message,
                });
            }
            else {
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
    async handleCheckConflict(call, callback) {
        try {
            const { ground_id, start_date_time, end_date_time } = call.request;
            if (!ground_id || !start_date_time || !end_date_time) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Ground ID, start_date_time, and end_date_time are required',
                });
            }
            const hasConflict = await maintenance_service_1.maintenanceService.checkConflict(ground_id, start_date_time, end_date_time);
            callback(null, {
                has_conflict: hasConflict,
                message: hasConflict
                    ? 'Ground under maintenance during selected time.'
                    : 'No maintenance conflicts.',
                conflicting_windows: [], // Will be populated if needed
            });
        }
        catch (error) {
            common_1.logger.error('CheckConflict RPC error', { error });
            if (error instanceof common_2.ValidationError) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message,
                });
            }
            else {
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
    start(port = 50054) {
        return new Promise((resolve, reject) => {
            const bindAddress = `0.0.0.0:${port}`;
            this.server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
                if (error) {
                    common_1.logger.error('Failed to start Maintenance gRPC server', { error });
                    reject(error);
                }
                else {
                    common_1.logger.info(`Maintenance gRPC server running on port ${port}`);
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
                common_1.logger.info('Maintenance gRPC server shut down');
                resolve();
            });
        });
    }
}
exports.MaintenanceServer = MaintenanceServer;
// Create server instance
exports.maintenanceServer = new MaintenanceServer();
// Start server if run directly
if (require.main === module) {
    const port = parseInt(process.env.MAINTENANCE_SERVICE_PORT || '50054', 10);
    exports.maintenanceServer.start(port).catch((error) => {
        common_1.logger.error('Failed to start server', { error });
        process.exit(1);
    });
}
//# sourceMappingURL=maintenance.server.js.map