import { Request, Response, NextFunction } from 'express';
export declare enum UserRole {
    VISITOR = "VISITOR",
    USER = "USER",
    ADMIN = "ADMIN"
}
/**
 * Middleware to require USER or ADMIN role
 */
export declare function requireUser(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware to require ADMIN role
 */
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware to require specific college for admin actions
 * Ensures admin can only manage resources for their own college
 */
export declare function requireSameCollege(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user is accessing their own resource
 */
export declare function requireSelfOrAdmin(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=rbac.d.ts.map