"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundsService = exports.GroundsService = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
const prisma = new client_1.PrismaClient();
class GroundsService {
    /**
     * Search for grounds with optional filters and pagination
     * @param params - Search parameters (college, isActive, page, limit)
     * @returns Paginated list of grounds
     */
    async searchGrounds(params) {
        const { college, isActive = true, // Default to active grounds only
        page = 1, limit = 10, } = params;
        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            throw new common_2.ValidationError('Invalid pagination parameters');
        }
        // Build filter conditions
        const where = {
            isActive,
            ...(college && { college }),
        };
        try {
            // Execute count and find in parallel for better performance
            const [total, grounds] = await Promise.all([
                prisma.ground.count({ where }),
                prisma.ground.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: [
                        { college: 'asc' },
                        { name: 'asc' },
                    ],
                    select: {
                        id: true,
                        name: true,
                        college: true,
                        location: true,
                        description: true,
                        capacity: true,
                        amenities: true,
                        photos: true,
                        isActive: true,
                        timezone: true,
                        createdAt: true,
                        updatedAt: true,
                        // Exclude peakHours from search results for performance
                    },
                }),
            ]);
            const totalPages = Math.ceil(total / limit);
            common_1.logger.info('Ground search executed', {
                filters: { college, isActive },
                pagination: { page, limit },
                resultsCount: grounds.length,
                totalCount: total,
            });
            return {
                grounds,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            common_1.logger.error('Failed to search grounds', { error, params });
            throw error;
        }
    }
    /**
     * Get a single ground by ID with full details
     * @param id - Ground UUID
     * @returns Ground details including peak hours
     */
    async getGround(id) {
        try {
            const ground = await prisma.ground.findUnique({
                where: { id },
            });
            if (!ground) {
                throw new common_2.NotFoundError('Ground not found. Please check the ID and try again.');
            }
            common_1.logger.info('Ground retrieved', { groundId: id });
            return ground;
        }
        catch (error) {
            if (error instanceof common_2.NotFoundError) {
                throw error;
            }
            common_1.logger.error('Failed to retrieve ground', { error, groundId: id });
            throw error;
        }
    }
    /**
     * Check if a given time slot falls within peak hours for a ground
     * @param groundId - Ground UUID
     * @param dateTime - ISO 8601 date-time string
     * @returns true if the time is during peak hours
     */
    async isPeakTime(groundId, dateTime) {
        try {
            const ground = await this.getGround(groundId);
            if (!ground.peakHours || Object.keys(ground.peakHours).length === 0) {
                // No peak hours defined means all times are non-peak
                return false;
            }
            const dt = new Date(dateTime);
            const dayOfWeek = dt.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const timeString = dt.toTimeString().substring(0, 5); // HH:MM format
            const peakHoursForDay = ground.peakHours[dayOfWeek];
            if (!peakHoursForDay || !Array.isArray(peakHoursForDay)) {
                return false;
            }
            // Check if time falls within any peak hour range for this day
            for (const range of peakHoursForDay) {
                if (timeString >= range.start && timeString < range.end) {
                    common_1.logger.info('Peak time detected', { groundId, dateTime, dayOfWeek, timeString });
                    return true;
                }
            }
            return false;
        }
        catch (error) {
            common_1.logger.error('Failed to check peak time', { error, groundId, dateTime });
            throw error;
        }
    }
}
exports.GroundsService = GroundsService;
exports.groundsService = new GroundsService();
//# sourceMappingURL=grounds.service.js.map