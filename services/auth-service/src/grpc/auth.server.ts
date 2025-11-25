import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { logger } from '@one-stop-book/common';
import { authService } from '../services/auth.service';

const PROTO_PATH = path.join(__dirname, '../proto/auth.proto');

// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth as any;

// Role enum mapping
const RoleMap: Record<string, number> = {
  VISITOR: 0,
  USER: 1,
  ADMIN: 2,
};

const RoleMapReverse: Record<number, string> = {
  0: 'VISITOR',
  1: 'USER',
  2: 'ADMIN',
};

/**
 * gRPC Register RPC handler
 */
async function handleRegister(call: any, callback: any) {
  try {
    const { email, password, full_name, college } = call.request;

    logger.info('Register RPC called', { email, college });

    const result = await authService.register({
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
  } catch (error: any) {
    logger.error('Register RPC error', { error: error.message });
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: error.message,
    });
  }
}

/**
 * gRPC Login RPC handler
 */
async function handleLogin(call: any, callback: any) {
  try {
    const { email, password } = call.request;

    logger.info('Login RPC called', { email });

    const result = await authService.login({
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
  } catch (error: any) {
    logger.error('Login RPC error', { error: error.message });
    callback({
      code: grpc.status.UNAUTHENTICATED,
      message: error.message,
    });
  }
}

/**
 * gRPC VerifyToken RPC handler
 */
async function handleVerifyToken(call: any, callback: any) {
  try {
    const { token } = call.request;

    logger.info('VerifyToken RPC called');

    const payload = authService.verifyToken(token);

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
  } catch (error: any) {
    logger.error('VerifyToken RPC error', { error: error.message });
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
}

/**
 * gRPC GetUser RPC handler
 */
async function handleGetUser(call: any, callback: any) {
  try {
    const { user_id } = call.request;

    logger.info('GetUser RPC called', { userId: user_id });

    const user = await authService.getUser(user_id);

    callback(null, {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      college: user.college,
      role: RoleMap[user.role],
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    });
  } catch (error: any) {
    logger.error('GetUser RPC error', { error: error.message });
    callback({
      code: grpc.status.NOT_FOUND,
      message: error.message,
    });
  }
}

/**
 * gRPC UpdateUser RPC handler
 */
async function handleUpdateUser(call: any, callback: any) {
  try {
    const { user_id, full_name, college } = call.request;

    logger.info('UpdateUser RPC called', { userId: user_id });

    const user = await authService.updateUser({
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
  } catch (error: any) {
    logger.error('UpdateUser RPC error', { error: error.message });
    callback({
      code: grpc.status.NOT_FOUND,
      message: error.message,
    });
  }
}

/**
 * gRPC ValidateRole RPC handler
 */
async function handleValidateRole(call: any, callback: any) {
  try {
    const { user_id, required_role } = call.request;

    logger.info('ValidateRole RPC called', {
      userId: user_id,
      requiredRole: RoleMapReverse[required_role],
    });

    const requiredRoleName = RoleMapReverse[required_role] as any;
    const authorized = await authService.validateRole(user_id, requiredRoleName);

    callback(null, {
      authorized,
      message: authorized
        ? 'User has required role'
        : 'User does not have required role',
    });
  } catch (error: any) {
    logger.error('ValidateRole RPC error', { error: error.message });
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
}

/**
 * Start gRPC server
 */
export function startAuthServer() {
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

  server.bindAsync(
    host,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error('Failed to start Auth gRPC server', { error });
        throw error;
      }

      logger.info(`Auth gRPC server started on port ${port}`);
    }
  );

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down Auth gRPC server');
    server.tryShutdown((error) => {
      if (error) {
        logger.error('Error during server shutdown', { error });
      } else {
        logger.info('Auth gRPC server shut down successfully');
      }
      process.exit(error ? 1 : 0);
    });
  });

  return server;
}

/**
 * Auth Server class wrapper for consistent API
 */
class AuthServer {
  private server: grpc.Server | null = null;

  async start(port?: number): Promise<void> {
    this.server = startAuthServer();
  }

  async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.tryShutdown((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

// Export singleton instance
export const authServer = new AuthServer();
