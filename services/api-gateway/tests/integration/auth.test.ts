import request from 'supertest';
import express from 'express';
import { AuthController } from '../../src/controllers/auth.controller';
import { validateRegistration, validateLogin } from '../../src/middleware/validation/auth.validation';
import { publicRateLimiter } from '../../src/middleware/rate-limit';

// Mock the gRPC auth client
jest.mock('@one-stop-book/grpc-clients', () => ({
  authClient: {
    register: jest.fn(),
    login: jest.fn(),
  },
}));

// Mock rate limiter to bypass in tests
jest.mock('../../src/middleware/rate-limit', () => ({
  publicRateLimiter: jest.fn((_req, _res, next) => next()),
  authRateLimiter: jest.fn((_req, _res, next) => next()),
  adminRateLimiter: jest.fn((_req, _res, next) => next()),
}));

import { authClient } from '@one-stop-book/grpc-clients';

// Type assertion for mocked authClient
const mockAuthClient = authClient as jest.Mocked<typeof authClient>;

describe('Auth API Integration Tests (T078, T079)', () => {
  let app: express.Application;

  beforeAll(() => {
    // Create Express app for testing
    app = express();
    app.use(express.json());

    // Setup auth routes
    app.post('/api/auth/register', publicRateLimiter, validateRegistration, AuthController.register);
    app.post('/api/auth/login', publicRateLimiter, validateLogin, AuthController.login);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register (T078)', () => {
    it('should successfully register a new user with valid data', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'newuser@cst.edu.bt',
          fullName: 'New User',
          college: 'CST',
          role: 1, // USER
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock.jwt.token',
      };

      (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@cst.edu.bt',
          password: 'SecurePass123',
          fullName: 'New User',
          college: 'CST',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('newuser@cst.edu.bt');
      expect(response.body.data.user.role).toBe('USER');
      expect(response.body.data.token).toBe('mock.jwt.token');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123',
          fullName: 'Test User',
          college: 'CST',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should require password minimum length of 8 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@cst.edu.bt',
          password: 'short',
          fullName: 'Test User',
          college: 'CST',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('password');
    });

    it('should require fullName field', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@cst.edu.bt',
          password: 'SecurePass123',
          college: 'CST',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('fullName');
    });

    it('should require college field', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@cst.edu.bt',
          password: 'SecurePass123',
          fullName: 'Test User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('college');
    });

    it('should handle duplicate email registration', async () => {
      (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
        const error: any = new Error('Email already registered');
        error.code = 6; // ALREADY_EXISTS gRPC code
        callback(error, null);
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@cst.edu.bt',
          password: 'SecurePass123',
          fullName: 'Test User',
          college: 'CST',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email already registered');
    });

    it('should accept valid college names', async () => {
      const colleges = ['CST', 'Sherubtse', 'Paro', 'JNEC', 'RTC'];

      for (const college of colleges) {
        const mockResponse = {
          user: {
            id: `user-${college}`,
            email: `test@${college}.edu.bt`,
            fullName: 'Test User',
            college,
            role: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock.jwt.token',
        };

        (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
          callback(null, mockResponse);
        });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: `test@${college}.edu.bt`,
            password: 'SecurePass123',
            fullName: 'Test User',
            college,
          })
          .expect(201);

        expect(response.body.data.user.college).toBe(college);
      }
    });

    it('should handle gRPC service unavailable error', async () => {
      (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
        const error: any = new Error('Service unavailable');
        error.code = 14; // UNAVAILABLE gRPC code
        callback(error, null);
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@cst.edu.bt',
          password: 'SecurePass123',
          fullName: 'Test User',
          college: 'CST',
        })
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should return user without passwordHash', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'test@cst.edu.bt',
          fullName: 'Test User',
          college: 'CST',
          role: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock.jwt.token',
      };

      (mockAuthClient.register as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@cst.edu.bt',
          password: 'SecurePass123',
          fullName: 'Test User',
          college: 'CST',
        })
        .expect(201);

      expect(response.body.data.user.passwordHash).toBeUndefined();
      expect(response.body.data.user.password).toBeUndefined();
    });
  });

  describe('POST /api/auth/login (T079)', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'user@cst.edu.bt',
          fullName: 'Existing User',
          college: 'CST',
          role: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'valid.jwt.token',
      };

      (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@cst.edu.bt',
          password: 'CorrectPassword123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('user@cst.edu.bt');
      expect(response.body.data.token).toBe('valid.jwt.token');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'Password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should require password field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@cst.edu.bt',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('password');
    });

    it('should reject login with incorrect password', async () => {
      (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
        const error: any = new Error('Invalid credentials');
        error.code = 16; // UNAUTHENTICATED gRPC code
        callback(error, null);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@cst.edu.bt',
          password: 'WrongPassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should reject login for non-existent user', async () => {
      (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
        const error: any = new Error('Invalid credentials');
        error.code = 16;
        callback(error, null);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@cst.edu.bt',
          password: 'AnyPassword123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return JWT token on successful login', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'user@cst.edu.bt',
          fullName: 'Test User',
          college: 'CST',
          role: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature',
      };

      (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@cst.edu.bt',
          password: 'CorrectPassword123',
        })
        .expect(200);

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.token).toContain('.');
    });

    it('should return user without sensitive data', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'user@cst.edu.bt',
          fullName: 'Test User',
          college: 'CST',
          role: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock.jwt.token',
      };

      (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@cst.edu.bt',
          password: 'CorrectPassword123',
        })
        .expect(200);

      expect(response.body.data.user.passwordHash).toBeUndefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should handle different user roles', async () => {
      const roles = [
        { roleNum: 0, roleName: 'VISITOR' },
        { roleNum: 1, roleName: 'USER' },
        { roleNum: 2, roleName: 'ADMIN' },
      ];

      for (const { roleNum, roleName } of roles) {
        const mockResponse = {
          user: {
            id: `${roleName}-123`,
            email: `${roleName.toLowerCase()}@cst.edu.bt`,
            fullName: `Test ${roleName}`,
            college: 'CST',
            role: roleNum,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock.jwt.token',
        };

        (mockAuthClient.login as jest.Mock).mockImplementation((_req, callback) => {
          callback(null, mockResponse);
        });

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: `${roleName.toLowerCase()}@cst.edu.bt`,
            password: 'Password123',
          })
          .expect(200);

        expect(response.body.data.user.role).toBe(roleName);
      }
    });
  });
});
