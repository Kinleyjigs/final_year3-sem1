import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { logger } from '@one-stop-book/common';
import path from 'path';

export interface GrpcClientOptions {
  protoPath: string;
  packageName: string;
  serviceName: string;
  serviceUrl: string;
  credentials?: grpc.ChannelCredentials;
}

export class GrpcClientFactory {
  /**
   * Create a gRPC client from proto file
   * @param options - Client configuration options
   * @returns gRPC client instance
   */
  static createClient<T>(options: GrpcClientOptions): T {
    const { protoPath, packageName, serviceName, serviceUrl, credentials } = options;
    
    try {
      // Load proto file
      const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      
      // Load gRPC package
      const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
      
      // Get service from package
      const packageObj = protoDescriptor[packageName] as any;
      if (!packageObj) {
        throw new Error(`Package '${packageName}' not found in proto file`);
      }
      
      const ServiceConstructor = packageObj[serviceName];
      if (!ServiceConstructor) {
        throw new Error(`Service '${serviceName}' not found in package '${packageName}'`);
      }
      
      // Create client with credentials
      const clientCredentials = credentials || GrpcClientFactory.getCredentials();
      const client = new ServiceConstructor(serviceUrl, clientCredentials);
      
      logger.info(`gRPC client created for ${serviceName}`, { serviceUrl });
      
      return client as T;
    } catch (error) {
      logger.error(`Failed to create gRPC client for ${serviceName}`, { error });
      throw error;
    }
  }
  
  /**
   * Get gRPC credentials based on environment
   * @returns Channel credentials
   */
  static getCredentials(): grpc.ChannelCredentials {
    // Use insecure credentials for local development
    // In production, use TLS credentials
    if (process.env.NODE_ENV === 'production' && process.env.GRPC_USE_TLS === 'true') {
      // Load TLS certificates for production
      const rootCert = process.env.GRPC_ROOT_CERT_PATH 
        ? require('fs').readFileSync(process.env.GRPC_ROOT_CERT_PATH)
        : null;
      
      return rootCert 
        ? grpc.credentials.createSsl(rootCert)
        : grpc.credentials.createInsecure();
    }
    
    return grpc.credentials.createInsecure();
  }
  
  /**
   * Create client with automatic retry and timeout configuration
   * @param options - Client configuration options
   * @param retryOptions - Retry configuration
   * @returns gRPC client instance with retry logic
   */
  static createClientWithRetry<T>(
    options: GrpcClientOptions,
    retryOptions: {
      maxRetries?: number;
      retryDelay?: number;
      timeout?: number;
    } = {}
  ): T {
    const client = GrpcClientFactory.createClient<T>(options);
    
    // Add retry and timeout logic (can be enhanced with interceptors)
    const { maxRetries = 3, retryDelay = 1000, timeout = 5000 } = retryOptions;
    
    // TODO: Implement retry interceptor when needed
    // For now, return basic client
    
    return client;
  }
}
