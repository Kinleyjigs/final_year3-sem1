"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Sensitive fields to sanitize from logs (Constitution Principle 4)
const SENSITIVE_FIELDS = ['password', 'passwordHash', 'token', 'email', 'authorization'];
// Sanitize function to remove sensitive data
const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(sanitize);
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
            sanitized[key] = '[REDACTED]';
        }
        else if (value && typeof value === 'object') {
            sanitized[key] = sanitize(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};
// Custom format to sanitize logs
const sanitizeFormat = winston_1.default.format((info) => {
    return sanitize(info);
})();
// Create Winston logger instance
const winstonLogger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), sanitizeFormat, winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                return `${timestamp} [${level}]: ${message} ${metaStr}`;
            })),
        }),
    ],
});
// Export logger with typed methods
exports.logger = {
    info: (message, meta) => {
        winstonLogger.info(message, meta ? sanitize(meta) : {});
    },
    warn: (message, meta) => {
        winstonLogger.warn(message, meta ? sanitize(meta) : {});
    },
    error: (message, meta) => {
        winstonLogger.error(message, meta ? sanitize(meta) : {});
    },
    debug: (message, meta) => {
        winstonLogger.debug(message, meta ? sanitize(meta) : {});
    },
};
//# sourceMappingURL=logger.js.map