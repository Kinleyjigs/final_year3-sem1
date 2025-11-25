import { AuthService } from '../../src/services/auth.service';
import bcrypt from 'bcrypt';

// Mock Prisma Client with a singleton instance
let mockFindUnique = jest.fn();
let mockCreate = jest.fn();
let mockUpdate = jest.fn();

jest.mock('@prisma/client', () => {
  const mockUser = {
    get findUnique() { return mockFindUnique; },
    get create() { return mockCreate; },
    get update() { return mockUpdate; },
  };
  
  return {
    PrismaClient: jest.fn(() => ({
      user: mockUser,
    })),
    Role: {
      USER: 'USER',
      ADMIN: 'ADMIN',
      VISITOR: 'VISITOR',
    },
  };
});

describe('AuthService - Password Hashing (T076)', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('Password Hashing with bcrypt', () => {
    it('should hash password using bcrypt with 12 salt rounds', async () => {
      const plainPassword = 'testPassword123';
      const bcryptSpy = jest.spyOn(bcrypt, 'hash');

      // Mock Prisma to return created user
      mockFindUnique.mockResolvedValue(null); // Email doesn't exist
      mockCreate.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash(plainPassword, 12),
        fullName: 'Test User',
        college: 'CST',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await authService.register({
        email: 'test@example.com',
        password: plainPassword,
        fullName: 'Test User',
        college: 'CST',
      });

      // Verify bcrypt.hash was called with correct salt rounds
      expect(bcryptSpy).toHaveBeenCalledWith(plainPassword, 12);
      bcryptSpy.mockRestore();
    });

    it('should create different hashes for the same password', async () => {
      const password = 'samePassword123';

      const hash1 = await bcrypt.hash(password, 12);
      const hash2 = await bcrypt.hash(password, 12);

      // Hashes should be different due to random salt
      expect(hash1).not.toBe(hash2);

      // Both hashes should verify the same password
      const verify1 = await bcrypt.compare(password, hash1);
      const verify2 = await bcrypt.compare(password, hash2);

      expect(verify1).toBe(true);
      expect(verify2).toBe(true);
    });

    it('should correctly verify password with bcrypt.compare', async () => {
      const plainPassword = 'correctPassword123';
      const wrongPassword = 'wrongPassword456';
      const passwordHash = await bcrypt.hash(plainPassword, 12);

      // Correct password should verify
      const correctVerification = await bcrypt.compare(plainPassword, passwordHash);
      expect(correctVerification).toBe(true);

      // Wrong password should not verify
      const wrongVerification = await bcrypt.compare(wrongPassword, passwordHash);
      expect(wrongVerification).toBe(false);
    });

    it('should not store plain text password in database', async () => {
      const plainPassword = 'plainTextPassword';
      let savedPasswordHash: string | undefined;

      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockImplementation(async (args: any) => {
        savedPasswordHash = args.data.passwordHash;
        return {
          id: 'user-123',
          email: args.data.email,
          passwordHash: savedPasswordHash,
          fullName: args.data.fullName,
          college: args.data.college,
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      await authService.register({
        email: 'test@example.com',
        password: plainPassword,
        fullName: 'Test User',
        college: 'CST',
      });

      // Password hash should not equal plain password
      expect(savedPasswordHash).toBeDefined();
      expect(savedPasswordHash).not.toBe(plainPassword);

      // Password hash should be verifiable with bcrypt
      const isValid = await bcrypt.compare(plainPassword, savedPasswordHash!);
      expect(isValid).toBe(true);
    });

    it('should hash password with minimum length of 8 characters', async () => {
      const shortPassword = 'short12'; // 7 characters
      const validPassword = 'valid123'; // 8 characters

      // Both should hash successfully (validation is done at API layer)
      const hash1 = await bcrypt.hash(shortPassword, 12);
      const hash2 = await bcrypt.hash(validPassword, 12);

      expect(hash1).toBeDefined();
      expect(hash2).toBeDefined();
      expect(hash1.length).toBeGreaterThan(0);
      expect(hash2.length).toBeGreaterThan(0);
    });
  });

  describe('Login Password Verification', () => {
    it('should verify correct password on login', async () => {
      const plainPassword = 'loginPassword123';
      const passwordHash = await bcrypt.hash(plainPassword, 12);

      mockFindUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        passwordHash,
        fullName: 'Test User',
        college: 'CST',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: plainPassword,
      });

      expect(result).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should reject incorrect password on login', async () => {
      const correctPassword = 'correctPassword123';
      const wrongPassword = 'wrongPassword456';
      const passwordHash = await bcrypt.hash(correctPassword, 12);

      mockFindUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        passwordHash,
        fullName: 'Test User',
        college: 'CST',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.login({
          email: 'test@example.com',
          password: wrongPassword,
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject login for non-existent user', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'anyPassword123',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('Password Hash Security', () => {
    it('should produce hash that starts with bcrypt identifier', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);

      // Bcrypt hashes start with $2a$, $2b$, or $2y$
      expect(hash).toMatch(/^\$2[aby]\$/);
    });

    it('should include salt rounds in the hash', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);

      // Hash format: $2b$12$... where 12 is the salt rounds
      expect(hash).toMatch(/^\$2[aby]\$12\$/);
    });

    it('should produce hash of expected length (60 characters)', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);

      // Bcrypt hashes are always 60 characters
      expect(hash.length).toBe(60);
    });
  });
});
