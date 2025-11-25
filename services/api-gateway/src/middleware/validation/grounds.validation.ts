import { Request, Response, NextFunction } from 'express';
import { validate, schemas } from '@one-stop-book/common';
import { ValidationError } from '@one-stop-book/common';
import Joi from 'joi';

/**
 * Validation middleware for grounds search query parameters
 */
export function validateSearchGrounds(req: Request, _res: Response, next: NextFunction) {
  const schema = Joi.object({
    college: Joi.string().optional().messages({
      'string.base': 'College must be a text value',
    }),
    is_active: Joi.boolean().optional().messages({
      'boolean.base': 'is_active must be true or false',
    }),
    page: Joi.number().integer().min(1).optional().default(1).messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1',
      'number.integer': 'Page must be a whole number',
    }),
    limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
      'number.integer': 'Limit must be a whole number',
    }),
  });

  const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });

  if (error) {
    return next(new ValidationError(error.message));
  }

  // Update query with validated/defaulted values
  req.query = value as any;
  next();
}

/**
 * Validation middleware for ground ID parameter
 */
export function validateGroundId(req: Request, _res: Response, next: NextFunction) {
  const schema = Joi.object({
    id: schemas.uuid.required().messages({
      'string.guid': 'Invalid ground ID format. Please provide a valid UUID.',
      'any.required': 'Ground ID is required',
    }),
  });

  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    return next(new ValidationError(error.message));
  }

  next();
}
