import { JwtService } from '../../src/services/jwt.service';
import jwt from 'jsonwebtoken';

describe('JwtService - Token Generation and Validation (T077)', () => {
  let jwtService: JwtService;
  const testSecret = 'test-jwt-secret-for-testing-only';
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = testSecret;
  });

  beforeEach(() => {
    jwtService = new JwtService();
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  describe('Token Generation', () => {
    it('should generate valid JWT token with correct payload', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts: header.payload.signature
    });

    it('should include userId, email, role, and college in token payload', () => {
      const payload = {
        userId: 'user-456',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
        college: 'Sherubtse',
      };

      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe('user-456');
      expect(decoded.email).toBe('admin@example.com');
      expect(decoded.role).toBe('ADMIN');
      expect(decoded.college).toBe('Sherubtse');
    });

    it('should set token expiry to 24 hours', () => {
      const payload = {
        userId: 'user-789',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const beforeGeneration = Math.floor(Date.now() / 1000);
      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token) as any;

      // Token should expire in approximately 24 hours (86400 seconds)
      const expectedExpiry = beforeGeneration + 86400;
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExpiry - 5); // Allow 5 second tolerance
      expect(decoded.exp).toBeLessThanOrEqual(expectedExpiry + 5);
    });

    it('should include issuer and audience claims', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.iss).toBe('one-stop-book-auth-service');
      expect(decoded.aud).toBe('one-stop-book-platform');
    });

    it('should include iat (issued at) timestamp', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const beforeGeneration = Math.floor(Date.now() / 1000);
      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.iat).toBeDefined();
      expect(decoded.iat).toBeGreaterThanOrEqual(beforeGeneration - 1);
      expect(decoded.iat).toBeLessThanOrEqual(beforeGeneration + 1);
    });

    it('should generate different tokens for same payload (due to iat)', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token1 = jwtService.generateToken(payload);
      
      // Wait 1 second to ensure different iat
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const token2 = jwtService.generateToken(payload);

      expect(token1).not.toBe(token2);
    });
  });

  describe('Token Verification', () => {
    it('should successfully verify valid token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const result = jwtService.verifyToken(token);

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result?.userId).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
      expect(result?.role).toBe('USER');
      expect(result?.college).toBe('CST');
    });

    it('should reject token with invalid signature', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      // Generate token with different secret
      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '24h' });
      const result = jwtService.verifyToken(token);

      expect(result).toBeNull();
    });

    it('should reject expired token', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      // Generate token that expired 1 second ago
      const token = jwt.sign(payload, testSecret, { expiresIn: '-1s' });
      const result = jwtService.verifyToken(token);

      expect(result).toBeNull();
    });

    it('should reject malformed token', () => {
      const malformedToken = 'this.is.not.a.valid.jwt.token';
      const result = jwtService.verifyToken(malformedToken);

      expect(result).toBeNull();
    });

    it('should reject empty token', () => {
      const result = jwtService.verifyToken('');

      expect(result).toBeNull();
    });

    it('should verify token returns correct payload structure', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const result = jwtService.verifyToken(token);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('college');
    });
  });

  describe('Token Decoding', () => {
    it('should decode token without verification', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const decoded = jwtService.decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('user-123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.role).toBe('USER');
      expect(decoded?.college).toBe('CST');
    });

    it('should decode expired token (without verification)', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const expiredToken = jwt.sign(payload, testSecret, { expiresIn: '-1h' });
      const decoded = jwtService.decodeToken(expiredToken);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('user-123');
    });

    it('should return null for malformed token', () => {
      const decoded = jwtService.decodeToken('invalid.token');

      expect(decoded).toBeNull();
    });
  });

  describe('Token Payload Structure', () => {
    it('should support USER role', () => {
      const payload = {
        userId: 'user-123',
        email: 'user@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const result = jwtService.verifyToken(token);

      expect(result?.role).toBe('USER');
    });

    it('should support ADMIN role', () => {
      const payload = {
        userId: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const result = jwtService.verifyToken(token);

      expect(result?.role).toBe('ADMIN');
    });

    it('should support VISITOR role', () => {
      const payload = {
        userId: 'visitor-123',
        email: 'visitor@example.com',
        role: 'VISITOR' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const result = jwtService.verifyToken(token);

      expect(result?.role).toBe('VISITOR');
    });

    it('should support different college values', () => {
      const colleges = ['CST', 'Sherubtse', 'Paro', 'JNEC', 'RTC'];

      colleges.forEach(college => {
        const payload = {
          userId: 'user-123',
          email: 'test@example.com',
          role: 'USER' as const,
          college,
        };

        const token = jwtService.generateToken(payload);
        const result = jwtService.verifyToken(token);

        expect(result?.college).toBe(college);
      });
    });
  });

  describe('JWT Security', () => {
    it('should require JWT_SECRET in production', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalSecret = process.env.JWT_SECRET;

      try {
        process.env.NODE_ENV = 'production';
        delete process.env.JWT_SECRET;
        expect(() => new JwtService()).toThrow('JWT_SECRET must be set in production');
      } finally {
        process.env.NODE_ENV = originalEnv;
        process.env.JWT_SECRET = originalSecret;
      }
    });

    it('should use HS256 algorithm for signing', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER' as const,
        college: 'CST',
      };

      const token = jwtService.generateToken(payload);
      const decoded = jwt.decode(token, { complete: true }) as any;

      expect(decoded.header.alg).toBe('HS256');
    });
  });
});
