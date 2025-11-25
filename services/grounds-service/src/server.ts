import { groundsServer } from './grpc/grounds.server';
import { logger, config } from '@one-stop-book/common';

const port = config.ports.groundsService || 50052;

// Graceful shutdown handler
const shutdown = async () => {
  logger.info('Shutting down Grounds Service...');
  await groundsServer.shutdown();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
groundsServer.start(port).catch((error) => {
  logger.error('Failed to start Grounds Service', { error });
  process.exit(1);
});
