/**
 * T127: Notification Service gRPC Client
 * Provides type-safe access to Notification Service RPCs
 */
export interface SendBookingConfirmationRequest {
    user_name: string;
    user_email: string;
    ground_name: string;
    college: string;
    location: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    confirmation_code: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
}
export interface SendBookingCancellationRequest {
    user_name: string;
    user_email: string;
    ground_name: string;
    college: string;
    location: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    confirmation_code: string;
}
export interface NotificationResponse {
    success: boolean;
}
/**
 * Create Notification Service gRPC client
 */
export declare function createNotificationClient(): unknown;
export declare function getNotificationClient(): any;
export declare const notificationClient: any;
//# sourceMappingURL=notification-client.d.ts.map