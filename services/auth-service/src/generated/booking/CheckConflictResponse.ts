// Original file: src/proto/booking.proto

import type { ConflictInfo as _booking_ConflictInfo, ConflictInfo__Output as _booking_ConflictInfo__Output } from '../booking/ConflictInfo';

export interface CheckConflictResponse {
  'hasConflict'?: (boolean);
  'conflict'?: (_booking_ConflictInfo | null);
}

export interface CheckConflictResponse__Output {
  'hasConflict': (boolean);
  'conflict': (_booking_ConflictInfo__Output | null);
}
