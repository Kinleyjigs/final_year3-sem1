"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grounds_server_1 = require("./grpc/grounds.server");
const common_1 = require("@one-stop-book/common");
const port = common_1.config.ports.groundsService || 50052;
// Graceful shutdown handler
const shutdown = async () => {
    common_1.logger.info('Shutting down Grounds Service...');
    await grounds_server_1.groundsServer.shutdown();
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
// Start the server
grounds_server_1.groundsServer.start(port).catch((error) => {
    common_1.logger.error('Failed to start Grounds Service', { error });
    process.exit(1);
});
//# sourceMappingURL=server.js.map