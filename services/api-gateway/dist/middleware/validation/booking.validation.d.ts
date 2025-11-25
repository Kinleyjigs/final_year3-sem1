import { Request, Response, NextFunction } from 'express';
/**
 * T123: Validation middleware for booking endpoints
 * Validates booking creation and cancellation requests
 */
/**
 * Validate POST /api/bookings request body
 */
export declare function validateCreateBooking(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Validate DELETE /api/bookings/:id - booking ID parameter
 */
export declare function validateBookingId(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=booking.validation.d.ts.map