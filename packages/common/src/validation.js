"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.schemas = void 0;
exports.validate = validate;
const joi_1 = __importDefault(require("joi"));
// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Common validation schemas
exports.schemas = {
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required',
    }),
    uuid: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Invalid ID format',
        'any.required': 'ID is required',
    }),
    college: joi_1.default.string().min(2).max(255).required().messages({
        'string.min': 'College name must be at least 2 characters',
        'string.max': 'College name cannot exceed 255 characters',
        'any.required': 'College is required',
    }),
    fullName: joi_1.default.string().min(2).max(255).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 255 characters',
        'any.required': 'Full name is required',
    }),
    pagination: {
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(20),
    },
    date: joi_1.default.date().iso().required().messages({
        'date.base': 'Please provide a valid date',
        'any.required': 'Date is required',
    }),
    futureDate: joi_1.default.date().iso().greater('now').required().messages({
        'date.greater': 'Date must be in the future',
    }),
};
// Validation helper functions
exports.validation = {
    email: (value) => EMAIL_REGEX.test(value),
    password: (value) => value.length >= 8,
    uuid: (value) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    },
};
// Joi validation wrapper with user-friendly errors
function validate(schema, data) {
    const result = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (result.error) {
        // Combine all error messages into user-friendly format
        const messages = result.error.details.map(detail => detail.message).join('; ');
        return { value: null, error: messages };
    }
    return { value: result.value, error: null };
}
//# sourceMappingURL=validation.js.map