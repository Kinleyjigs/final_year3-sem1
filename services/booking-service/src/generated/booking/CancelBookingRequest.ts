// Original file: src/proto/booking.proto


export interface CancelBookingRequest {
  'bookingId'?: (string);
  'userId'?: (string);
  'reason'?: (string);
  '_reason'?: "reason";
}

export interface CancelBookingRequest__Output {
  'bookingId': (string);
  'userId': (string);
  'reason'?: (string);
  '_reason'?: "reason";
}
