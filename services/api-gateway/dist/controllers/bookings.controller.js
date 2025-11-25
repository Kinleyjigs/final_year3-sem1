"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const grpc_clients_1 = require("@one-stop-book/grpc-clients");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
/**
 * Controller for booking-related endpoints
 * Handles booking creation, retrieval, and cancellation
 */
class BookingsController {
    /**
     * T120: POST /api/bookings
     * Create a new booking with validation and conflict detection
     */
    static async createBooking(req, res, next) {
        try {
            const { groundId, bookingDate, startTime, endTime } = req.body;
            // Get authenticated user ID from request (set by auth middleware)
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Authentication required',
                });
            }
            // Validate required fields
            if (!groundId || !bookingDate || !startTime || !endTime) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'All fields are required: groundId, bookingDate, startTime, endTime',
                });
            }
            common_1.logger.info('Creating booking', {
                userId,
                groundId,
                bookingDate,
                startTime,
                endTime,
            });
            // Call Booking Service via gRPC
            const booking = await new Promise((resolve, reject) => {
                grpc_clients_1.bookingClient.CreateBooking({
                    user_id: userId,
                    ground_id: groundId,
                    booking_date: bookingDate,
                    start_time: startTime,
                    end_time: endTime,
                }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC CreateBooking error', { error });
                        // Map gRPC error codes to HTTP status codes
                        if (error.code === 6) { // ALREADY_EXISTS
                            return reject(new common_2.ValidationError(error.message || 'Time slot is no longer available'));
                        }
                        else if (error.code === 3) { // INVALID_ARGUMENT
                            return reject(new common_2.ValidationError(error.message || 'Invalid booking data'));
                        }
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            res.status(201).json({
                message: 'Booking created successfully',
                booking,
            });
        }
        catch (error) {
            common_1.logger.error('Failed to create booking', { error });
            if (error instanceof common_2.ValidationError) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: error.message,
                });
            }
            next(new common_2.InternalError('Failed to create booking. Please try again.'));
        }
    }
    /**
     * T121: GET /api/bookings
     * Get all bookings for the authenticated user
     */
    static async getUserBookings(req, res, next) {
        try {
            // Get authenticated user ID from request (set by auth middleware)
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Authentication required',
                });
            }
            common_1.logger.info('Getting user bookings', { userId });
            // Call Booking Service via gRPC
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.bookingClient.GetUserBookings({ user_id: userId }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC GetUserBookings error', { error });
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            res.json(response);
        }
        catch (error) {
            common_1.logger.error('Failed to get user bookings', { error });
            next(new common_2.InternalError('Failed to retrieve bookings. Please try again.'));
        }
    }
    /**
     * T122: DELETE /api/bookings/:id
     * Cancel a booking with ownership verification
     */
    static async cancelBooking(req, res, next) {
        try {
            const { id: bookingId } = req.params;
            // Get authenticated user ID from request (set by auth middleware)
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Authentication required',
                });
            }
            if (!bookingId) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Booking ID is required',
                });
            }
            common_1.logger.info('Canceling booking', { userId, bookingId });
            // Call Booking Service via gRPC
            const booking = await new Promise((resolve, reject) => {
                grpc_clients_1.bookingClient.CancelBooking({
                    booking_id: bookingId,
                    user_id: userId,
                }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC CancelBooking error', { error });
                        // Map gRPC error codes to HTTP status codes
                        if (error.code === 5) { // NOT_FOUND
                            return res.status(404).json({
                                error: 'Not Found',
                                message: error.message || 'Booking not found',
                            });
                        }
                        else if (error.code === 7) { // PERMISSION_DENIED
                            return res.status(403).json({
                                error: 'Forbidden',
                                message: error.message || 'You do not have permission to cancel this booking',
                            });
                        }
                        else if (error.code === 3) { // INVALID_ARGUMENT
                            return res.status(400).json({
                                error: 'Bad Request',
                                message: error.message || 'Invalid booking cancellation request',
                            });
                        }
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            res.json({
                message: 'Booking canceled successfully',
                booking,
            });
        }
        catch (error) {
            common_1.logger.error('Failed to cancel booking', { error });
            next(new common_2.InternalError('Failed to cancel booking. Please try again.'));
        }
    }
}
exports.BookingsController = BookingsController;
//# sourceMappingURL=bookings.controller.js.map