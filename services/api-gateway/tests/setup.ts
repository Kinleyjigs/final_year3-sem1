// Test setup file for API Gateway
// Add any global test configuration here

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.PORT = '3002'; // Use different port for tests
process.env.AUTH_SERVICE_URL = 'localhost:50051';
process.env.GROUNDS_SERVICE_URL = 'localhost:50052';
process.env.BOOKING_SERVICE_URL = 'localhost:50053';
process.env.MAINTENANCE_SERVICE_URL = 'localhost:50054';
process.env.NOTIFICATION_SERVICE_URL = 'localhost:50055';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.RATE_LIMIT_PUBLIC = '1000'; // High limit for tests
process.env.RATE_LIMIT_AUTH = '1000';
process.env.RATE_LIMIT_ADMIN = '1000';
