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
 * T127: Notification Service gRPC Client
 * Provides type-safe access to Notification Service RPCs
 */

export interface SendBookingConfirmationRequest {
  user_name: string;
  user_email: string;
  ground_name: string;
  college: string;
  location: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
  confirmation_code: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
}

export interface SendBookingCancellationRequest {
  user_name: string;
  user_email: string;
  ground_name: string;
  college: string;
  location: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  confirmation_code: string;
}

export interface NotificationResponse {
  success: boolean;
}

/**
 * Create Notification Service gRPC client
 */
export function createNotificationClient() {
  const PROTO_PATH = path.join(findProjectRoot(), 'services/notification-service/src/proto/notification.proto');
  const serviceUrl = process.env.NOTIFICATION_SERVICE_URL || 'localhost:50055';
  
  return GrpcClientFactory.createClient({
    protoPath: PROTO_PATH,
    packageName: 'notification',
    serviceName: 'NotificationService',
    serviceUrl,
  });
}

// Lazy-loaded singleton instance
let _notificationClient: any = null;
export function getNotificationClient() {
  if (!_notificationClient) {
    _notificationClient = createNotificationClient();
  }
  return _notificationClient;
}

// Export as notificationClient for backward compatibility
export const notificationClient = new Proxy({} as any, {
  get(_target, prop) {
    return getNotificationClient()[prop];
  },
});
