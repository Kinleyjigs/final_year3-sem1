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
  
  let currentDir = __dirname;
  while (currentDir !== '/') {
    const pkgPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  return process.cwd();
}

/**
 * Maintenance Service gRPC Client
 * Provides type-safe access to Maintenance Service RPCs
 */

export interface Maintenance {
  id: string;
  ground_id: string;
  ground_name: string;
  start_date_time: string; // ISO 8601
  end_date_time: string;   // ISO 8601
  description: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface GetGroundMaintenanceRequest {
  ground_id: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
}

export interface GetGroundMaintenanceResponse {
  maintenance_windows: Maintenance[];
}

export interface CheckConflictRequest {
  ground_id: string;
  start_date_time: string; // ISO 8601
  end_date_time: string;   // ISO 8601
}

export interface CheckConflictResponse {
  has_conflict: boolean;
  message: string;
  conflicting_windows: Maintenance[];
}

/**
 * Create Maintenance Service gRPC client
 */
export function createMaintenanceClient() {
  const PROTO_PATH = path.join(findProjectRoot(), 'services/maintenance-service/src/proto/maintenance.proto');
  const serviceUrl = process.env.MAINTENANCE_SERVICE_URL || 'localhost:50054';
  
  return GrpcClientFactory.createClient({
    protoPath: PROTO_PATH,
    packageName: 'maintenance',
    serviceName: 'MaintenanceService',
    serviceUrl,
  });
}

// Lazy-loaded singleton instance
let _maintenanceClient: any = null;
export function getMaintenanceClient() {
  if (!_maintenanceClient) {
    _maintenanceClient = createMaintenanceClient();
  }
  return _maintenanceClient;
}

// Export as maintenanceClient for backward compatibility
export const maintenanceClient = new Proxy({} as any, {
  get(_target, prop) {
    return getMaintenanceClient()[prop];
  },
});
