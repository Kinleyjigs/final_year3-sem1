// Original file: src/proto/booking.proto

import type { Booking as _booking_Booking, Booking__Output as _booking_Booking__Output } from '../booking/Booking';
import type { ConflictInfo as _booking_ConflictInfo, ConflictInfo__Output as _booking_ConflictInfo__Output } from '../booking/ConflictInfo';

export interface CreateBookingResponse {
  'booking'?: (_booking_Booking | null);
  'conflict'?: (_booking_ConflictInfo | null);
}

export interface CreateBookingResponse__Output {
  'booking': (_booking_Booking__Output | null);
  'conflict': (_booking_ConflictInfo__Output | null);
}
