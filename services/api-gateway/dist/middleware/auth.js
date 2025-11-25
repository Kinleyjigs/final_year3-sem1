"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const common_1 = require("@one-stop-book/common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_2 = require("@one-stop-book/common");
function authenticate(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, common_2.config.jwt.secret);
        // Attach user to request
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new common_1.UnauthorizedError('Invalid or expired token'));
        }
        else {
            next(error);
        }
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new common_1.UnauthorizedError());
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new common_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map