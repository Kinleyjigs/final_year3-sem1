/**
 * Booking Service gRPC Client
 * Provides type-safe access to Booking Service RPCs
 */
export interface TimeSlot {
    start_time: string;
    end_time: string;
    status: 0 | 1 | 2;
    booking_id?: string;
}
export interface DayAvailability {
    date: string;
    slots: TimeSlot[];
}
export interface MaintenanceWindow {
    id: string;
    start_date_time: string;
    end_date_time: string;
}
export interface GetAvailabilityRequest {
    ground_id: string;
    start_date: string;
    end_date: string;
    maintenance_windows?: MaintenanceWindow[];
}
export interface GetAvailabilityResponse {
    availability: DayAvailability[];
}
export interface CreateBookingRequest {
    user_id: string;
    ground_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
}
export interface BookingResponse {
    id: string;
    user_id: string;
    ground_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
    confirmation_code: string;
    created_at: string;
    updated_at: string;
}
export interface GetUserBookingsRequest {
    user_id: string;
}
export interface GetUserBookingsResponse {
    bookings: BookingResponse[];
}
export interface CancelBookingRequest {
    booking_id: string;
    user_id: string;
}
export interface BookingConflictRequest {
    ground_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
}
export interface BookingConflictResponse {
    has_conflict: boolean;
}
/**
 * Create Booking Service gRPC client
 */
export declare function createBookingClient(): unknown;
export declare function getBookingClient(): any;
export declare const bookingClient: any;
//# sourceMappingURL=booking-client.d.ts.map