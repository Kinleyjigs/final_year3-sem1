"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeakHoursService = void 0;
const common_1 = require("@one-stop-book/common");
class PeakHoursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * T114: Check if a given datetime falls within peak hours for a ground
     * Parses JSONB peakHours field, matches day of week, checks time range
     */
    async isPeakTime(groundId, dateTime) {
        // 1. Get ground with peak hours configuration
        const ground = await this.prisma.ground.findUnique({
            where: { id: groundId },
            select: { peakHours: true, timezone: true },
        });
        if (!ground) {
            throw new common_1.ValidationError('Ground not found');
        }
        // 2. If no peak hours configured, return false
        if (!ground.peakHours || typeof ground.peakHours !== 'object') {
            return false;
        }
        const peakHoursConfig = ground.peakHours;
        // If empty object, return false
        if (Object.keys(peakHoursConfig).length === 0) {
            return false;
        }
        // 3. Get day of week from dateTime (convert to ground's timezone if needed)
        const dayNames = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ];
        // For timezone support, you would use a library like date-fns-tz
        // For now, using local time
        const dayOfWeek = dayNames[dateTime.getDay()];
        // 4. Check if this day has peak hours defined
        const dayPeakHours = peakHoursConfig[dayOfWeek];
        if (!dayPeakHours || !Array.isArray(dayPeakHours)) {
            return false;
        }
        // 5. Extract time from dateTime
        const timeString = this.formatTime(dateTime);
        // 6. Check if time falls within any peak hour range for this day
        for (const timeRange of dayPeakHours) {
            if (this.isTimeInRange(timeString, timeRange)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Format date to HH:MM string
     */
    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    /**
     * Check if a time falls within a time range
     * @param time - Time string in HH:MM format (e.g., "19:00")
     * @param range - Range string in HH:MM-HH:MM format (e.g., "18:00-20:00")
     */
    isTimeInRange(time, range) {
        try {
            const [startTime, endTime] = range.split('-');
            if (!startTime || !endTime) {
                return false; // Invalid range format
            }
            const timeMinutes = this.timeToMinutes(time);
            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = this.timeToMinutes(endTime);
            // Handle overnight ranges (e.g., "22:00-02:00")
            if (endMinutes < startMinutes) {
                // Time wraps around midnight
                return timeMinutes >= startMinutes || timeMinutes < endMinutes;
            }
            // Normal range (start < end)
            return timeMinutes >= startMinutes && timeMinutes < endMinutes;
        }
        catch (_error) {
            return false; // Invalid format, treat as not in range
        }
    }
    /**
     * Convert time string (HH:MM) to minutes since midnight
     */
    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    /**
     * Get peak hours configuration for a ground
     */
    async getPeakHours(groundId) {
        const ground = await this.prisma.ground.findUnique({
            where: { id: groundId },
            select: { peakHours: true },
        });
        if (!ground || !ground.peakHours) {
            return null;
        }
        return ground.peakHours;
    }
    /**
     * Update peak hours configuration for a ground
     * (Admin functionality)
     */
    async updatePeakHours(groundId, peakHours) {
        // Validate format
        this.validatePeakHoursConfig(peakHours);
        await this.prisma.ground.update({
            where: { id: groundId },
            data: { peakHours },
        });
    }
    /**
     * Validate peak hours configuration format
     */
    validatePeakHoursConfig(config) {
        const validDays = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ];
        for (const [day, ranges] of Object.entries(config)) {
            if (!validDays.includes(day.toLowerCase())) {
                throw new common_1.ValidationError(`Invalid day: ${day}. Must be one of: ${validDays.join(', ')}`);
            }
            if (!Array.isArray(ranges)) {
                throw new common_1.ValidationError(`Peak hours for ${day} must be an array of time ranges`);
            }
            for (const range of ranges) {
                if (!this.isValidTimeRange(range)) {
                    throw new common_1.ValidationError(`Invalid time range format: ${range}. Expected format: HH:MM-HH:MM`);
                }
            }
        }
    }
    /**
     * Validate time range format (HH:MM-HH:MM)
     */
    isValidTimeRange(range) {
        const timeRangeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRangeRegex.test(range);
    }
}
exports.PeakHoursService = PeakHoursService;
//# sourceMappingURL=peak-hours.service.js.map