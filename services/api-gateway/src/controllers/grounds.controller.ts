import { Request, Response, NextFunction } from 'express';
import { groundsClient } from '@one-stop-book/grpc-clients';
import { logger } from '@one-stop-book/common';
import { InternalError } from '@one-stop-book/common';

/**
 * Controller for grounds-related endpoints
 */
export class GroundsController {
  /**
   * GET /api/grounds - Search for grounds with optional filters
   */
  static async searchGrounds(req: Request, res: Response, next: NextFunction) {
    try {
      const { college, is_active, page, limit } = req.query;

      logger.info('Searching grounds', {
        college: college || 'all',
        is_active,
        page,
        limit,
      });

      // Call gRPC Grounds Service
      const response = await new Promise((resolve, reject) => {
        groundsClient.SearchGrounds(
          {
            college: college as string | undefined,
            is_active: is_active !== undefined ? is_active === 'true' : true,
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
          },
          (error: any, response: any) => {
            if (error) {
              logger.error('gRPC SearchGrounds error', { error });
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });

      res.json(response);
    } catch (error) {
      logger.error('Failed to search grounds', { error });
      next(new InternalError('Failed to retrieve grounds. Please try again.'));
    }
  }

  /**
   * GET /api/grounds/:id - Get a single ground by ID
   */
  static async getGround(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      logger.info('Getting ground details', { groundId: id });

      // Call gRPC Grounds Service
      const response = await new Promise((resolve, reject) => {
        groundsClient.GetGround(
          { id },
          (error: any, response: any) => {
            if (error) {
              logger.error('gRPC GetGround error', { error });
              reject(error);
            } else {
              resolve(response);
            }
          }
        );
      });

      res.json(response);
    } catch (error) {
      logger.error('Failed to get ground', { error });
      next(new InternalError('Failed to retrieve ground details. Please try again.'));
    }
  }
}
