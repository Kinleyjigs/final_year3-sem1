import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * POST /api/auth/register
     * Register a new user
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/auth/login
     * Login user
     */
    static login(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/auth/me
     * Get current user profile
     */
    static getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PATCH /api/auth/me
     * Update current user profile
     */
    static updateMe(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=auth.controller.d.ts.map