"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRateLimiter = exports.authRateLimiter = exports.publicRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_1 = require("redis");
const common_1 = require("@one-stop-book/common");
// Create Redis client for rate limiting
const redisClient = (0, redis_1.createClient)({
    url: common_1.config.redis.url,
});
redisClient.connect().catch((error) => {
    common_1.logger.error('Failed to connect to Redis for rate limiting', { error });
});
redisClient.on('error', (error) => {
    common_1.logger.error('Redis client error', { error });
});
// Public routes rate limiter (100 req/min)
exports.publicRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: common_1.config.rateLimit.public,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        // @ts-expect-error - Redis client types mismatch
        client: redisClient,
        prefix: 'rl:public:',
    }),
});
// Authenticated routes rate limiter (20 req/min)
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: common_1.config.rateLimit.auth,
    message: 'Too many requests, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        // @ts-expect-error - Redis client types mismatch
        client: redisClient,
        prefix: 'rl:auth:',
    }),
});
// Admin routes rate limiter (50 req/min)
exports.adminRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: common_1.config.rateLimit.admin,
    message: 'Too many admin requests, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        // @ts-expect-error - Redis client types mismatch
        client: redisClient,
        prefix: 'rl:admin:',
    }),
});
//# sourceMappingURL=rate-limit.js.map