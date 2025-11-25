import { GrpcClientFactory, GrpcClientOptions } from './factory';
import path from 'path';
import fs from 'fs';

/**
 * Find project root by looking for package.json with workspaces
 */
function findProjectRoot(): string {
  const logFile = '/tmp/grpc-client-debug.log';
  const log = (msg: string) => fs.appendFileSync(logFile, `${new Date().toISOString()} ${msg}\n`);
  
  log(`[findProjectRoot] Starting`);
  log(`[findProjectRoot] __dirname: ${__dirname}`);
  log(`[findProjectRoot] process.cwd(): ${process.cwd()}`);
  log(`[findProjectRoot] PROJECT_ROOT env: ${process.env.PROJECT_ROOT}`);
  
  // Priority 1: Use environment variable if set
  if (process.env.PROJECT_ROOT) {
    log(`[findProjectRoot] Using PROJECT_ROOT: ${process.env.PROJECT_ROOT}`);
    return process.env.PROJECT_ROOT;
  }
  
  // Priority 2: Assume we're in packages/grpc-clients/src when built
  // Go up 3 levels: src -> grpc-clients -> packages -> root
  const fallbackPath = path.resolve(__dirname, '../../..');
  log(`[findProjectRoot] Fallback path: ${fallbackPath}`);
  
  // Verify this is actually the monorepo root
  const pkgPath = path.join(fallbackPath, 'package.json');
  log(`[findProjectRoot] Checking ${pkgPath}`);
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) {
        log(`[findProjectRoot] Found workspaces in fallback, returning: ${fallbackPath}`);
        return fallbackPath;
      }
      log(`[findProjectRoot] No workspaces in ${pkgPath}`);
    } catch (e) {
      log(`[findProjectRoot] Error reading ${pkgPath}: ${e}`);
    }
  } else {
    log(`[findProjectRoot] ${pkgPath} does not exist`);
  }
  
  // Priority 3: Search up from __dirname
  let currentDir = __dirname;
  log(`[findProjectRoot] Searching up from __dirname`);
  while (currentDir !== '/' && currentDir.length > 1) {
    const pkgPath2 = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath2)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath2, 'utf-8'));
        if (pkg.workspaces) {
          log(`[findProjectRoot] Found workspaces at: ${currentDir}`);
          return currentDir;
        }
      } catch (e) {}
    }
    currentDir = path.dirname(currentDir);
  }
  
  // Last resort: return the fallback
  log(`[findProjectRoot] Returning fallback: ${fallbackPath}`);
  return fallbackPath;
}

export interface SearchGroundsRequest {
  college?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface Ground {
  id: string;
  name: string;
  college: string;
  location: string;
  description: string;
  capacity: number;
  amenities: string[];
  photos: string[];
  is_active: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
  peak_hours?: any;
  admin_user_id?: string;
}

export interface SearchGroundsResponse {
  grounds: Ground[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface GetGroundRequest {
  id: string;
}

export interface IsPeakTimeRequest {
  ground_id: string;
  date_time: string;
}

export interface IsPeakTimeResponse {
  is_peak: boolean;
}

/**
 * Create a gRPC client for the Grounds Service
 */
export function createGroundsClient(serviceUrl?: string) {
  // HARDCODED FIX for development - use absolute path
  const hardcodedRoot = '/Users/yontenkinleytenzin/Desktop/final-3-year-sem1/one-stop-book';
  const projectRoot = process.env.PROJECT_ROOT || hardcodedRoot;
  const protoPath = path.join(projectRoot, 'services/grounds-service/src/proto/grounds.proto');
  
  const options: GrpcClientOptions = {
    protoPath,
    packageName: 'grounds',
    serviceName: 'GroundsService',
    serviceUrl: serviceUrl || process.env.GROUNDS_SERVICE_URL || 'localhost:50052',
  };

  return GrpcClientFactory.createClient<any>(options);
}

// Lazy-loaded singleton instance - only created when first accessed
let _groundsClient: any = null;
function getGroundsClient() {
  if (!_groundsClient) {
    _groundsClient = createGroundsClient();
  }
  return _groundsClient;
}

// Export a Proxy that defers client creation until first method call
export const groundsClient = new Proxy({} as any, {
  get(_target, prop) {
    return getGroundsClient()[prop];
  }
});
