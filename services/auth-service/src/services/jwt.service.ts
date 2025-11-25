import jwt from 'jsonwebtoken';
import { logger } from '@one-stop-book/common';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  college: string;
}

interface JwtOptions {
  expiresIn?: string;
}

export class JwtService {
  private readonly secret: string;
  private readonly defaultExpiry: string = '24h';

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    
    if (this.secret === 'default-secret-change-in-production' && process.env.NODE_ENV === 'production') {
      logger.error('JWT_SECRET not set in production environment');
      throw new Error('JWT_SECRET must be set in production');
    }
  }

  /**
   * Generate JWT token with user claims
   * @param payload User claims (userId, email, role, college)
   * @param options JWT options (expiresIn)
   * @returns Signed JWT token
   */
  generateToken(payload: JwtPayload, options?: JwtOptions): string {
    const expiresIn = options?.expiresIn || this.defaultExpiry;

    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        college: payload.college,
      },
      this.secret,
      {
        expiresIn: expiresIn as string | number,
        issuer: 'one-stop-book-auth-service',
        audience: 'one-stop-book-platform',
      }
    );

    logger.info('JWT token generated', {
      userId: payload.userId,
      role: payload.role,
      expiresIn,
    });

    return token;
  }

  /**
   * Verify and decode JWT token
   * @param token JWT token string
   * @returns Decoded payload or null if invalid
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: 'one-stop-book-auth-service',
        audience: 'one-stop-book-platform',
      }) as JwtPayload;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        college: decoded.college,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn('JWT token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid JWT token', { error: error.message });
      } else {
        logger.error('JWT verification error', { error });
      }
      return null;
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   * @param token JWT token string
   * @returns Decoded payload or null
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      logger.error('JWT decode error', { error });
      return null;
    }
  }
}

// Singleton instance
export const jwtService = new JwtService();
