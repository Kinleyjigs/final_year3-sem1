import type { BookingDetails as _notification_BookingDetails, BookingDetails__Output as _notification_BookingDetails__Output } from '../notification/BookingDetails';
export interface SendBookingRejectionRequest {
    'bookingId'?: (string);
    'userId'?: (string);
    'userEmail'?: (string);
    'userName'?: (string);
    'bookingDetails'?: (_notification_BookingDetails | null);
    'rejectionReason'?: (string);
}
export interface SendBookingRejectionRequest__Output {
    'bookingId': (string);
    'userId': (string);
    'userEmail': (string);
    'userName': (string);
    'bookingDetails': (_notification_BookingDetails__Output | null);
    'rejectionReason': (string);
}
//# sourceMappingURL=SendBookingRejectionRequest.d.ts.map