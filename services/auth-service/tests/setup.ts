// Test setup file
// Add any global test configuration here

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_EXPIRY = '1h';
process.env.DATABASE_URL = 'postgresql://osb_user:osb_password@localhost:5432/one_stop_book_test?schema=auth';
