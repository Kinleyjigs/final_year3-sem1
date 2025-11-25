import { Request, Response, NextFunction } from 'express';
/**
 * Validation middleware for availability endpoints
 */
/**
 * Validate GET /api/grounds/:id/availability query parameters
 */
export declare function validateAvailabilityQuery(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Validate ground ID parameter (UUID format)
 */
export declare function validateGroundId(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=availability.validation.d.ts.map