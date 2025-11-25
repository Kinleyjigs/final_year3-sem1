/**
 * Booking Service Entry Point
 * Starts the gRPC server for booking management
 */
import { bookingServer } from './grpc/booking.server';

async function main() {
  try {
    await bookingServer.start();
    console.log('✅ Booking Service is running on port 50053');
  } catch (error) {
    console.error('❌ Failed to start Booking Service:', error);
    process.exit(1);
  }
}

main();
