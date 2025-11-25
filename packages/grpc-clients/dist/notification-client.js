"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationClient = void 0;
exports.createNotificationClient = createNotificationClient;
exports.getNotificationClient = getNotificationClient;
const factory_1 = require("./factory");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Find project root by looking for package.json with workspaces
 */
function findProjectRoot() {
    if (process.env.PROJECT_ROOT) {
        return process.env.PROJECT_ROOT;
    }
    let currentDir = __dirname;
    while (currentDir !== '/') {
        const pkgPath = path_1.default.join(currentDir, 'package.json');
        if (fs_1.default.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath, 'utf-8'));
            if (pkg.workspaces) {
                return currentDir;
            }
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    return process.cwd();
}
/**
 * Create Notification Service gRPC client
 */
function createNotificationClient() {
    const PROTO_PATH = path_1.default.join(findProjectRoot(), 'services/notification-service/src/proto/notification.proto');
    const serviceUrl = process.env.NOTIFICATION_SERVICE_URL || 'localhost:50055';
    return factory_1.GrpcClientFactory.createClient({
        protoPath: PROTO_PATH,
        packageName: 'notification',
        serviceName: 'NotificationService',
        serviceUrl,
    });
}
// Lazy-loaded singleton instance
let _notificationClient = null;
function getNotificationClient() {
    if (!_notificationClient) {
        _notificationClient = createNotificationClient();
    }
    return _notificationClient;
}
// Export as notificationClient for backward compatibility
exports.notificationClient = new Proxy({}, {
    get(_target, prop) {
        return getNotificationClient()[prop];
    },
});
//# sourceMappingURL=notification-client.js.map