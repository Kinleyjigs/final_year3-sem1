/**
 * T126: gRPC server implementation for Notification Service
 */
export declare class NotificationServer {
    private server;
    constructor();
    private setupHandlers;
    /**
     * T126: Handle SendBookingConfirmation RPC
     */
    private handleSendBookingConfirmation;
    /**
     * Handle SendBookingCancellation RPC
     */
    private handleSendBookingCancellation;
    /**
     * Start the gRPC server
     */
    start(port?: number): Promise<void>;
    /**
     * Gracefully shutdown the server
     */
    shutdown(): Promise<void>;
}
export declare const notificationServer: NotificationServer;
//# sourceMappingURL=notification.server.d.ts.map