// Error handling with user-friendly messages (Constitution Principle 5)

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required. Please log in to continue.') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found. Please check and try again.`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class InternalError extends AppError {
  constructor(message = 'Something went wrong. Please try again later.') {
    super(500, message, false); // Not operational - unexpected error
  }
}

// Helper to determine if error should be exposed to client
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

// Helper to get user-friendly error message
export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof AppError) {
    return error.message;
  }
  // Generic message for unexpected errors (don't leak implementation details)
  return 'An unexpected error occurred. Please try again later.';
}
