import { Request, Response, NextFunction } from 'express';
/**
 * Controller for booking-related endpoints
 * Handles booking creation, retrieval, and cancellation
 */
export declare class BookingsController {
    /**
     * T120: POST /api/bookings
     * Create a new booking with validation and conflict detection
     */
    static createBooking(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * T121: GET /api/bookings
     * Get all bookings for the authenticated user
     */
    static getUserBookings(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * T122: DELETE /api/bookings/:id
     * Cancel a booking with ownership verification
     */
    static cancelBooking(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=bookings.controller.d.ts.map