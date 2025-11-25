"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceClient = void 0;
exports.createMaintenanceClient = createMaintenanceClient;
exports.getMaintenanceClient = getMaintenanceClient;
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
 * Create Maintenance Service gRPC client
 */
function createMaintenanceClient() {
    const PROTO_PATH = path_1.default.join(findProjectRoot(), 'services/maintenance-service/src/proto/maintenance.proto');
    const serviceUrl = process.env.MAINTENANCE_SERVICE_URL || 'localhost:50054';
    return factory_1.GrpcClientFactory.createClient({
        protoPath: PROTO_PATH,
        packageName: 'maintenance',
        serviceName: 'MaintenanceService',
        serviceUrl,
    });
}
// Lazy-loaded singleton instance
let _maintenanceClient = null;
function getMaintenanceClient() {
    if (!_maintenanceClient) {
        _maintenanceClient = createMaintenanceClient();
    }
    return _maintenanceClient;
}
// Export as maintenanceClient for backward compatibility
exports.maintenanceClient = new Proxy({}, {
    get(_target, prop) {
        return getMaintenanceClient()[prop];
    },
});
//# sourceMappingURL=maintenance-client.js.map