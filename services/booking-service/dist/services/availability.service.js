"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityService = exports.AvailabilityService = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
const prisma = new client_1.PrismaClient();
/**
 * Service for calculating ground availability combining bookings and maintenance
 */
class AvailabilityService {
    /**
     * Get availability for a ground across a date range
     * This method combines booking data and maintenance windows to determine
     * which time slots are available, booked, or under maintenance
     *
     * @param params - Parameters including ground ID, date range, and maintenance windows
     * @returns Array of daily availability with time slots
     */
    async getAvailability(params) {
        const { groundId, startDate, endDate, maintenanceWindows = [] } = params;
        // Validate date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_2.ValidationError('Invalid date format. Use YYYY-MM-DD.');
        }
        if (start > end) {
            throw new common_2.ValidationError('Start date must be before or equal to end date.');
        }
        // Limit range to 31 days to prevent excessive queries
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 31) {
            throw new common_2.ValidationError('Date range cannot exceed 31 days.');
        }
        try {
            // Fetch all bookings for the ground in the date range
            const bookings = await prisma.booking.findMany({
                where: {
                    groundId,
                    bookingDate: {
                        gte: start,
                        lte: end,
                    },
                    status: {
                        in: ['PENDING', 'APPROVED'], // Only consider active bookings
                    },
                },
                select: {
                    id: true,
                    bookingDate: true,
                    startTime: true,
                    endTime: true,
                },
                orderBy: [
                    { bookingDate: 'asc' },
                    { startTime: 'asc' },
                ],
            });
            common_1.logger.info('Fetched bookings for availability', {
                groundId,
                startDate,
                endDate,
                bookingCount: bookings.length,
                maintenanceCount: maintenanceWindows.length,
            });
            // Generate availability for each day
            const availability = [];
            const currentDate = new Date(start);
            while (currentDate <= end) {
                const dateStr = this.formatDate(currentDate);
                const dayBookings = bookings.filter((b) => this.formatDate(b.bookingDate) === dateStr);
                const dayAvailability = this.generateDayAvailability(dateStr, dayBookings, maintenanceWindows);
                availability.push(dayAvailability);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return availability;
        }
        catch (error) {
            if (error instanceof common_2.ValidationError) {
                throw error;
            }
            common_1.logger.error('Failed to get availability', { error, params });
            throw error;
        }
    }
    /**
     * Generate availability for a single day
     */
    generateDayAvailability(date, bookings, maintenanceWindows) {
        // Define operating hours (6:00 AM to 10:00 PM)
        const slots = [];
        const operatingHours = {
            start: 6, // 6:00 AM
            end: 22, // 10:00 PM
        };
        // Generate hourly slots
        for (let hour = operatingHours.start; hour < operatingHours.end; hour++) {
            const startTime = this.formatTime(hour, 0);
            const endTime = this.formatTime(hour + 1, 0);
            const slot = this.determineSlotStatus(date, startTime, endTime, bookings, maintenanceWindows);
            slots.push(slot);
        }
        return { date, slots };
    }
    /**
     * Determine the status of a time slot
     */
    determineSlotStatus(date, startTime, endTime, bookings, maintenanceWindows) {
        // Check if slot overlaps with maintenance
        const hasMaintenance = maintenanceWindows.some((mw) => {
            return this.overlapsWithMaintenance(date, startTime, endTime, mw);
        });
        if (hasMaintenance) {
            return {
                startTime,
                endTime,
                status: 'MAINTENANCE',
            };
        }
        // Check if slot overlaps with bookings
        const overlappingBooking = bookings.find((booking) => {
            const bookingStart = this.timeStringToMinutes(booking.startTime);
            const bookingEnd = this.timeStringToMinutes(booking.endTime);
            const slotStart = this.timeStringToMinutes(startTime);
            const slotEnd = this.timeStringToMinutes(endTime);
            // Slots overlap if they share any time
            return slotStart < bookingEnd && slotEnd > bookingStart;
        });
        if (overlappingBooking) {
            return {
                startTime,
                endTime,
                status: 'BOOKED',
                bookingId: overlappingBooking.id,
            };
        }
        // Slot is available
        return {
            startTime,
            endTime,
            status: 'AVAILABLE',
        };
    }
    /**
     * Check if a time slot overlaps with a maintenance window
     */
    overlapsWithMaintenance(date, startTime, endTime, maintenance) {
        const slotStart = new Date(`${date}T${startTime}:00`);
        const slotEnd = new Date(`${date}T${endTime}:00`);
        const mwStart = new Date(maintenance.startDateTime);
        const mwEnd = new Date(maintenance.endDateTime);
        // Check if slot overlaps with maintenance window
        return slotStart < mwEnd && slotEnd > mwStart;
    }
    /**
     * Convert time string (HH:MM or Time object) to minutes since midnight
     */
    timeStringToMinutes(time) {
        let timeStr;
        if (time instanceof Date) {
            timeStr = time.toTimeString().substring(0, 5); // Extract HH:MM
        }
        else {
            timeStr = time;
        }
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    /**
     * Format date as YYYY-MM-DD
     */
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    /**
     * Format time as HH:MM
     */
    formatTime(hours, minutes) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
}
exports.AvailabilityService = AvailabilityService;
exports.availabilityService = new AvailabilityService();
//# sourceMappingURL=availability.service.js.map