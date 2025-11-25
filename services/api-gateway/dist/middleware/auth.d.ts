import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
        college: string;
    };
}
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export declare function requireRole(allowedRoles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map