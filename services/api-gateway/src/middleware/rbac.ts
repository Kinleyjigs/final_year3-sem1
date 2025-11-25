import { Request, Response, NextFunction } from 'express';
import { logger } from '@one-stop-book/common';

export enum UserRole {
  VISITOR = 'VISITOR',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * Middleware to require USER or ADMIN role
 */
export function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user) {
    logger.warn('Unauthorized access attempt - no user in request');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - please login',
    });
  }

  const allowedRoles = [UserRole.USER, UserRole.ADMIN];
  if (!allowedRoles.includes(user.role)) {
    logger.warn('Access denied - insufficient role', {
      userId: user.userId,
      role: user.role,
      requiredRoles: allowedRoles,
    });
    return res.status(403).json({
      success: false,
      error: 'Access denied - insufficient permissions',
    });
  }

  next();
}

/**
 * Middleware to require ADMIN role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user) {
    logger.warn('Unauthorized access attempt - no user in request');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - please login',
    });
  }

  if (user.role !== UserRole.ADMIN) {
    logger.warn('Access denied - admin role required', {
      userId: user.userId,
      role: user.role,
    });
    return res.status(403).json({
      success: false,
      error: 'Access denied - admin privileges required',
    });
  }

  next();
}

/**
 * Middleware to require specific college for admin actions
 * Ensures admin can only manage resources for their own college
 */
export function requireSameCollege(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  const resourceCollege = req.body.college || req.params.college;

  if (!user) {
    logger.warn('Unauthorized access attempt - no user in request');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - please login',
    });
  }

  if (user.role !== UserRole.ADMIN) {
    logger.warn('Access denied - admin role required for college scoping');
    return res.status(403).json({
      success: false,
      error: 'Access denied - admin privileges required',
    });
  }

  if (resourceCollege && user.college !== resourceCollege) {
    logger.warn('Access denied - college mismatch', {
      userId: user.userId,
      userCollege: user.college,
      resourceCollege,
    });
    return res.status(403).json({
      success: false,
      error: 'Access denied - can only manage resources for your own college',
    });
  }

  next();
}

/**
 * Middleware to check if user is accessing their own resource
 */
export function requireSelfOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  const targetUserId = req.params.userId || req.body.userId;

  if (!user) {
    logger.warn('Unauthorized access attempt - no user in request');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - please login',
    });
  }

  // Allow if admin or accessing own resource
  if (user.role === UserRole.ADMIN || user.userId === targetUserId) {
    return next();
  }

  logger.warn('Access denied - can only access own resources', {
    userId: user.userId,
    targetUserId,
  });
  return res.status(403).json({
    success: false,
    error: 'Access denied - can only access your own resources',
  });
}
