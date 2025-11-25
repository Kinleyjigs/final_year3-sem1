"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const common_1 = require("@one-stop-book/common");
const error_handler_1 = require("./middleware/error-handler");
const routes_1 = require("./routes");
const swagger_1 = require("./swagger");
class ApiGatewayServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = common_1.config.ports.apiGateway;
        this.initialize();
    }
    initialize() {
        // Validate configuration
        (0, common_1.validateConfig)();
        // Security middleware
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || '*',
            credentials: true,
        }));
        // Body parsing middleware
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Request logging
        this.app.use((req, res, next) => {
            common_1.logger.info(`${req.method} ${req.path}`, {
                ip: req.ip,
                userAgent: req.get('user-agent'),
            });
            next();
        });
        // Setup Swagger documentation
        (0, swagger_1.setupSwagger)(this.app);
        // Setup API routes
        (0, routes_1.setupRoutes)(this.app);
        // Error handling middleware (must be last)
        this.app.use(error_handler_1.errorHandler);
    }
    start() {
        this.app.listen(this.port, () => {
            common_1.logger.info(`API Gateway started on port ${this.port}`, {
                environment: common_1.config.nodeEnv,
                port: this.port,
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ApiGatewayServer = ApiGatewayServer;
// Start server if running directly
if (require.main === module) {
    const server = new ApiGatewayServer();
    server.start();
}
//# sourceMappingURL=server.js.map