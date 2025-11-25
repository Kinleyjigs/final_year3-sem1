// Database seeding script (will be implemented in Phase 2)
// This script will populate the database with sample data:
// - 2 admin users (one per college)
// - 5 regular users
// - 10 grounds across 3-5 colleges
// - 50 sample bookings

import { logger } from '@one-stop-book/common';

async function seed(): Promise<void> {
  logger.info('Database seeding will be implemented in Phase 2 - Foundation');
  logger.info('This will include:');
  logger.info('  - 2 admin users');
  logger.info('  - 5 regular users');
  logger.info('  - 10 grounds');
  logger.info('  - 50 bookings');
}

seed()
  .then(() => {
    logger.info('Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Seed script failed:', error);
    process.exit(1);
  });
