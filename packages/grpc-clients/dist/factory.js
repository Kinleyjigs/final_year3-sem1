"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcClientFactory = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const common_1 = require("@one-stop-book/common");
class GrpcClientFactory {
    /**
     * Create a gRPC client from proto file
     * @param options - Client configuration options
     * @returns gRPC client instance
     */
    static createClient(options) {
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
            const packageObj = protoDescriptor[packageName];
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
            common_1.logger.info(`gRPC client created for ${serviceName}`, { serviceUrl });
            return client;
        }
        catch (error) {
            common_1.logger.error(`Failed to create gRPC client for ${serviceName}`, { error });
            throw error;
        }
    }
    /**
     * Get gRPC credentials based on environment
     * @returns Channel credentials
     */
    static getCredentials() {
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
    static createClientWithRetry(options, retryOptions = {}) {
        const client = GrpcClientFactory.createClient(options);
        // Add retry and timeout logic (can be enhanced with interceptors)
        const { maxRetries = 3, retryDelay = 1000, timeout = 5000 } = retryOptions;
        // TODO: Implement retry interceptor when needed
        // For now, return basic client
        return client;
    }
}
exports.GrpcClientFactory = GrpcClientFactory;
//# sourceMappingURL=factory.js.map