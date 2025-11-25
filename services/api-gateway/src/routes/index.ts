import { Application } from 'express';
import { logger } from '@one-stop-book/common';
import { GroundsController } from '../controllers/grounds.controller';
import { AvailabilityController } from '../controllers/availability.controller';
import { AuthController } from '../controllers/auth.controller';
import { BookingsController } from '../controllers/bookings.controller';
import { AdminGroundsController } from '../controllers/admin-grounds.controller';
import { validateSearchGrounds, validateGroundId } from '../middleware/validation/grounds.validation';
import { validateAvailabilityQuery, validateGroundId as validateAvailabilityGroundId } from '../middleware/validation/availability.validation';
import { validateRegistration, validateLogin, validateProfileUpdate } from '../middleware/validation/auth.validation';
import { validateCreateBooking, validateBookingId } from '../middleware/validation/booking.validation';
import { validateCreateGround, validateUpdateGround, validateGroundIdParam } from '../middleware/validation/admin-grounds.validation';
import { publicRateLimiter } from '../middleware/rate-limit';
import { authenticate } from '../middleware/auth';

export function setupRoutes(app: Application): void {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    });
  });
  
  // Grounds endpoints (public - User Story 1)
  app.get(
    '/api/grounds',
    publicRateLimiter,
    validateSearchGrounds,
    GroundsController.searchGrounds
  );

  app.get(
    '/api/grounds/:id',
    publicRateLimiter,
    validateGroundId,
    GroundsController.getGround
  );

  // Availability endpoint (public - User Story 2)
  app.get(
    '/api/grounds/:id/availability',
    publicRateLimiter,
    validateAvailabilityGroundId,
    validateAvailabilityQuery,
    AvailabilityController.getAvailability
  );

  // Auth endpoints (User Story 3)
  app.post(
    '/api/auth/register',
    publicRateLimiter,
    validateRegistration,
    AuthController.register
  );

  app.post(
    '/api/auth/login',
    publicRateLimiter,
    validateLogin,
    AuthController.login
  );

  app.get(
    '/api/auth/me',
    authenticate,
    AuthController.getMe
  );

  app.patch(
    '/api/auth/me',
    authenticate,
    validateProfileUpdate,
    AuthController.updateMe
  );

  // Booking endpoints (User Story 4 - Phase 6)
  // T120: Create booking (requires authentication)
  app.post(
    '/api/bookings',
    authenticate,
    validateCreateBooking,
    BookingsController.createBooking
  );

  // T121: Get user bookings (requires authentication)
  app.get(
    '/api/bookings',
    authenticate,
    BookingsController.getUserBookings
  );

  // T122: Cancel booking (requires authentication)
  app.delete(
    '/api/bookings/:id',
    authenticate,
    validateBookingId,
    BookingsController.cancelBooking
  );

  // Admin endpoints (requires authentication)
  // Create a new ground
  app.post(
    '/api/admin/grounds',
    authenticate,
    validateCreateGround,
    AdminGroundsController.createGround
  );

  // Update an existing ground
  app.put(
    '/api/admin/grounds/:id',
    authenticate,
    validateGroundIdParam,
    validateUpdateGround,
    AdminGroundsController.updateGround
  );

  // Deactivate a ground
  app.delete(
    '/api/admin/grounds/:id',
    authenticate,
    validateGroundIdParam,
    AdminGroundsController.deactivateGround
  );

  // Get grounds by college (for admin)
  app.get(
    '/api/admin/grounds/college/:college',
    authenticate,
    AdminGroundsController.getGroundsByCollege
  );
  
  // API routes will be added in subsequent phases
  // Example structure:
  // app.use('/api/admin', adminRoutes);
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: {
        message: `Route ${req.originalUrl} not found`,
      },
    });
  });
  
  logger.info('Routes configured');
}
