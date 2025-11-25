import { Request, Response, NextFunction } from 'express';
/**
 * Controller for grounds-related endpoints
 */
export declare class GroundsController {
    /**
     * GET /api/grounds - Search for grounds with optional filters
     */
    static searchGrounds(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/grounds/:id - Get a single ground by ID
     */
    static getGround(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=grounds.controller.d.ts.map