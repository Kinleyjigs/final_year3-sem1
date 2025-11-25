// Original file: src/proto/notification.proto

import type { BookingDetails as _notification_BookingDetails, BookingDetails__Output as _notification_BookingDetails__Output } from '../notification/BookingDetails';

export interface SendBookingCancellationRequest {
  'bookingId'?: (string);
  'userId'?: (string);
  'userEmail'?: (string);
  'userName'?: (string);
  'bookingDetails'?: (_notification_BookingDetails | null);
  'cancellationReason'?: (string);
  'canceledByAdmin'?: (boolean);
}

export interface SendBookingCancellationRequest__Output {
  'bookingId': (string);
  'userId': (string);
  'userEmail': (string);
  'userName': (string);
  'bookingDetails': (_notification_BookingDetails__Output | null);
  'cancellationReason': (string);
  'canceledByAdmin': (boolean);
}
