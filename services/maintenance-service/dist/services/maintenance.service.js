"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceService = exports.MaintenanceService = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
const prisma = new client_1.PrismaClient();
/**
 * Service for managing maintenance schedules
 */
class MaintenanceService {
    /**
     * Get maintenance windows for a ground
     * Optionally filter by date range
     *
     * @param params - Parameters including ground ID and optional date range
     * @returns Array of maintenance schedules
     */
    async getGroundMaintenance(params) {
        const { groundId, startDate, endDate } = params;
        try {
            // Build filter conditions
            const where = {
                groundId,
            };
            // Add date range filter if provided
            if (startDate || endDate) {
                where.AND = [];
                if (startDate) {
                    const start = new Date(startDate);
                    if (isNaN(start.getTime())) {
                        throw new common_2.ValidationError('Invalid start date format. Use YYYY-MM-DD.');
                    }
                    // Include maintenance that ends after start date
                    where.AND.push({
                        endDateTime: {
                            gte: start,
                        },
                    });
                }
                if (endDate) {
                    const end = new Date(endDate);
                    if (isNaN(end.getTime())) {
                        throw new common_2.ValidationError('Invalid end date format. Use YYYY-MM-DD.');
                    }
                    // Set to end of day
                    end.setHours(23, 59, 59, 999);
                    // Include maintenance that starts before end date
                    where.AND.push({
                        startDateTime: {
                            lte: end,
                        },
                    });
                }
            }
            const maintenanceWindows = await prisma.maintenanceSchedule.findMany({
                where,
                orderBy: {
                    startDateTime: 'asc',
                },
            });
            common_1.logger.info('Fetched maintenance windows', {
                groundId,
                startDate,
                endDate,
                count: maintenanceWindows.length,
            });
            return maintenanceWindows.map((mw) => ({
                id: mw.id,
                groundId: mw.groundId,
                startDateTime: mw.startDateTime.toISOString(),
                endDateTime: mw.endDateTime.toISOString(),
                description: mw.description,
                createdByUserId: mw.createdByUserId,
                createdAt: mw.createdAt,
                updatedAt: mw.updatedAt,
            }));
        }
        catch (error) {
            if (error instanceof common_2.ValidationError) {
                throw error;
            }
            common_1.logger.error('Failed to get maintenance windows', { error, params });
            throw error;
        }
    }
    /**
     * Check if a time range conflicts with maintenance
     *
     * @param groundId - Ground UUID
     * @param startDateTime - ISO 8601 date-time string
     * @param endDateTime - ISO 8601 date-time string
     * @returns true if there is a conflict
     */
    async checkConflict(groundId, startDateTime, endDateTime) {
        try {
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new common_2.ValidationError('Invalid date-time format. Use ISO 8601.');
            }
            // Find overlapping maintenance windows
            const conflicts = await prisma.maintenanceSchedule.findMany({
                where: {
                    groundId,
                    AND: [
                        {
                            startDateTime: {
                                lt: end,
                            },
                        },
                        {
                            endDateTime: {
                                gt: start,
                            },
                        },
                    ],
                },
            });
            const hasConflict = conflicts.length > 0;
            if (hasConflict) {
                common_1.logger.info('Maintenance conflict detected', {
                    groundId,
                    startDateTime,
                    endDateTime,
                    conflictCount: conflicts.length,
                });
            }
            return hasConflict;
        }
        catch (error) {
            if (error instanceof common_2.ValidationError) {
                throw error;
            }
            common_1.logger.error('Failed to check maintenance conflict', {
                error,
                groundId,
                startDateTime,
                endDateTime,
            });
            throw error;
        }
    }
}
exports.MaintenanceService = MaintenanceService;
exports.maintenanceService = new MaintenanceService();
//# sourceMappingURL=maintenance.service.js.map