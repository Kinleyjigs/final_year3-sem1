// Original file: src/proto/booking.proto


export interface RejectBookingRequest {
  'bookingId'?: (string);
  'adminUserId'?: (string);
  'reason'?: (string);
  '_reason'?: "reason";
}

export interface RejectBookingRequest__Output {
  'bookingId': (string);
  'adminUserId': (string);
  'reason'?: (string);
  '_reason'?: "reason";
}
