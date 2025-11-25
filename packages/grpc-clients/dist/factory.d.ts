import * as grpc from '@grpc/grpc-js';
export interface GrpcClientOptions {
    protoPath: string;
    packageName: string;
    serviceName: string;
    serviceUrl: string;
    credentials?: grpc.ChannelCredentials;
}
export declare class GrpcClientFactory {
    /**
     * Create a gRPC client from proto file
     * @param options - Client configuration options
     * @returns gRPC client instance
     */
    static createClient<T>(options: GrpcClientOptions): T;
    /**
     * Get gRPC credentials based on environment
     * @returns Channel credentials
     */
    static getCredentials(): grpc.ChannelCredentials;
    /**
     * Create client with automatic retry and timeout configuration
     * @param options - Client configuration options
     * @param retryOptions - Retry configuration
     * @returns gRPC client instance with retry logic
     */
    static createClientWithRetry<T>(options: GrpcClientOptions, retryOptions?: {
        maxRetries?: number;
        retryDelay?: number;
        timeout?: number;
    }): T;
}
//# sourceMappingURL=factory.d.ts.map