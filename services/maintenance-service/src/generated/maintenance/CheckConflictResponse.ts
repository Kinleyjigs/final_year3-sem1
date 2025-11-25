// Original file: src/proto/maintenance.proto

import type { Maintenance as _maintenance_Maintenance, Maintenance__Output as _maintenance_Maintenance__Output } from '../maintenance/Maintenance';

export interface CheckConflictResponse {
  'hasConflict'?: (boolean);
  'message'?: (string);
  'conflictingWindows'?: (_maintenance_Maintenance)[];
}

export interface CheckConflictResponse__Output {
  'hasConflict': (boolean);
  'message': (string);
  'conflictingWindows': (_maintenance_Maintenance__Output)[];
}
