"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBooking = validateCreateBooking;
exports.validateBookingId = validateBookingId;
const joi_1 = __importDefault(require("joi"));
const common_1 = require("@one-stop-book/common");
/**
 * T123: Validation middleware for booking endpoints
 * Validates booking creation and cancellation requests
 */
/**
 * Validate POST /api/bookings request body
 */
function validateCreateBooking(req, res, next) {
    const schema = joi_1.default.object({
        groundId: joi_1.default.string()
            .uuid()
            .required()
            .messages({
            'string.guid': 'groundId must be a valid UUID',
            'any.required': 'groundId is required',
        }),
        bookingDate: joi_1.default.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .messages({
            'string.pattern.base': 'bookingDate must be in YYYY-MM-DD format',
            'any.required': 'bookingDate is required',
        }),
        startTime: joi_1.default.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .required()
            .messages({
            'string.pattern.base': 'startTime must be in HH:MM format (24-hour)',
            'any.required': 'startTime is required',
        }),
        endTime: joi_1.default.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .required()
            .messages({
            'string.pattern.base': 'endTime must be in HH:MM format (24-hour)',
            'any.required': 'endTime is required',
        }),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        common_1.logger.warn('Booking validation failed', {
            errors: error.details,
            body: req.body,
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
    // Additional validation: bookingDate should not be in the past
    const bookingDate = new Date(value.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'bookingDate cannot be in the past',
        });
    }
    // Additional validation: startTime should be before endTime
    const [startHour, startMin] = value.startTime.split(':').map(Number);
    const [endHour, endMin] = value.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    if (startMinutes >= endMinutes) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'startTime must be before endTime',
        });
    }
    // Additional validation: booking duration must be 1 hour or 2 hours only
    const durationMinutes = endMinutes - startMinutes;
    if (durationMinutes !== 60 && durationMinutes !== 120) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Booking duration must be exactly 1 hour or 2 hours',
        });
    }
    // Additional validation: bookings should be within reasonable future (e.g., 90 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    if (bookingDate > maxDate) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Bookings cannot be made more than 90 days in advance',
        });
    }
    next();
}
/**
 * Validate DELETE /api/bookings/:id - booking ID parameter
 */
function validateBookingId(req, res, next) {
    const { id } = req.params;
    const schema = joi_1.default.string().uuid().required();
    const { error } = schema.validate(id);
    if (error) {
        common_1.logger.warn('Booking ID validation failed', { bookingId: id });
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid booking ID format. Must be a valid UUID.',
        });
    }
    next();
}
//# sourceMappingURL=booking.validation.js.map