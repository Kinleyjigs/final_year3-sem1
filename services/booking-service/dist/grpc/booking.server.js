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
exports.bookingServer = exports.BookingServer = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const availability_service_1 = require("../services/availability.service");
const booking_service_1 = require("../services/booking.service");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
// Load the proto file
const PROTO_PATH = path_1.default.join(__dirname, '../proto/booking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const bookingPackage = grpc.loadPackageDefinition(packageDefinition);
/**
 * gRPC server implementation for Booking Service
 */
class BookingServer {
    constructor() {
        this.server = new grpc.Server();
        this.setupHandlers();
    }
    setupHandlers() {
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
    async handleGetAvailability(call, callback) {
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
            const availability = await availability_service_1.availabilityService.getAvailability({
                groundId: ground_id,
                startDate: start_date,
                endDate: end_date,
                maintenanceWindows: maintenanceWindows.map((mw) => ({
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
        }
        catch (error) {
            common_1.logger.error('GetAvailability RPC error', { error });
            if (error instanceof common_2.ValidationError) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message,
                });
            }
            else {
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
    async handleCreateBooking(call, callback) {
        try {
            const { user_id, ground_id, booking_date, start_time, end_time } = call.request;
            if (!user_id || !ground_id || !booking_date || !start_time || !end_time) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'All fields are required: user_id, ground_id, booking_date, start_time, end_time',
                });
            }
            const booking = await booking_service_1.bookingService.createBooking({
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
        }
        catch (error) {
            common_1.logger.error('CreateBooking RPC error', { error });
            if (error instanceof common_2.ConflictError) {
                callback({
                    code: grpc.status.ALREADY_EXISTS,
                    message: error.message,
                });
            }
            else if (error instanceof common_2.ValidationError) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message,
                });
            }
            else {
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
    async handleCheckConflict(call, callback) {
        try {
            const { ground_id, booking_date, start_time, end_time } = call.request;
            if (!ground_id || !booking_date || !start_time || !end_time) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'All fields are required: ground_id, booking_date, start_time, end_time',
                });
            }
            const hasConflict = await booking_service_1.bookingService.checkConflict({
                userId: '', // Not needed for conflict check
                groundId: ground_id,
                bookingDate: new Date(booking_date),
                startTime: start_time,
                endTime: end_time,
            });
            callback(null, { has_conflict: hasConflict });
        }
        catch (error) {
            common_1.logger.error('CheckConflict RPC error', { error });
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
    async handleGetUserBookings(call, callback) {
        try {
            const { user_id } = call.request;
            if (!user_id) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'User ID is required',
                });
            }
            const bookings = await booking_service_1.bookingService.getUserBookings(user_id);
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
        }
        catch (error) {
            common_1.logger.error('GetUserBookings RPC error', { error });
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
    async handleCancelBooking(call, callback) {
        try {
            const { booking_id, user_id } = call.request;
            if (!booking_id || !user_id) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Booking ID and User ID are required',
                });
            }
            const booking = await booking_service_1.bookingService.cancelBooking({
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
        }
        catch (error) {
            common_1.logger.error('CancelBooking RPC error', { error });
            if (error instanceof common_2.NotFoundError) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: error.message,
                });
            }
            else if (error instanceof common_2.UnauthorizedError) {
                callback({
                    code: grpc.status.PERMISSION_DENIED,
                    message: error.message,
                });
            }
            else if (error instanceof common_2.ValidationError) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: error.message,
                });
            }
            else {
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
    start(port = 50053) {
        return new Promise((resolve, reject) => {
            const bindAddress = `0.0.0.0:${port}`;
            this.server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
                if (error) {
                    common_1.logger.error('Failed to start Booking gRPC server', { error });
                    reject(error);
                }
                else {
                    common_1.logger.info(`Booking gRPC server running on port ${port}`);
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
                common_1.logger.info('Booking gRPC server shut down');
                resolve();
            });
        });
    }
}
exports.BookingServer = BookingServer;
// Create server instance
exports.bookingServer = new BookingServer();
// Start server if run directly
if (require.main === module) {
    const port = parseInt(process.env.BOOKING_SERVICE_PORT || '50053', 10);
    exports.bookingServer.start(port).catch((error) => {
        common_1.logger.error('Failed to start server', { error });
        process.exit(1);
    });
}
//# sourceMappingURL=booking.server.js.map