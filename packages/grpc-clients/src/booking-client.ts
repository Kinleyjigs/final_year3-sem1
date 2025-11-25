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

/**
 * Booking Service gRPC Client
 * Provides type-safe access to Booking Service RPCs
 */

export interface TimeSlot {
  start_time: string;
  end_time: string;
  status: 0 | 1 | 2; // AVAILABLE = 0, BOOKED = 1, MAINTENANCE = 2
  booking_id?: string;
}

export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}

export interface MaintenanceWindow {
  id: string;
  start_date_time: string;
  end_date_time: string;
}

export interface GetAvailabilityRequest {
  ground_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  maintenance_windows?: MaintenanceWindow[];
}

export interface GetAvailabilityResponse {
  availability: DayAvailability[];
}

// Phase 6: Booking creation, retrieval, and cancellation types

export interface CreateBookingRequest {
  user_id: string;
  ground_id: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
}

export interface BookingResponse {
  id: string;
  user_id: string;
  ground_id: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
  status: string;       // PENDING, APPROVED, CANCELED, REJECTED
  confirmation_code: string;
  created_at: string;
  updated_at: string;
}

export interface GetUserBookingsRequest {
  user_id: string;
}

export interface GetUserBookingsResponse {
  bookings: BookingResponse[];
}

export interface CancelBookingRequest {
  booking_id: string;
  user_id: string;
}

export interface BookingConflictRequest {
  ground_id: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
}

export interface BookingConflictResponse {
  has_conflict: boolean;
}

/**
 * Create Booking Service gRPC client
 */
export function createBookingClient() {
  const hardcodedRoot = '/Users/yontenkinleytenzin/Desktop/final-3-year-sem1/one-stop-book';
  const projectRoot = process.env.PROJECT_ROOT || hardcodedRoot;
  const PROTO_PATH = path.join(projectRoot, 'services/booking-service/src/proto/booking.proto');
  const serviceUrl = process.env.BOOKING_SERVICE_URL || 'localhost:50053';
  
  return GrpcClientFactory.createClient({
    protoPath: PROTO_PATH,
    packageName: 'booking',
    serviceName: 'BookingService',
    serviceUrl,
  });
}

// Lazy-loaded singleton instance
let _bookingClient: any = null;
export function getBookingClient() {
  if (!_bookingClient) {
    _bookingClient = createBookingClient();
  }
  return _bookingClient;
}

// Export as bookingClient for backward compatibility
export const bookingClient = new Proxy({} as any, {
  get(_target, prop) {
    return getBookingClient()[prop];
  },
});
