/**
 * Auth Service Entry Point
 * Starts the gRPC server for authentication
 */
import { authServer } from './grpc/auth.server';

async function main() {
  try {
    await authServer.start();
    console.log('✅ Auth Service is running on port 50051');
  } catch (error) {
    console.error('❌ Failed to start Auth Service:', error);
    process.exit(1);
  }
}

main();
