"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
exports.requireUser = requireUser;
exports.requireAdmin = requireAdmin;
exports.requireSameCollege = requireSameCollege;
exports.requireSelfOrAdmin = requireSelfOrAdmin;
const common_1 = require("@one-stop-book/common");
var UserRole;
(function (UserRole) {
    UserRole["VISITOR"] = "VISITOR";
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Middleware to require USER or ADMIN role
 */
function requireUser(req, res, next) {
    const user = req.user;
    if (!user) {
        common_1.logger.warn('Unauthorized access attempt - no user in request');
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - please login',
        });
    }
    const allowedRoles = [UserRole.USER, UserRole.ADMIN];
    if (!allowedRoles.includes(user.role)) {
        common_1.logger.warn('Access denied - insufficient role', {
            userId: user.userId,
            role: user.role,
            requiredRoles: allowedRoles,
        });
        return res.status(403).json({
            success: false,
            error: 'Access denied - insufficient permissions',
        });
    }
    next();
}
/**
 * Middleware to require ADMIN role
 */
function requireAdmin(req, res, next) {
    const user = req.user;
    if (!user) {
        common_1.logger.warn('Unauthorized access attempt - no user in request');
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - please login',
        });
    }
    if (user.role !== UserRole.ADMIN) {
        common_1.logger.warn('Access denied - admin role required', {
            userId: user.userId,
            role: user.role,
        });
        return res.status(403).json({
            success: false,
            error: 'Access denied - admin privileges required',
        });
    }
    next();
}
/**
 * Middleware to require specific college for admin actions
 * Ensures admin can only manage resources for their own college
 */
function requireSameCollege(req, res, next) {
    const user = req.user;
    const resourceCollege = req.body.college || req.params.college;
    if (!user) {
        common_1.logger.warn('Unauthorized access attempt - no user in request');
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - please login',
        });
    }
    if (user.role !== UserRole.ADMIN) {
        common_1.logger.warn('Access denied - admin role required for college scoping');
        return res.status(403).json({
            success: false,
            error: 'Access denied - admin privileges required',
        });
    }
    if (resourceCollege && user.college !== resourceCollege) {
        common_1.logger.warn('Access denied - college mismatch', {
            userId: user.userId,
            userCollege: user.college,
            resourceCollege,
        });
        return res.status(403).json({
            success: false,
            error: 'Access denied - can only manage resources for your own college',
        });
    }
    next();
}
/**
 * Middleware to check if user is accessing their own resource
 */
function requireSelfOrAdmin(req, res, next) {
    const user = req.user;
    const targetUserId = req.params.userId || req.body.userId;
    if (!user) {
        common_1.logger.warn('Unauthorized access attempt - no user in request');
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - please login',
        });
    }
    // Allow if admin or accessing own resource
    if (user.role === UserRole.ADMIN || user.userId === targetUserId) {
        return next();
    }
    common_1.logger.warn('Access denied - can only access own resources', {
        userId: user.userId,
        targetUserId,
    });
    return res.status(403).json({
        success: false,
        error: 'Access denied - can only access your own resources',
    });
}
//# sourceMappingURL=rbac.js.map