import request from 'supertest';
import express from 'express';
import { AuthController } from '../../src/controllers/auth.controller';
import { authenticate } from '../../src/middleware/auth';
import { validateProfileUpdate } from '../../src/middleware/validation/auth.validation';
import jwt from 'jsonwebtoken';

// Mock the gRPC auth client
jest.mock('@one-stop-book/grpc-clients', () => ({
  authClient: {
    verifyToken: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
  },
}));

// Mock authenticate middleware
jest.mock('../../src/middleware/auth', () => ({
  authenticate: jest.fn((req, _res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return _res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Decode token (in real middleware, this calls gRPC service)
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded) {
        return _res.status(401).json({ success: false, error: 'Invalid token' });
      }
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        college: decoded.college,
      };
      next();
    } catch (error) {
      return _res.status(401).json({ success: false, error: 'Invalid token' });
    }
  }),
}));

import { authClient } from '@one-stop-book/grpc-clients';

// Type assertion for mocked authClient
const mockAuthClient = authClient as jest.Mocked<typeof authClient>;

describe('Profile API Integration Tests (T080)', () => {
  let app: express.Application;
  const testSecret = 'test-jwt-secret-for-testing-only';

  beforeAll(() => {
    // Create Express app for testing
    app = express();
    app.use(express.json());

    // Setup profile routes
    app.get('/api/auth/me', authenticate, AuthController.getMe);
    app.patch('/api/auth/me', authenticate, validateProfileUpdate, AuthController.updateMe);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const generateTestToken = (payload: any) => {
    return jwt.sign(payload, testSecret, { expiresIn: '1h' });
  };

  describe('GET /api/auth/me', () => {
    it('should return current user profile with valid token', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'Test User',
        college: 'CST',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.getUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('user-123');
      expect(response.body.data.email).toBe('user@cst.edu.bt');
      expect(response.body.data.fullName).toBe('Test User');
      expect(response.body.data.college).toBe('CST');
      expect(response.body.data.role).toBe('USER');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('No token provided');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid token');
    });

    it('should reject request with malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return user without passwordHash', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'Test User',
        college: 'CST',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.getUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.passwordHash).toBeUndefined();
      expect(response.body.data.password).toBeUndefined();
    });

    it('should handle different user roles', async () => {
      const roles = [
        { roleNum: 0, roleName: 'VISITOR' },
        { roleNum: 1, roleName: 'USER' },
        { roleNum: 2, roleName: 'ADMIN' },
      ];

      for (const { roleNum, roleName } of roles) {
        const userPayload = {
          userId: `${roleName}-123`,
          email: `${roleName.toLowerCase()}@cst.edu.bt`,
          role: roleName,
          college: 'CST',
        };

        const mockUser = {
          id: `${roleName}-123`,
          email: `${roleName.toLowerCase()}@cst.edu.bt`,
          fullName: `Test ${roleName}`,
          college: 'CST',
          role: roleNum,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        (mockAuthClient.getUser as jest.Mock).mockImplementation((_req, callback) => {
          callback(null, { user: mockUser });
        });

        const token = generateTestToken(userPayload);

        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response.body.data.role).toBe(roleName);
      }
    });

    it('should handle user not found error', async () => {
      const userPayload = {
        userId: 'nonexistent-123',
        email: 'nonexistent@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      (mockAuthClient.getUser as jest.Mock).mockImplementation((_req, callback) => {
        const error: any = new Error('User not found');
        error.code = 5; // NOT_FOUND gRPC code
        callback(error, null);
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/auth/me', () => {
    it('should successfully update user profile', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'Updated Name',
        college: 'Sherubtse',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.updateUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUpdatedUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Updated Name',
          college: 'Sherubtse',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Name');
      expect(response.body.data.college).toBe('Sherubtse');
    });

    it('should allow updating only fullName', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'New Name Only',
        college: 'CST',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.updateUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUpdatedUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'New Name Only',
        })
        .expect(200);

      expect(response.body.data.fullName).toBe('New Name Only');
    });

    it('should allow updating only college', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'Test User',
        college: 'Paro',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.updateUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUpdatedUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          college: 'Paro',
        })
        .expect(200);

      expect(response.body.data.college).toBe('Paro');
    });

    it('should reject update without token', async () => {
      const response = await request(app)
        .patch('/api/auth/me')
        .send({
          fullName: 'New Name',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject empty update request', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should validate fullName length constraints', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const token = generateTestToken(userPayload);

      // Test too short name
      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'A', // Less than 2 characters
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should validate college length constraints', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          college: 'A', // Less than 2 characters
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should not allow updating email', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt', // Email should remain unchanged
        fullName: 'Updated Name',
        college: 'CST',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.updateUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUpdatedUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Updated Name',
          email: 'newemail@cst.edu.bt', // Should be ignored
        })
        .expect(200);

      // Email should not change
      expect(response.body.data.email).toBe('user@cst.edu.bt');
    });

    it('should not allow updating role', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'Updated Name',
        college: 'CST',
        role: 1, // Role should remain USER
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.updateUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUpdatedUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Updated Name',
          role: 'ADMIN', // Should be ignored
        })
        .expect(200);

      // Role should not change
      expect(response.body.data.role).toBe('USER');
    });

    it('should return updated user without sensitive data', async () => {
      const userPayload = {
        userId: 'user-123',
        email: 'user@cst.edu.bt',
        role: 'USER',
        college: 'CST',
      };

      const mockUpdatedUser = {
        id: 'user-123',
        email: 'user@cst.edu.bt',
        fullName: 'Updated Name',
        college: 'CST',
        role: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (mockAuthClient.updateUser as jest.Mock).mockImplementation((_req, callback) => {
        callback(null, { user: mockUpdatedUser });
      });

      const token = generateTestToken(userPayload);

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Updated Name',
        })
        .expect(200);

      expect(response.body.data.passwordHash).toBeUndefined();
      expect(response.body.data.password).toBeUndefined();
    });
  });
});
