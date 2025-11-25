import { Request, Response, NextFunction } from 'express';
import { groundsClient } from '@one-stop-book/grpc-clients';
import { logger } from '@one-stop-book/common';
import { InternalError, NotFoundError, UnauthorizedError } from '@one-stop-book/common';

/**
 * Controller for admin grounds-related endpoints
 */
export class AdminGroundsController {
  /**
   * POST /api/admin/grounds - Create a new ground
   */
  static async createGround(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const {
        name,
        college,
        location,
        description,
        capacity,
        amenities,
        photos,
        timezone,
      } = req.body;

      logger.info('Creating ground', {
        name,
        college,
        adminUserId: user.userId,
      });

      // Call gRPC Grounds Service
      const response = await new Promise((resolve, reject) => {
        groundsClient.CreateGround(
          {
            name,
            college,
            location,
            description,
            capacity,
            amenities: amenities || [],
            photos: photos || [],
            admin_user_id: user.userId,
            timezone: timezone || 'Asia/Thimphu',
          },
          (error: any, response: any) => {
            if (error) {
              logger.error('gRPC CreateGround error', { error });
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });

      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create ground', { error });
      next(new InternalError('Failed to create ground. Please try again.'));
    }
  }

  /**
   * PUT /api/admin/grounds/:id - Update an existing ground
   */
  static async updateGround(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const { id } = req.params;
      const {
        name,
        location,
        description,
        capacity,
        amenities,
        photos,
      } = req.body;

      logger.info('Updating ground', {
        groundId: id,
        adminUserId: user.userId,
      });

      // Call gRPC Grounds Service
      const response = await new Promise((resolve, reject) => {
        groundsClient.UpdateGround(
          {
            id,
            name,
            location,
            description,
            capacity,
            amenities,
            photos,
            admin_user_id: user.userId,
          },
          (error: any, response: any) => {
            if (error) {
              logger.error('gRPC UpdateGround error', { error });
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });

      res.json(response);
    } catch (error) {
      logger.error('Failed to update ground', { error });
      next(new InternalError('Failed to update ground. Please try again.'));
    }
  }

  /**
   * DELETE /api/admin/grounds/:id - Deactivate a ground
   */
  static async deactivateGround(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const { id } = req.params;

      logger.info('Deactivating ground', {
        groundId: id,
        adminUserId: user.userId,
      });

      // Call gRPC Grounds Service
      const response = await new Promise((resolve, reject) => {
        groundsClient.DeactivateGround(
          {
            id,
            admin_user_id: user.userId,
          },
          (error: any, response: any) => {
            if (error) {
              logger.error('gRPC DeactivateGround error', { error });
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });

      res.json(response);
    } catch (error) {
      logger.error('Failed to deactivate ground', { error });
      next(new InternalError('Failed to deactivate ground. Please try again.'));
    }
  }

  /**
   * GET /api/admin/grounds/college/:college - Get grounds by college for admin
   */
  static async getGroundsByCollege(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const { college } = req.params;

      logger.info('Getting grounds by college', {
        college,
        adminUserId: user.userId,
      });

      // Call gRPC Grounds Service
      const response = await new Promise((resolve, reject) => {
        groundsClient.GetGroundsByCollege(
          {
            college,
            admin_user_id: user.userId,
          },
          (error: any, response: any) => {
            if (error) {
              logger.error('gRPC GetGroundsByCollege error', { error });
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });

      res.json(response);
    } catch (error) {
      logger.error('Failed to get grounds by college', { error });
      next(new InternalError('Failed to retrieve grounds. Please try again.'));
    }
  }
}
