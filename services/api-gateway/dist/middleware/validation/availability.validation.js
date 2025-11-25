"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAvailabilityQuery = validateAvailabilityQuery;
exports.validateGroundId = validateGroundId;
const joi_1 = __importDefault(require("joi"));
const common_1 = require("@one-stop-book/common");
/**
 * Validation middleware for availability endpoints
 */
/**
 * Validate GET /api/grounds/:id/availability query parameters
 */
function validateAvailabilityQuery(req, res, next) {
    const schema = joi_1.default.object({
        start_date: joi_1.default.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .messages({
            'string.pattern.base': 'start_date must be in YYYY-MM-DD format',
            'any.required': 'start_date is required',
        }),
        end_date: joi_1.default.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .messages({
            'string.pattern.base': 'end_date must be in YYYY-MM-DD format',
            'any.required': 'end_date is required',
        }),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        common_1.logger.warn('Availability query validation failed', {
            errors: error.details,
            query: req.query,
        });
        return res.status(400).json({
            error: 'Validation Error',
            message: errorMessage,
            details: error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            })),
        });
    }
    // Additional validation: start_date should be before or equal to end_date
    const startDate = new Date(value.start_date);
    const endDate = new Date(value.end_date);
    if (startDate > endDate) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'start_date must be before or equal to end_date',
        });
    }
    // Additional validation: date range should not exceed 31 days
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 31) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Date range cannot exceed 31 days',
        });
    }
    // Additional validation: start_date should not be in the past (more than 1 day ago)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    if (startDate < yesterday) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'start_date cannot be more than 1 day in the past',
        });
    }
    next();
}
/**
 * Validate ground ID parameter (UUID format)
 */
function validateGroundId(req, res, next) {
    const { id } = req.params;
    const schema = joi_1.default.string().uuid().required();
    const { error } = schema.validate(id);
    if (error) {
        common_1.logger.warn('Ground ID validation failed', { groundId: id });
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid ground ID format. Must be a valid UUID.',
        });
    }
    next();
}
//# sourceMappingURL=availability.validation.js.map