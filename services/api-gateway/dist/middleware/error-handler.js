"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const common_1 = require("@one-stop-book/common");
function errorHandler(err, req, res, next) {
    // Log error
    common_1.logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    // Determine status code and message
    let statusCode = 500;
    let message = (0, common_1.getUserFriendlyMessage)(err);
    if (err instanceof common_1.AppError) {
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
//# sourceMappingURL=error-handler.js.map