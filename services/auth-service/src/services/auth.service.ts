import bcrypt from 'bcrypt';
import { PrismaClient, User, Role } from '@prisma/client';
import { logger } from '@one-stop-book/common';
import { jwtService } from './jwt.service';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  college: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateUserInput {
  userId: string;
  fullName?: string;
  college?: string;
}

interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export class AuthService {
  /**
   * Register a new user with bcrypt password hashing
   * @param input Registration data
   * @returns User and JWT token
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, fullName, college } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.warn('Registration attempt with existing email', { email });
      throw new Error('User with this email already exists');
    }

    // Validate password length
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user with default role USER
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        college,
        role: Role.USER,
      },
    });

    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      college: user.college,
    });

    // Generate JWT token
    const token = jwtService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      college: user.college,
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login user with credential validation
   * @param input Login credentials
   * @returns User and JWT token
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new Error('Invalid email or password');
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      logger.warn('Login attempt with incorrect password', {
        userId: user.id,
        email: user.email,
      });
      throw new Error('Invalid email or password');
    }

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Generate JWT token
    const token = jwtService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      college: user.college,
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Get user by ID
   * @param userId User ID
   * @returns User without password hash
   */
  async getUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.warn('User not found', { userId });
      throw new Error('User not found');
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user profile
   * @param input Update data
   * @returns Updated user without password hash
   */
  async updateUser(input: UpdateUserInput): Promise<Omit<User, 'passwordHash'>> {
    const { userId, fullName, college } = input;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      logger.warn('Update attempt for non-existent user', { userId });
      throw new Error('User not found');
    }

    // Update user with provided fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(college && { college }),
      },
    });

    logger.info('User profile updated', {
      userId: updatedUser.id,
      updatedFields: { fullName, college },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Validate user has required role
   * @param userId User ID
   * @param requiredRole Required role
   * @returns True if authorized
   */
  async validateRole(userId: string, requiredRole: Role): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    // ADMIN has access to all roles
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user has exact role match
    return user.role === requiredRole;
  }

  /**
   * Verify JWT token and return payload
   * @param token JWT token
   * @returns Token payload or null
   */
  verifyToken(token: string) {
    return jwtService.verifyToken(token);
  }
}

// Singleton instance
export const authService = new AuthService();
