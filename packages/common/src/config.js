"use strict";
// Configuration management with environment variables
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
exports.config = {
    // Node environment
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    // Database
    database: {
        url: process.env.DATABASE_URL || '',
    },
    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
        expiry: process.env.JWT_EXPIRY || '24h',
    },
    // Redis
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    // SMTP (Email)
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
        from: process.env.SMTP_FROM || 'One Stop Book <noreply@onestopbook.com>',
    },
    // Rate Limiting
    rateLimit: {
        public: parseInt(process.env.RATE_LIMIT_PUBLIC || '100', 10),
        auth: parseInt(process.env.RATE_LIMIT_AUTH || '20', 10),
        admin: parseInt(process.env.RATE_LIMIT_ADMIN || '50', 10),
    },
    // Service Ports
    ports: {
        authService: parseInt(process.env.AUTH_SERVICE_PORT || '50051', 10),
        groundsService: parseInt(process.env.GROUNDS_SERVICE_PORT || '50052', 10),
        bookingService: parseInt(process.env.BOOKING_SERVICE_PORT || '50053', 10),
        maintenanceService: parseInt(process.env.MAINTENANCE_SERVICE_PORT || '50054', 10),
        notificationService: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '50055', 10),
        apiGateway: parseInt(process.env.API_GATEWAY_PORT || '3001', 10),
        frontend: parseInt(process.env.FRONTEND_PORT || '3000', 10),
    },
    // Service URLs (for gRPC clients)
    services: {
        auth: process.env.AUTH_SERVICE_URL || 'localhost:50051',
        grounds: process.env.GROUNDS_SERVICE_URL || 'localhost:50052',
        booking: process.env.BOOKING_SERVICE_URL || 'localhost:50053',
        maintenance: process.env.MAINTENANCE_SERVICE_URL || 'localhost:50054',
        notification: process.env.NOTIFICATION_SERVICE_URL || 'localhost:50055',
    },
};
// Validate required configuration
function validateConfig() {
    const required = [
        { key: 'DATABASE_URL', value: exports.config.database.url },
        { key: 'JWT_SECRET', value: exports.config.jwt.secret },
    ];
    const missing = required.filter(r => !r.value || r.value === 'default-secret-change-in-production');
    if (missing.length > 0 && exports.config.isProduction) {
        throw new Error(`Missing required configuration: ${missing.map(m => m.key).join(', ')}`);
    }
}
//# sourceMappingURL=config.js.map