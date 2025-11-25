import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '@one-stop-book/common';
import jwt from 'jsonwebtoken';
import { config } from '@one-stop-book/common';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    college: string;
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    // Check for service token from Next.js frontend (temporary solution)
    const serviceToken = req.headers['authorization'];
    const userId = req.headers['x-user-id'] as string;
    
    if (serviceToken === 'Bearer dev-service-token' && userId) {
      // Temporary bypass for development - trusted Next.js frontend
      req.user = {
        userId: userId,
        email: 'admin@example.com', // Mock email
        role: 'admin',
        college: 'Royal University of Bhutan',
      };
      return next();
    }

    // Get token from header (original JWT flow)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      email: string;
      role: string;
      college: string;
    };
    
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    
    next();
  };
}

