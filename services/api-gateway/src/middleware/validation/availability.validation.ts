import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '@one-stop-book/common';

/**
 * Validation middleware for availability endpoints
 */

/**
 * Validate GET /api/grounds/:id/availability query parameters
 */
export function validateAvailabilityQuery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    start_date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        'string.pattern.base': 'start_date must be in YYYY-MM-DD format',
        'any.required': 'start_date is required',
      }),
    end_date: Joi.string()
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
    
    logger.warn('Availability query validation failed', {
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
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

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
export function validateGroundId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  const schema = Joi.string().uuid().required();

  const { error } = schema.validate(id);

  if (error) {
    logger.warn('Ground ID validation failed', { groundId: id });

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid ground ID format. Must be a valid UUID.',
    });
  }

  next();
}
