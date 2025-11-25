import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@one-stop-book/common';

const VALID_COLLEGES = [
  'Royal University of Bhutan',
  'Sherubtse College',
  'College of Natural Resources',
  'College of Science and Technology',
  'Jigme Namgyel Engineering College',
];

const VALID_AMENITIES = [
  'Floodlights',
  'Parking',
  'Washrooms',
  'Changing Rooms',
  'Seating',
  'Scoreboard',
  'First Aid',
  'Cafeteria',
];

export function validateCreateGround(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, college, location, capacity, amenities, photos } = req.body;

  const errors: string[] = [];

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!college || !VALID_COLLEGES.includes(college)) {
    errors.push(`College must be one of: ${VALID_COLLEGES.join(', ')}`);
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Location is required and must be a non-empty string');
  }

  if (!capacity || typeof capacity !== 'number' || capacity <= 0) {
    errors.push('Capacity is required and must be a positive number');
  }

  // Validate optional amenities
  if (amenities) {
    if (!Array.isArray(amenities)) {
      errors.push('Amenities must be an array');
    } else {
      const invalidAmenities = amenities.filter(
        (a: string) => !VALID_AMENITIES.includes(a)
      );
      if (invalidAmenities.length > 0) {
        errors.push(
          `Invalid amenities: ${invalidAmenities.join(', ')}. Valid amenities are: ${VALID_AMENITIES.join(', ')}`
        );
      }
    }
  }

  // Validate optional photos
  if (photos) {
    if (!Array.isArray(photos)) {
      errors.push('Photos must be an array');
    } else {
      photos.forEach((photo: any, index: number) => {
        if (typeof photo !== 'string' || photo.trim().length === 0) {
          errors.push(`Photo at index ${index} must be a non-empty string URL`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join('; ')));
  }

  next();
}

export function validateUpdateGround(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { name, location, capacity, amenities, photos } = req.body;

  const errors: string[] = [];

  // Validate ground ID
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    errors.push('Ground ID is required');
  }

  // Validate optional fields (at least one should be provided)
  const hasUpdates = name || location || capacity || amenities || photos;
  if (!hasUpdates) {
    errors.push('At least one field must be provided for update');
  }

  // Validate name if provided
  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('Name must be a non-empty string');
  }

  // Validate location if provided
  if (location !== undefined && (typeof location !== 'string' || location.trim().length === 0)) {
    errors.push('Location must be a non-empty string');
  }

  // Validate capacity if provided
  if (capacity !== undefined && (typeof capacity !== 'number' || capacity <= 0)) {
    errors.push('Capacity must be a positive number');
  }

  // Validate amenities if provided
  if (amenities !== undefined) {
    if (!Array.isArray(amenities)) {
      errors.push('Amenities must be an array');
    } else {
      const invalidAmenities = amenities.filter(
        (a: string) => !VALID_AMENITIES.includes(a)
      );
      if (invalidAmenities.length > 0) {
        errors.push(
          `Invalid amenities: ${invalidAmenities.join(', ')}. Valid amenities are: ${VALID_AMENITIES.join(', ')}`
        );
      }
    }
  }

  // Validate photos if provided
  if (photos !== undefined) {
    if (!Array.isArray(photos)) {
      errors.push('Photos must be an array');
    } else {
      photos.forEach((photo: any, index: number) => {
        if (typeof photo !== 'string' || photo.trim().length === 0) {
          errors.push(`Photo at index ${index} must be a non-empty string URL`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join('; ')));
  }

  next();
}

export function validateGroundIdParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return next(new ValidationError('Ground ID is required'));
  }

  next();
}
