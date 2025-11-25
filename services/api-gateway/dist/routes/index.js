"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const common_1 = require("@one-stop-book/common");
const grounds_controller_1 = require("../controllers/grounds.controller");
const availability_controller_1 = require("../controllers/availability.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const bookings_controller_1 = require("../controllers/bookings.controller");
const grounds_validation_1 = require("../middleware/validation/grounds.validation");
const availability_validation_1 = require("../middleware/validation/availability.validation");
const auth_validation_1 = require("../middleware/validation/auth.validation");
const booking_validation_1 = require("../middleware/validation/booking.validation");
const rate_limit_1 = require("../middleware/rate-limit");
const auth_1 = require("../middleware/auth");
function setupRoutes(app) {
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'api-gateway',
        });
    });
    // Grounds endpoints (public - User Story 1)
    app.get('/api/grounds', rate_limit_1.publicRateLimiter, grounds_validation_1.validateSearchGrounds, grounds_controller_1.GroundsController.searchGrounds);
    app.get('/api/grounds/:id', rate_limit_1.publicRateLimiter, grounds_validation_1.validateGroundId, grounds_controller_1.GroundsController.getGround);
    // Availability endpoint (public - User Story 2)
    app.get('/api/grounds/:id/availability', rate_limit_1.publicRateLimiter, availability_validation_1.validateGroundId, availability_validation_1.validateAvailabilityQuery, availability_controller_1.AvailabilityController.getAvailability);
    // Auth endpoints (User Story 3)
    app.post('/api/auth/register', rate_limit_1.publicRateLimiter, auth_validation_1.validateRegistration, auth_controller_1.AuthController.register);
    app.post('/api/auth/login', rate_limit_1.publicRateLimiter, auth_validation_1.validateLogin, auth_controller_1.AuthController.login);
    app.get('/api/auth/me', auth_1.authenticate, auth_controller_1.AuthController.getMe);
    app.patch('/api/auth/me', auth_1.authenticate, auth_validation_1.validateProfileUpdate, auth_controller_1.AuthController.updateMe);
    // Booking endpoints (User Story 4 - Phase 6)
    // T120: Create booking (requires authentication)
    app.post('/api/bookings', auth_1.authenticate, booking_validation_1.validateCreateBooking, bookings_controller_1.BookingsController.createBooking);
    // T121: Get user bookings (requires authentication)
    app.get('/api/bookings', auth_1.authenticate, bookings_controller_1.BookingsController.getUserBookings);
    // T122: Cancel booking (requires authentication)
    app.delete('/api/bookings/:id', auth_1.authenticate, booking_validation_1.validateBookingId, bookings_controller_1.BookingsController.cancelBooking);
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
    common_1.logger.info('Routes configured');
}
//# sourceMappingURL=index.js.map