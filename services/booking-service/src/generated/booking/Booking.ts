// Original file: src/proto/booking.proto

import type { BookingStatus as _booking_BookingStatus, BookingStatus__Output as _booking_BookingStatus__Output } from '../booking/BookingStatus';

export interface Booking {
  'id'?: (string);
  'userId'?: (string);
  'groundId'?: (string);
  'groundName'?: (string);
  'bookingDate'?: (string);
  'startTime'?: (string);
  'endTime'?: (string);
  'status'?: (_booking_BookingStatus);
  'confirmationCode'?: (string);
  'cancellationReason'?: (string);
  'createdAt'?: (string);
  'updatedAt'?: (string);
}

export interface Booking__Output {
  'id': (string);
  'userId': (string);
  'groundId': (string);
  'groundName': (string);
  'bookingDate': (string);
  'startTime': (string);
  'endTime': (string);
  'status': (_booking_BookingStatus__Output);
  'confirmationCode': (string);
  'cancellationReason': (string);
  'createdAt': (string);
  'updatedAt': (string);
}
