import { Request, Response } from 'express';
import { logger } from '@one-stop-book/common';
import { authClient } from '@one-stop-book/grpc-clients';

export class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, college } = req.body;

      logger.info('Register request received', { email, college });

      const response: any = await new Promise((resolve, reject) => {
        authClient.Register(
          {
            email,
            password,
            full_name: fullName,
            college,
          },
          (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response);
          }
        );
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.full_name,
            college: response.user.college,
            role: getRoleName(response.user.role),
            createdAt: response.user.created_at,
            updatedAt: response.user.updated_at,
          },
          token: response.token,
        },
        message: 'User registered successfully',
      });
    } catch (error: any) {
      logger.error('Register error', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.details || error.message || 'Registration failed',
      });
    }
  }

  /**
   * POST /api/auth/login
   * Login user
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      logger.info('Login request received', { email });

      const response: any = await new Promise((resolve, reject) => {
        authClient.Login(
          {
            email,
            password,
          },
          (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response);
          }
        );
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: response.user.id,
            email: response.user.email,
            fullName: response.user.full_name,
            college: response.user.college,
            role: getRoleName(response.user.role),
            createdAt: response.user.created_at,
            updatedAt: response.user.updated_at,
          },
          token: response.token,
        },
        message: 'Login successful',
      });
    } catch (error: any) {
      logger.error('Login error', { error: error.message });
      res.status(401).json({
        success: false,
        error: error.details || error.message || 'Invalid credentials',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      logger.info('Get profile request', { userId });

      const response: any = await new Promise((resolve, reject) => {
        authClient.GetUser(
          {
            user_id: userId,
          },
          (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response);
          }
        );
      });

      res.status(200).json({
        success: true,
        data: {
          id: response.id,
          email: response.email,
          fullName: response.full_name,
          college: response.college,
          role: getRoleName(response.role),
          createdAt: response.created_at,
          updatedAt: response.updated_at,
        },
      });
    } catch (error: any) {
      logger.error('Get profile error', { error: error.message });
      res.status(404).json({
        success: false,
        error: error.details || error.message || 'User not found',
      });
    }
  }

  /**
   * PATCH /api/auth/me
   * Update current user profile
   */
  static async updateMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { fullName, college } = req.body;

      logger.info('Update profile request', { userId, fullName, college });

      const response: any = await new Promise((resolve, reject) => {
        authClient.UpdateUser(
          {
            user_id: userId,
            full_name: fullName,
            college,
          },
          (error: any, response: any) => {
            if (error) reject(error);
            else resolve(response);
          }
        );
      });

      res.status(200).json({
        success: true,
        data: {
          id: response.id,
          email: response.email,
          fullName: response.full_name,
          college: response.college,
          role: getRoleName(response.role),
          createdAt: response.created_at,
          updatedAt: response.updated_at,
        },
        message: 'Profile updated successfully',
      });
    } catch (error: any) {
      logger.error('Update profile error', { error: error.message });
      res.status(400).json({
        success: false,
        error: error.details || error.message || 'Update failed',
      });
    }
  }
}

/**
 * Convert role enum to string
 */
function getRoleName(role: number): string {
  const roleMap: Record<number, string> = {
    0: 'VISITOR',
    1: 'USER',
    2: 'ADMIN',
  };
  return roleMap[role] || 'UNKNOWN';
}
