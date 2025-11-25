"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const grpc_clients_1 = require("@one-stop-book/grpc-clients");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
/**
 * Controller for availability-related endpoints
 */
class AvailabilityController {
    /**
     * GET /api/grounds/:id/availability
     * Get availability for a ground combining bookings and maintenance windows
     */
    static async getAvailability(req, res, next) {
        try {
            const { id: groundId } = req.params;
            const { start_date, end_date } = req.query;
            if (!start_date || !end_date) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'start_date and end_date query parameters are required',
                });
            }
            common_1.logger.info('Getting ground availability', {
                groundId,
                startDate: start_date,
                endDate: end_date,
            });
            // Step 1: Fetch maintenance windows for the ground
            const maintenanceResponse = await new Promise((resolve, reject) => {
                grpc_clients_1.maintenanceClient.GetGroundMaintenance({
                    ground_id: groundId,
                    start_date: start_date,
                    end_date: end_date,
                }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC GetGroundMaintenance error', { error });
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            // Step 2: Fetch availability from Booking Service (includes booked slots)
            // Pass maintenance windows to Booking Service
            const availabilityResponse = await new Promise((resolve, reject) => {
                grpc_clients_1.bookingClient.GetAvailability({
                    ground_id: groundId,
                    start_date: start_date,
                    end_date: end_date,
                    maintenance_windows: maintenanceResponse.maintenance_windows,
                }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC GetAvailability error', { error });
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            // Step 3: Transform response to user-friendly format
            const formattedResponse = {
                ground_id: groundId,
                start_date,
                end_date,
                availability: availabilityResponse.availability.map((day) => ({
                    date: day.date,
                    slots: day.slots.map((slot) => ({
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                        status: slot.status === 0 ? 'AVAILABLE' : slot.status === 1 ? 'BOOKED' : 'MAINTENANCE',
                        booking_id: slot.booking_id,
                    })),
                })),
            };
            res.json(formattedResponse);
        }
        catch (error) {
            common_1.logger.error('Failed to get availability', { error });
            next(new common_2.InternalError('Failed to retrieve availability. Please try again.'));
        }
    }
}
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=availability.controller.js.map