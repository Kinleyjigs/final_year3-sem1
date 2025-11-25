import { GrpcClientFactory } from './factory';
import path from 'path';
import fs from 'fs';

/**
 * Find project root by looking for package.json with workspaces
 */
function findProjectRoot(): string {
  if (process.env.PROJECT_ROOT) {
    return process.env.PROJECT_ROOT;
  }
  
  const fallbackPath = path.resolve(__dirname, '../../..');
  const pkgPath = path.join(fallbackPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) {
        return fallbackPath;
      }
    } catch (e) {}
  }
  
  let currentDir = __dirname;
  while (currentDir !== '/' && currentDir.length > 1) {
    const pkgPath2 = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath2)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath2, 'utf-8'));
        if (pkg.workspaces) {
          return currentDir;
        }
      } catch (e) {}
    }
    currentDir = path.dirname(currentDir);
  }
  
  return fallbackPath;
}

// TypeScript interfaces for Auth Service
export interface User {
  id: string;
  email: string;
  full_name: string;
  college: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export enum Role {
  VISITOR = 0,
  USER = 1,
  ADMIN = 2,
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  college: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user_id: string;
  email: string;
  role: Role;
  college: string;
}

export interface GetUserRequest {
  user_id: string;
}

export interface UpdateUserRequest {
  user_id: string;
  full_name?: string;
  college?: string;
}

export interface ValidateRoleRequest {
  user_id: string;
  required_role: Role;
}

export interface ValidateRoleResponse {
  authorized: boolean;
  message: string;
}

/**
 * Create Auth gRPC client
 */
export function createAuthClient(serviceUrl?: string) {
  const hardcodedRoot = '/Users/yontenkinleytenzin/Desktop/final-3-year-sem1/one-stop-book';
  const projectRoot = process.env.PROJECT_ROOT || hardcodedRoot;
  const PROTO_PATH = path.join(projectRoot, 'services/auth-service/src/proto/auth.proto');
  const url = serviceUrl || process.env.AUTH_SERVICE_URL || 'localhost:50051';

  return GrpcClientFactory.createClient({
    protoPath: PROTO_PATH,
    packageName: 'auth',
    serviceName: 'AuthService',
    serviceUrl: url,
  });
}

// Lazy-loaded singleton instance
let _authClient: any = null;
export function getAuthClient() {
  if (!_authClient) {
    _authClient = createAuthClient();
  }
  return _authClient;
}

// Export as authClient for backward compatibility
export const authClient = new Proxy({} as any, {
  get(_target, prop) {
    return getAuthClient()[prop];
  },
});
