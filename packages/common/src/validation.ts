import Joi from 'joi';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common validation schemas
export const schemas = {
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  
  uuid: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid ID format',
    'any.required': 'ID is required',
  }),
  
  college: Joi.string().min(2).max(255).required().messages({
    'string.min': 'College name must be at least 2 characters',
    'string.max': 'College name cannot exceed 255 characters',
    'any.required': 'College is required',
  }),
  
  fullName: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 255 characters',
    'any.required': 'Full name is required',
  }),
  
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  },
  
  date: Joi.date().iso().required().messages({
    'date.base': 'Please provide a valid date',
    'any.required': 'Date is required',
  }),
  
  futureDate: Joi.date().iso().greater('now').required().messages({
    'date.greater': 'Date must be in the future',
  }),
};

// Validation helper functions
export const validation = {
  email: (value: string): boolean => EMAIL_REGEX.test(value),
  password: (value: string): boolean => value.length >= 8,
  uuid: (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },
};

// Joi validation wrapper with user-friendly errors
export function validate<T>(
  schema: Joi.Schema,
  data: any
): { value: T; error: null } | { value: null; error: string } {
  const result = schema.validate(data, { abortEarly: false, stripUnknown: true });
  
  if (result.error) {
    // Combine all error messages into user-friendly format
    const messages = result.error.details.map(detail => detail.message).join('; ');
    return { value: null, error: messages };
  }
  
  return { value: result.value as T, error: null };
}
