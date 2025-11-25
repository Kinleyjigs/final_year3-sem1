"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAuthServer = startAuthServer;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const common_1 = require("@one-stop-book/common");
const auth_service_1 = require("../services/auth.service");
const PROTO_PATH = path_1.default.join(__dirname, '../proto/auth.proto');
// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
// Role enum mapping
const RoleMap = {
    VISITOR: 0,
    USER: 1,
    ADMIN: 2,
};
const RoleMapReverse = {
    0: 'VISITOR',
    1: 'USER',
    2: 'ADMIN',
};
/**
 * gRPC Register RPC handler
 */
async function handleRegister(call, callback) {
    try {
        const { email, password, full_name, college } = call.request;
        common_1.logger.info('Register RPC called', { email, college });
        const result = await auth_service_1.authService.register({
            email,
            password,
            fullName: full_name,
            college,
        });
        callback(null, {
            user: {
                id: result.user.id,
                email: result.user.email,
                full_name: result.user.fullName,
                college: result.user.college,
                role: RoleMap[result.user.role],
                created_at: result.user.createdAt.toISOString(),
                updated_at: result.user.updatedAt.toISOString(),
            },
            token: result.token,
        });
    }
    catch (error) {
        common_1.logger.error('Register RPC error', { error: error.message });
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: error.message,
        });
    }
}
/**
 * gRPC Login RPC handler
 */
async function handleLogin(call, callback) {
    try {
        const { email, password } = call.request;
        common_1.logger.info('Login RPC called', { email });
        const result = await auth_service_1.authService.login({
            email,
            password,
        });
        callback(null, {
            user: {
                id: result.user.id,
                email: result.user.email,
                full_name: result.user.fullName,
                college: result.user.college,
                role: RoleMap[result.user.role],
                created_at: result.user.createdAt.toISOString(),
                updated_at: result.user.updatedAt.toISOString(),
            },
            token: result.token,
        });
    }
    catch (error) {
        common_1.logger.error('Login RPC error', { error: error.message });
        callback({
            code: grpc.status.UNAUTHENTICATED,
            message: error.message,
        });
    }
}
/**
 * gRPC VerifyToken RPC handler
 */
async function handleVerifyToken(call, callback) {
    try {
        const { token } = call.request;
        common_1.logger.info('VerifyToken RPC called');
        const payload = auth_service_1.authService.verifyToken(token);
        if (!payload) {
            callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'Invalid or expired token',
            });
            return;
        }
        callback(null, {
            valid: true,
            user_id: payload.userId,
            email: payload.email,
            role: RoleMap[payload.role],
            college: payload.college,
        });
    }
    catch (error) {
        common_1.logger.error('VerifyToken RPC error', { error: error.message });
        callback({
            code: grpc.status.INTERNAL,
            message: error.message,
        });
    }
}
/**
 * gRPC GetUser RPC handler
 */
async function handleGetUser(call, callback) {
    try {
        const { user_id } = call.request;
        common_1.logger.info('GetUser RPC called', { userId: user_id });
        const user = await auth_service_1.authService.getUser(user_id);
        callback(null, {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            college: user.college,
            role: RoleMap[user.role],
            created_at: user.createdAt.toISOString(),
            updated_at: user.updatedAt.toISOString(),
        });
    }
    catch (error) {
        common_1.logger.error('GetUser RPC error', { error: error.message });
        callback({
            code: grpc.status.NOT_FOUND,
            message: error.message,
        });
    }
}
/**
 * gRPC UpdateUser RPC handler
 */
async function handleUpdateUser(call, callback) {
    try {
        const { user_id, full_name, college } = call.request;
        common_1.logger.info('UpdateUser RPC called', { userId: user_id });
        const user = await auth_service_1.authService.updateUser({
            userId: user_id,
            fullName: full_name,
            college,
        });
        callback(null, {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            college: user.college,
            role: RoleMap[user.role],
            created_at: user.createdAt.toISOString(),
            updated_at: user.updatedAt.toISOString(),
        });
    }
    catch (error) {
        common_1.logger.error('UpdateUser RPC error', { error: error.message });
        callback({
            code: grpc.status.NOT_FOUND,
            message: error.message,
        });
    }
}
/**
 * gRPC ValidateRole RPC handler
 */
async function handleValidateRole(call, callback) {
    try {
        const { user_id, required_role } = call.request;
        common_1.logger.info('ValidateRole RPC called', {
            userId: user_id,
            requiredRole: RoleMapReverse[required_role],
        });
        const requiredRoleName = RoleMapReverse[required_role];
        const authorized = await auth_service_1.authService.validateRole(user_id, requiredRoleName);
        callback(null, {
            authorized,
            message: authorized
                ? 'User has required role'
                : 'User does not have required role',
        });
    }
    catch (error) {
        common_1.logger.error('ValidateRole RPC error', { error: error.message });
        callback({
            code: grpc.status.INTERNAL,
            message: error.message,
        });
    }
}
/**
 * Start gRPC server
 */
function startAuthServer() {
    const server = new grpc.Server();
    server.addService(authProto.AuthService.service, {
        Register: handleRegister,
        Login: handleLogin,
        VerifyToken: handleVerifyToken,
        GetUser: handleGetUser,
        UpdateUser: handleUpdateUser,
        ValidateRole: handleValidateRole,
    });
    const port = process.env.AUTH_SERVICE_PORT || '50051';
    const host = `0.0.0.0:${port}`;
    server.bindAsync(host, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            common_1.logger.error('Failed to start Auth gRPC server', { error });
            throw error;
        }
        common_1.logger.info(`Auth gRPC server started on port ${port}`);
    });
    // Graceful shutdown
    process.on('SIGTERM', () => {
        common_1.logger.info('SIGTERM received, shutting down Auth gRPC server');
        server.tryShutdown((error) => {
            if (error) {
                common_1.logger.error('Error during server shutdown', { error });
            }
            else {
                common_1.logger.info('Auth gRPC server shut down successfully');
            }
            process.exit(error ? 1 : 0);
        });
    });
    return server;
}
//# sourceMappingURL=auth.server.js.map