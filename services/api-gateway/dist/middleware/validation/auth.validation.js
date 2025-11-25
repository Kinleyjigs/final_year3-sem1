"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = validateRegistration;
exports.validateLogin = validateLogin;
exports.validateProfileUpdate = validateProfileUpdate;
const joi_1 = __importDefault(require("joi"));
const common_1 = require("@one-stop-book/common");
/**
 * Validation schema for user registration
 */
const registerSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string()
        .min(8)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required',
    }),
    fullName: joi_1.default.string()
        .min(2)
        .max(255)
        .required()
        .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 255 characters',
        'any.required': 'Full name is required',
    }),
    college: joi_1.default.string()
        .min(2)
        .max(255)
        .required()
        .messages({
        'string.min': 'College name must be at least 2 characters long',
        'string.max': 'College name cannot exceed 255 characters',
        'any.required': 'College is required',
    }),
});
/**
 * Validation schema for user login
 */
const loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Password is required',
    }),
});
/**
 * Validation schema for profile update
 */
const updateProfileSchema = joi_1.default.object({
    fullName: joi_1.default.string()
        .min(2)
        .max(255)
        .optional()
        .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 255 characters',
    }),
    college: joi_1.default.string()
        .min(2)
        .max(255)
        .optional()
        .messages({
        'string.min': 'College name must be at least 2 characters long',
        'string.max': 'College name cannot exceed 255 characters',
    }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});
/**
 * Middleware to validate registration input
 */
function validateRegistration(req, res, next) {
    const { error } = registerSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));
        common_1.logger.warn('Registration validation failed', { errors });
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }
    next();
}
/**
 * Middleware to validate login input
 */
function validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));
        common_1.logger.warn('Login validation failed', { errors });
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }
    next();
}
/**
 * Middleware to validate profile update input
 */
function validateProfileUpdate(req, res, next) {
    const { error } = updateProfileSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));
        common_1.logger.warn('Profile update validation failed', { errors });
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }
    next();
}
//# sourceMappingURL=auth.validation.js.map