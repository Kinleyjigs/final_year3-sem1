import type { BookingDetails as _notification_BookingDetails, BookingDetails__Output as _notification_BookingDetails__Output } from '../notification/BookingDetails';
export interface SendBookingApprovalRequest {
    'bookingId'?: (string);
    'userId'?: (string);
    'userEmail'?: (string);
    'userName'?: (string);
    'bookingDetails'?: (_notification_BookingDetails | null);
}
export interface SendBookingApprovalRequest__Output {
    'bookingId': (string);
    'userId': (string);
    'userEmail': (string);
    'userName': (string);
    'bookingDetails': (_notification_BookingDetails__Output | null);
}
//# sourceMappingURL=SendBookingApprovalRequest.d.ts.map