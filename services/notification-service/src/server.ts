/**
 * Notification Service Entry Point
 * Starts the gRPC server for email notifications
 */
import { notificationServer } from './grpc/notification.server';

async function main() {
  try {
    await notificationServer.start();
    console.log('✅ Notification Service is running on port 50055');
  } catch (error) {
    console.error('❌ Failed to start Notification Service:', error);
    process.exit(1);
  }
}

main();
