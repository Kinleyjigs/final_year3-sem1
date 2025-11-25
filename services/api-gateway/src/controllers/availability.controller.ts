import { Request, Response, NextFunction } from 'express';
import { bookingClient, maintenanceClient } from '@one-stop-book/grpc-clients';
import { logger } from '@one-stop-book/common';
import { InternalError } from '@one-stop-book/common';
import type {
  GetAvailabilityRequest,
  GetAvailabilityResponse,
} from '@one-stop-book/grpc-clients';
import type {
  GetGroundMaintenanceRequest,
  GetGroundMaintenanceResponse,
} from '@one-stop-book/grpc-clients';

/**
 * Controller for availability-related endpoints
 */
export class AvailabilityController {
  /**
   * GET /api/grounds/:id/availability
   * Get availability for a ground combining bookings and maintenance windows
   */
  static async getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: groundId } = req.params;
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'start_date and end_date query parameters are required',
        });
      }

      logger.info('Getting ground availability', {
        groundId,
        startDate: start_date,
        endDate: end_date,
      });

      // Step 1: Fetch maintenance windows for the ground
      const maintenanceClientTyped = maintenanceClient as any;
      const maintenanceResponse: GetGroundMaintenanceResponse = await new Promise(
        (resolve, reject) => {
          maintenanceClientTyped.GetGroundMaintenance(
            {
              ground_id: groundId,
              start_date: start_date as string,
              end_date: end_date as string,
            } as GetGroundMaintenanceRequest,
            (error: any, response: any) => {
              if (error) {
                logger.error('gRPC GetGroundMaintenance error', { error });
                reject(error);
              } else {
                resolve(response);
              }
            }
          );
        }
      );

      // Step 2: Fetch availability from Booking Service (includes booked slots)
      // Pass maintenance windows to Booking Service
      const bookingClientTyped = bookingClient as any;
      const availabilityResponse: GetAvailabilityResponse = await new Promise(
        (resolve, reject) => {
          bookingClientTyped.GetAvailability(
            {
              ground_id: groundId,
              start_date: start_date as string,
              end_date: end_date as string,
              maintenance_windows: maintenanceResponse.maintenance_windows,
            } as GetAvailabilityRequest,
            (error: any, response: any) => {
              if (error) {
                logger.error('gRPC GetAvailability error', { error });
                reject(error);
              } else {
                resolve(response);
              }
            }
          );
        }
      );

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
    } catch (error) {
      logger.error('Failed to get availability', { error });
      next(
        new InternalError(
          'Failed to retrieve availability. Please try again.'
        )
      );
    }
  }
}
