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
exports.notificationServer = exports.NotificationServer = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const notification_service_1 = require("../services/notification.service");
const common_1 = require("@one-stop-book/common");
// Load the proto file
const PROTO_PATH = path_1.default.join(__dirname, '../proto/notification.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const notificationPackage = grpc.loadPackageDefinition(packageDefinition);
/**
 * T126: gRPC server implementation for Notification Service
 */
class NotificationServer {
    constructor() {
        this.server = new grpc.Server();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.addService(notificationPackage.notification.NotificationService.service, {
            SendBookingConfirmation: this.handleSendBookingConfirmation.bind(this),
            SendBookingCancellation: this.handleSendBookingCancellation.bind(this),
        });
    }
    /**
     * T126: Handle SendBookingConfirmation RPC
     */
    async handleSendBookingConfirmation(call, callback) {
        try {
            const { user_name, user_email, ground_name, college, location, booking_date, start_time, end_time, confirmation_code, status, } = call.request;
            common_1.logger.info('SendBookingConfirmation RPC called', {
                userEmail: user_email,
                confirmationCode: confirmation_code,
            });
            const success = await notification_service_1.notificationService.sendBookingConfirmation({
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
        }
        catch (error) {
            common_1.logger.error('SendBookingConfirmation RPC error', { error });
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to send booking confirmation',
            });
        }
    }
    /**
     * Handle SendBookingCancellation RPC
     */
    async handleSendBookingCancellation(call, callback) {
        try {
            const { user_name, user_email, ground_name, college, location, booking_date, start_time, end_time, confirmation_code, } = call.request;
            const success = await notification_service_1.notificationService.sendBookingCancellation({
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
        }
        catch (error) {
            common_1.logger.error('SendBookingCancellation RPC error', { error });
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to send cancellation notification',
            });
        }
    }
    /**
     * Start the gRPC server
     */
    start(port = 50055) {
        return new Promise((resolve, reject) => {
            const bindAddress = `0.0.0.0:${port}`;
            this.server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
                if (error) {
                    common_1.logger.error('Failed to start Notification gRPC server', { error });
                    reject(error);
                }
                else {
                    common_1.logger.info(`Notification gRPC server running on port ${port}`);
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
                common_1.logger.info('Notification gRPC server shut down');
                resolve();
            });
        });
    }
}
exports.NotificationServer = NotificationServer;
// Create server instance
exports.notificationServer = new NotificationServer();
// Start server if run directly
if (require.main === module) {
    const port = parseInt(process.env.NOTIFICATION_SERVICE_PORT || '50055', 10);
    exports.notificationServer.start(port).catch((error) => {
        common_1.logger.error('Failed to start server', { error });
        process.exit(1);
    });
}
//# sourceMappingURL=notification.server.js.map