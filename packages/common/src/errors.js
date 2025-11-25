"use strict";
// Error handling with user-friendly messages (Constitution Principle 5)
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.AppError = void 0;
exports.isOperationalError = isOperationalError;
exports.getUserFriendlyMessage = getUserFriendlyMessage;
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(400, message);
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required. Please log in to continue.') {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'You do not have permission to perform this action.') {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(resource) {
        super(404, `${resource} not found. Please check and try again.`);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
class InternalError extends AppError {
    constructor(message = 'Something went wrong. Please try again later.') {
        super(500, message, false); // Not operational - unexpected error
    }
}
exports.InternalError = InternalError;
// Helper to determine if error should be exposed to client
function isOperationalError(error) {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
}
// Helper to get user-friendly error message
function getUserFriendlyMessage(error) {
    if (error instanceof AppError) {
        return error.message;
    }
    // Generic message for unexpected errors (don't leak implementation details)
    return 'An unexpected error occurred. Please try again later.';
}
//# sourceMappingURL=errors.js.map