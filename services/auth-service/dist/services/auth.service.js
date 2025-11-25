"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const common_1 = require("@one-stop-book/common");
const jwt_service_1 = require("./jwt.service");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 12;
class AuthService {
    /**
     * Register a new user with bcrypt password hashing
     * @param input Registration data
     * @returns User and JWT token
     */
    async register(input) {
        const { email, password, fullName, college } = input;
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            common_1.logger.warn('Registration attempt with existing email', { email });
            throw new Error('User with this email already exists');
        }
        // Validate password length
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        // Hash password with bcrypt
        const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        // Create user with default role USER
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                college,
                role: client_1.Role.USER,
            },
        });
        common_1.logger.info('User registered successfully', {
            userId: user.id,
            email: user.email,
            college: user.college,
        });
        // Generate JWT token
        const token = jwt_service_1.jwtService.generateToken({
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
    async login(input) {
        const { email, password } = input;
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            common_1.logger.warn('Login attempt with non-existent email', { email });
            throw new Error('Invalid email or password');
        }
        // Verify password with bcrypt
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            common_1.logger.warn('Login attempt with incorrect password', {
                userId: user.id,
                email: user.email,
            });
            throw new Error('Invalid email or password');
        }
        common_1.logger.info('User logged in successfully', {
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Generate JWT token
        const token = jwt_service_1.jwtService.generateToken({
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
    async getUser(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            common_1.logger.warn('User not found', { userId });
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
    async updateUser(input) {
        const { userId, fullName, college } = input;
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            common_1.logger.warn('Update attempt for non-existent user', { userId });
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
        common_1.logger.info('User profile updated', {
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
    async validateRole(userId, requiredRole) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return false;
        }
        // ADMIN has access to all roles
        if (user.role === client_1.Role.ADMIN) {
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
    verifyToken(token) {
        return jwt_service_1.jwtService.verifyToken(token);
    }
}
exports.AuthService = AuthService;
// Singleton instance
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map