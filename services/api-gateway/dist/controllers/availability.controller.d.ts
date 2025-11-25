import { Request, Response, NextFunction } from 'express';
/**
 * Controller for availability-related endpoints
 */
export declare class AvailabilityController {
    /**
     * GET /api/grounds/:id/availability
     * Get availability for a ground combining bookings and maintenance windows
     */
    static getAvailability(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=availability.controller.d.ts.map