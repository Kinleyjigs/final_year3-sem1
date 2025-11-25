import { PrismaClient } from '@prisma/client';
type GroundsClient = any;
type MaintenanceClient = any;
type NotificationClient = any;
type Booking = {
    id: string;
    userId: string;
    groundId: string;
    bookingDate: Date;
    startTime: Date;
    endTime: Date;
    status: string;
    confirmationCode: string;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
};
export interface CreateBookingDTO {
    userId: string;
    groundId: string;
    bookingDate: Date;
    startTime: string;
    endTime: string;
}
export interface CancelBookingDTO {
    bookingId: string;
    userId: string;
    reason?: string;
}
export declare class BookingService {
    private readonly prisma;
    private readonly groundsClient?;
    private readonly maintenanceClient?;
    private readonly notificationClient?;
    constructor(prisma: PrismaClient, groundsClient?: GroundsClient | undefined, maintenanceClient?: MaintenanceClient | undefined, notificationClient?: NotificationClient | undefined);
    /**
     * T111: Generate a unique confirmation code using crypto.randomBytes
     * Format: 16 uppercase alphanumeric characters
     */
    generateConfirmationCode(): string;
    /**
     * T109: Check for booking conflicts with SELECT FOR UPDATE locking
     * Returns true if conflict exists, false if slot is available
     */
    checkConflict(data: CreateBookingDTO): Promise<boolean>;
    /**
     * T110: Create a booking with conflict detection in transaction
     * Includes peak hours check and confirmation code generation
     */
    createBooking(data: CreateBookingDTO): Promise<Booking>;
    /**
     * T116: Get all bookings for a specific user
     */
    getUserBookings(userId: string): Promise<Booking[]>;
    /**
     * T117: Cancel a booking with validations
     * Validates: not past booking, not already canceled/rejected
     */
    cancelBooking(data: CancelBookingDTO): Promise<Booking>;
    /**
     * Get a single booking by ID
     */
    getBooking(bookingId: string): Promise<Booking | null>;
    /**
     * Get bookings for a specific ground (optionally filtered by date)
     */
    getGroundBookings(groundId: string, date?: Date): Promise<Booking[]>;
}
export declare const bookingService: BookingService;
export {};
//# sourceMappingURL=booking.service.d.ts.map