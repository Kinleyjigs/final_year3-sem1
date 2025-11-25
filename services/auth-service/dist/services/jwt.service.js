"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("@one-stop-book/common");
class JwtService {
    constructor() {
        this.defaultExpiry = '24h';
        this.secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
        if (this.secret === 'default-secret-change-in-production' && process.env.NODE_ENV === 'production') {
            common_1.logger.error('JWT_SECRET not set in production environment');
            throw new Error('JWT_SECRET must be set in production');
        }
    }
    /**
     * Generate JWT token with user claims
     * @param payload User claims (userId, email, role, college)
     * @param options JWT options (expiresIn)
     * @returns Signed JWT token
     */
    generateToken(payload, options) {
        const expiresIn = options?.expiresIn || this.defaultExpiry;
        const token = jsonwebtoken_1.default.sign({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            college: payload.college,
        }, this.secret, {
            expiresIn: expiresIn,
            issuer: 'one-stop-book-auth-service',
            audience: 'one-stop-book-platform',
        });
        common_1.logger.info('JWT token generated', {
            userId: payload.userId,
            role: payload.role,
            expiresIn,
        });
        return token;
    }
    /**
     * Verify and decode JWT token
     * @param token JWT token string
     * @returns Decoded payload or null if invalid
     */
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret, {
                issuer: 'one-stop-book-auth-service',
                audience: 'one-stop-book-platform',
            });
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                college: decoded.college,
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                common_1.logger.warn('JWT token expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                common_1.logger.warn('Invalid JWT token', { error: error.message });
            }
            else {
                common_1.logger.error('JWT verification error', { error });
            }
            return null;
        }
    }
    /**
     * Decode JWT token without verification (for debugging)
     * @param token JWT token string
     * @returns Decoded payload or null
     */
    decodeToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            return decoded;
        }
        catch (error) {
            common_1.logger.error('JWT decode error', { error });
            return null;
        }
    }
}
exports.JwtService = JwtService;
// Singleton instance
exports.jwtService = new JwtService();
//# sourceMappingURL=jwt.service.js.map