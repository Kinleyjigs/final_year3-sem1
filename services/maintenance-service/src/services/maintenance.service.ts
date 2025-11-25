import { PrismaClient } from '@prisma/client';
import { logger } from '@one-stop-book/common';
import { ValidationError } from '@one-stop-book/common';

const prisma = new PrismaClient();

export interface GetGroundMaintenanceParams {
  groundId: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface MaintenanceSchedule {
  id: string;
  groundId: string;
  startDateTime: string;
  endDateTime: string;
  description: string;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for managing maintenance schedules
 */
export class MaintenanceService {
  /**
   * Get maintenance windows for a ground
   * Optionally filter by date range
   * 
   * @param params - Parameters including ground ID and optional date range
   * @returns Array of maintenance schedules
   */
  async getGroundMaintenance(params: GetGroundMaintenanceParams): Promise<MaintenanceSchedule[]> {
    const { groundId, startDate, endDate } = params;

    try {
      // Build filter conditions
      const where: any = {
        groundId,
      };

      // Add date range filter if provided
      if (startDate || endDate) {
        where.AND = [];
        
        if (startDate) {
          const start = new Date(startDate);
          if (isNaN(start.getTime())) {
            throw new ValidationError('Invalid start date format. Use YYYY-MM-DD.');
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
            throw new ValidationError('Invalid end date format. Use YYYY-MM-DD.');
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

      logger.info('Fetched maintenance windows', {
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
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Failed to get maintenance windows', { error, params });
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
  async checkConflict(
    groundId: string,
    startDateTime: string,
    endDateTime: string
  ): Promise<boolean> {
    try {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ValidationError('Invalid date-time format. Use ISO 8601.');
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
        logger.info('Maintenance conflict detected', {
          groundId,
          startDateTime,
          endDateTime,
          conflictCount: conflicts.length,
        });
      }

      return hasConflict;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Failed to check maintenance conflict', {
        error,
        groundId,
        startDateTime,
        endDateTime,
      });
      throw error;
    }
  }
}

export const maintenanceService = new MaintenanceService();
