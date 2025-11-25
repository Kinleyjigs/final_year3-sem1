/**
 * T124: Notification Service
 * Handles sending booking confirmation emails
 */
export interface BookingConfirmationData {
    userName: string;
    userEmail: string;
    groundName: string;
    college: string;
    location: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    confirmationCode: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
}
export declare class NotificationService {
    private templates;
    constructor();
    /**
     * Load email templates from templates directory
     */
    private loadTemplates;
    /**
     * Calculate booking duration in hours
     */
    private calculateDuration;
    /**
     * Format date to user-friendly format
     */
    private formatDate;
    /**
     * T124: Send booking confirmation email
     */
    sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean>;
    /**
     * Send booking cancellation email
     */
    sendBookingCancellation(data: BookingConfirmationData): Promise<boolean>;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=notification.service.d.ts.map