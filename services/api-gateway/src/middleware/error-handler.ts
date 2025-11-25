import { Request, Response, NextFunction } from 'express';
import { AppError, getUserFriendlyMessage, isOperationalError, logger } from '@one-stop-book/common';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  // Determine status code and message
  let statusCode = 500;
  let message = getUserFriendlyMessage(err);
  
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
