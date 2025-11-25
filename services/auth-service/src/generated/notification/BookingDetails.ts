// Original file: src/proto/notification.proto


export interface BookingDetails {
  'groundName'?: (string);
  'groundLocation'?: (string);
  'bookingDate'?: (string);
  'startTime'?: (string);
  'endTime'?: (string);
  'confirmationCode'?: (string);
  'status'?: (string);
}

export interface BookingDetails__Output {
  'groundName': (string);
  'groundLocation': (string);
  'bookingDate': (string);
  'startTime': (string);
  'endTime': (string);
  'confirmationCode': (string);
  'status': (string);
}
