"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchGrounds = validateSearchGrounds;
exports.validateGroundId = validateGroundId;
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
const joi_1 = __importDefault(require("joi"));
/**
 * Validation middleware for grounds search query parameters
 */
function validateSearchGrounds(req, _res, next) {
    const schema = joi_1.default.object({
        college: joi_1.default.string().optional().messages({
            'string.base': 'College must be a text value',
        }),
        is_active: joi_1.default.boolean().optional().messages({
            'boolean.base': 'is_active must be true or false',
        }),
        page: joi_1.default.number().integer().min(1).optional().default(1).messages({
            'number.base': 'Page must be a number',
            'number.min': 'Page must be at least 1',
            'number.integer': 'Page must be a whole number',
        }),
        limit: joi_1.default.number().integer().min(1).max(100).optional().default(10).messages({
            'number.base': 'Limit must be a number',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100',
            'number.integer': 'Limit must be a whole number',
        }),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) {
        return next(new common_2.ValidationError(error.message));
    }
    // Update query with validated/defaulted values
    req.query = value;
    next();
}
/**
 * Validation middleware for ground ID parameter
 */
function validateGroundId(req, _res, next) {
    const schema = joi_1.default.object({
        id: common_1.schemas.uuid.required().messages({
            'string.guid': 'Invalid ground ID format. Please provide a valid UUID.',
            'any.required': 'Ground ID is required',
        }),
    });
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
        return next(new common_2.ValidationError(error.message));
    }
    next();
}
//# sourceMappingURL=grounds.validation.js.map