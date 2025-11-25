import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to validate registration input
 */
export declare function validateRegistration(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware to validate login input
 */
export declare function validateLogin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware to validate profile update input
 */
export declare function validateProfileUpdate(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.validation.d.ts.map