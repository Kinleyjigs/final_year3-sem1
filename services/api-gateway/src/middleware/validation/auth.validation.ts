import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@one-stop-book/common';

/**
 * Validation schema for user registration
 */
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
    }),
  fullName: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 255 characters',
      'any.required': 'Full name is required',
    }),
  college: Joi.string()
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
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

/**
 * Validation schema for profile update
 */
const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 255 characters',
    }),
  college: Joi.string()
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
export function validateRegistration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Registration validation failed', { errors });

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
export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Login validation failed', { errors });

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
export function validateProfileUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    logger.warn('Profile update validation failed', { errors });

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
}
