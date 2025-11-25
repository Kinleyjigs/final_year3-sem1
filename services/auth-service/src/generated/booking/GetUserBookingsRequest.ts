// Original file: src/proto/booking.proto

import type { BookingStatus as _booking_BookingStatus, BookingStatus__Output as _booking_BookingStatus__Output } from '../booking/BookingStatus';

export interface GetUserBookingsRequest {
  'userId'?: (string);
  'status'?: (_booking_BookingStatus);
  'page'?: (number);
  'limit'?: (number);
  '_status'?: "status";
}

export interface GetUserBookingsRequest__Output {
  'userId': (string);
  'status'?: (_booking_BookingStatus__Output);
  'page': (number);
  'limit': (number);
  '_status'?: "status";
}
