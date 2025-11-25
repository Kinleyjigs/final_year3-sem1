/**
 * gRPC server implementation for Maintenance Service
 */
export declare class MaintenanceServer {
    private server;
    constructor();
    private setupHandlers;
    /**
     * Handle GetGroundMaintenance RPC
     */
    private handleGetGroundMaintenance;
    /**
     * Handle CheckConflict RPC
     */
    private handleCheckConflict;
    /**
     * Start the gRPC server
     */
    start(port?: number): Promise<void>;
    /**
     * Gracefully shutdown the server
     */
    shutdown(): Promise<void>;
}
export declare const maintenanceServer: MaintenanceServer;
//# sourceMappingURL=maintenance.server.d.ts.map