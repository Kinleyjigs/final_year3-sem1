// Test setup file
// Add any global test configuration here

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://osb_user:osb_password@localhost:5432/one_stop_book_test?schema=bookings';
process.env.GROUNDS_SERVICE_URL = 'localhost:50052';
process.env.MAINTENANCE_SERVICE_URL = 'localhost:50054';
process.env.NOTIFICATION_SERVICE_URL = 'localhost:50055';
