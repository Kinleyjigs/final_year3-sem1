import type { BookingStatus as _booking_BookingStatus, BookingStatus__Output as _booking_BookingStatus__Output } from '../booking/BookingStatus';
export interface GetCollegeBookingsRequest {
    'college'?: (string);
    'status'?: (_booking_BookingStatus);
    'groundId'?: (string);
    '_status'?: "status";
    '_groundId'?: "groundId";
}
export interface GetCollegeBookingsRequest__Output {
    'college': (string);
    'status'?: (_booking_BookingStatus__Output);
    'groundId'?: (string);
    '_status'?: "status";
    '_groundId'?: "groundId";
}
//# sourceMappingURL=GetCollegeBookingsRequest.d.ts.map