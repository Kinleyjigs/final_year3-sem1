/**
 * gRPC server implementation for Booking Service
 */
export declare class BookingServer {
    private server;
    constructor();
    private setupHandlers;
    /**
     * Handle GetAvailability RPC
     * Combines booking data and maintenance windows to return availability
     */
    private handleGetAvailability;
    /**
     * T112: Handle CreateBooking RPC
     * Creates a booking with conflict detection and peak hours check
     */
    private handleCreateBooking;
    /**
     * T113: Handle CheckConflict RPC
     * Checks if a booking slot has conflicts
     */
    private handleCheckConflict;
    /**
     * T118: Handle GetUserBookings RPC
     * Retrieves all bookings for a user
     */
    private handleGetUserBookings;
    /**
     * T119: Handle CancelBooking RPC
     * Cancels a booking with ownership and validation checks
     */
    private handleCancelBooking;
    /**
     * Start the gRPC server
     */
    start(port?: number): Promise<void>;
    /**
     * Gracefully shutdown the server
     */
    shutdown(): Promise<void>;
}
export declare const bookingServer: BookingServer;
//# sourceMappingURL=booking.server.d.ts.map