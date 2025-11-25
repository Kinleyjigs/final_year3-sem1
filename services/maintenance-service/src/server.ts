/**
 * Maintenance Service Entry Point
 * Starts the gRPC server for maintenance scheduling
 */
import { maintenanceServer } from './grpc/maintenance.server';

async function main() {
  try {
    await maintenanceServer.start();
    console.log('✅ Maintenance Service is running on port 50054');
  } catch (error) {
    console.error('❌ Failed to start Maintenance Service:', error);
    process.exit(1);
  }
}

main();
