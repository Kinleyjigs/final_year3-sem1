import winston from 'winston';

// Sensitive fields to sanitize from logs (Constitution Principle 4)
const SENSITIVE_FIELDS = ['password', 'passwordHash', 'token', 'email', 'authorization'];

// Sanitize function to remove sensitive data
const sanitize = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Custom format to sanitize logs
const sanitizeFormat = winston.format((info) => {
  return sanitize(info);
})();

// Create Winston logger instance
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    sanitizeFormat,
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    }),
  ],
});

// Export logger with typed methods
export const logger = {
  info: (message: string, meta?: any): void => {
    winstonLogger.info(message, meta ? sanitize(meta) : {});
  },
  warn: (message: string, meta?: any): void => {
    winstonLogger.warn(message, meta ? sanitize(meta) : {});
  },
  error: (message: string, meta?: any): void => {
    winstonLogger.error(message, meta ? sanitize(meta) : {});
  },
  debug: (message: string, meta?: any): void => {
    winstonLogger.debug(message, meta ? sanitize(meta) : {});
  },
};
