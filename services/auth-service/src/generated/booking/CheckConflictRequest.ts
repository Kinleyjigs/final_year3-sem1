// Original file: src/proto/booking.proto


export interface CheckConflictRequest {
  'groundId'?: (string);
  'bookingDate'?: (string);
  'startTime'?: (string);
  'endTime'?: (string);
  'excludeBookingId'?: (string);
  '_excludeBookingId'?: "excludeBookingId";
}

export interface CheckConflictRequest__Output {
  'groundId': (string);
  'bookingDate': (string);
  'startTime': (string);
  'endTime': (string);
  'excludeBookingId'?: (string);
  '_excludeBookingId'?: "excludeBookingId";
}
