"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@one-stop-book/common");
const grpc_clients_1 = require("@one-stop-book/grpc-clients");
class AuthController {
    /**
     * POST /api/auth/register
     * Register a new user
     */
    static async register(req, res) {
        try {
            const { email, password, fullName, college } = req.body;
            common_1.logger.info('Register request received', { email, college });
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.authClient.Register({
                    email,
                    password,
                    full_name: fullName,
                    college,
                }, (error, response) => {
                    if (error)
                        reject(error);
                    else
                        resolve(response);
                });
            });
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: response.user.id,
                        email: response.user.email,
                        fullName: response.user.full_name,
                        college: response.user.college,
                        role: getRoleName(response.user.role),
                        createdAt: response.user.created_at,
                        updatedAt: response.user.updated_at,
                    },
                    token: response.token,
                },
                message: 'User registered successfully',
            });
        }
        catch (error) {
            common_1.logger.error('Register error', { error: error.message });
            res.status(400).json({
                success: false,
                error: error.details || error.message || 'Registration failed',
            });
        }
    }
    /**
     * POST /api/auth/login
     * Login user
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            common_1.logger.info('Login request received', { email });
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.authClient.Login({
                    email,
                    password,
                }, (error, response) => {
                    if (error)
                        reject(error);
                    else
                        resolve(response);
                });
            });
            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: response.user.id,
                        email: response.user.email,
                        fullName: response.user.full_name,
                        college: response.user.college,
                        role: getRoleName(response.user.role),
                        createdAt: response.user.created_at,
                        updatedAt: response.user.updated_at,
                    },
                    token: response.token,
                },
                message: 'Login successful',
            });
        }
        catch (error) {
            common_1.logger.error('Login error', { error: error.message });
            res.status(401).json({
                success: false,
                error: error.details || error.message || 'Invalid credentials',
            });
        }
    }
    /**
     * GET /api/auth/me
     * Get current user profile
     */
    static async getMe(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                });
            }
            common_1.logger.info('Get profile request', { userId });
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.authClient.GetUser({
                    user_id: userId,
                }, (error, response) => {
                    if (error)
                        reject(error);
                    else
                        resolve(response);
                });
            });
            res.status(200).json({
                success: true,
                data: {
                    id: response.id,
                    email: response.email,
                    fullName: response.full_name,
                    college: response.college,
                    role: getRoleName(response.role),
                    createdAt: response.created_at,
                    updatedAt: response.updated_at,
                },
            });
        }
        catch (error) {
            common_1.logger.error('Get profile error', { error: error.message });
            res.status(404).json({
                success: false,
                error: error.details || error.message || 'User not found',
            });
        }
    }
    /**
     * PATCH /api/auth/me
     * Update current user profile
     */
    static async updateMe(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                });
            }
            const { fullName, college } = req.body;
            common_1.logger.info('Update profile request', { userId, fullName, college });
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.authClient.UpdateUser({
                    user_id: userId,
                    full_name: fullName,
                    college,
                }, (error, response) => {
                    if (error)
                        reject(error);
                    else
                        resolve(response);
                });
            });
            res.status(200).json({
                success: true,
                data: {
                    id: response.id,
                    email: response.email,
                    fullName: response.full_name,
                    college: response.college,
                    role: getRoleName(response.role),
                    createdAt: response.created_at,
                    updatedAt: response.updated_at,
                },
                message: 'Profile updated successfully',
            });
        }
        catch (error) {
            common_1.logger.error('Update profile error', { error: error.message });
            res.status(400).json({
                success: false,
                error: error.details || error.message || 'Update failed',
            });
        }
    }
}
exports.AuthController = AuthController;
/**
 * Convert role enum to string
 */
function getRoleName(role) {
    const roleMap = {
        0: 'VISITOR',
        1: 'USER',
        2: 'ADMIN',
    };
    return roleMap[role] || 'UNKNOWN';
}
//# sourceMappingURL=auth.controller.js.map