/**
 * gRPC server implementation for Grounds Service
 */
export declare class GroundsServer {
    private server;
    constructor();
    private setupHandlers;
    /**
     * Handle SearchGrounds RPC
     */
    private handleSearchGrounds;
    /**
     * Handle GetGround RPC
     */
    private handleGetGround;
    /**
     * Handle IsPeakTime RPC
     */
    private handleIsPeakTime;
    /**
     * Start the gRPC server
     */
    start(port?: number): Promise<void>;
    /**
     * Gracefully shutdown the server
     */
    shutdown(): Promise<void>;
}
export declare const groundsServer: GroundsServer;
//# sourceMappingURL=grounds.server.d.ts.map