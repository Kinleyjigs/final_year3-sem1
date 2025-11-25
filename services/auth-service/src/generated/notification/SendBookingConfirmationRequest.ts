// Original file: src/proto/notification.proto

import type { BookingDetails as _notification_BookingDetails, BookingDetails__Output as _notification_BookingDetails__Output } from '../notification/BookingDetails';

export interface SendBookingConfirmationRequest {
  'bookingId'?: (string);
  'userId'?: (string);
  'userEmail'?: (string);
  'userName'?: (string);
  'bookingDetails'?: (_notification_BookingDetails | null);
}

export interface SendBookingConfirmationRequest__Output {
  'bookingId': (string);
  'userId': (string);
  'userEmail': (string);
  'userName': (string);
  'bookingDetails': (_notification_BookingDetails__Output | null);
}
