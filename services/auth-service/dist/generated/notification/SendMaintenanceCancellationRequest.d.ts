import type { BookingDetails as _notification_BookingDetails, BookingDetails__Output as _notification_BookingDetails__Output } from '../notification/BookingDetails';
export interface SendMaintenanceCancellationRequest {
    'bookingId'?: (string);
    'userId'?: (string);
    'userEmail'?: (string);
    'userName'?: (string);
    'bookingDetails'?: (_notification_BookingDetails | null);
    'maintenanceDescription'?: (string);
}
export interface SendMaintenanceCancellationRequest__Output {
    'bookingId': (string);
    'userId': (string);
    'userEmail': (string);
    'userName': (string);
    'bookingDetails': (_notification_BookingDetails__Output | null);
    'maintenanceDescription': (string);
}
//# sourceMappingURL=SendMaintenanceCancellationRequest.d.ts.map