// Original file: src/proto/maintenance.proto

import type { Maintenance as _maintenance_Maintenance, Maintenance__Output as _maintenance_Maintenance__Output } from '../maintenance/Maintenance';

export interface CreateMaintenanceResponse {
  'maintenance'?: (_maintenance_Maintenance | null);
  'canceledBookingIds'?: (string)[];
}

export interface CreateMaintenanceResponse__Output {
  'maintenance': (_maintenance_Maintenance__Output | null);
  'canceledBookingIds': (string)[];
}
