"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groundsClient = void 0;
exports.createGroundsClient = createGroundsClient;
const factory_1 = require("./factory");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Find project root by looking for package.json with workspaces
 */
function findProjectRoot() {
    const logFile = '/tmp/grpc-client-debug.log';
    const log = (msg) => fs_1.default.appendFileSync(logFile, `${new Date().toISOString()} ${msg}\n`);
    log(`[findProjectRoot] Starting`);
    log(`[findProjectRoot] __dirname: ${__dirname}`);
    log(`[findProjectRoot] process.cwd(): ${process.cwd()}`);
    log(`[findProjectRoot] PROJECT_ROOT env: ${process.env.PROJECT_ROOT}`);
    // Priority 1: Use environment variable if set
    if (process.env.PROJECT_ROOT) {
        log(`[findProjectRoot] Using PROJECT_ROOT: ${process.env.PROJECT_ROOT}`);
        return process.env.PROJECT_ROOT;
    }
    // Priority 2: Assume we're in packages/grpc-clients/src when built
    // Go up 3 levels: src -> grpc-clients -> packages -> root
    const fallbackPath = path_1.default.resolve(__dirname, '../../..');
    log(`[findProjectRoot] Fallback path: ${fallbackPath}`);
    // Verify this is actually the monorepo root
    const pkgPath = path_1.default.join(fallbackPath, 'package.json');
    log(`[findProjectRoot] Checking ${pkgPath}`);
    if (fs_1.default.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath, 'utf-8'));
            if (pkg.workspaces) {
                log(`[findProjectRoot] Found workspaces in fallback, returning: ${fallbackPath}`);
                return fallbackPath;
            }
            log(`[findProjectRoot] No workspaces in ${pkgPath}`);
        }
        catch (e) {
            log(`[findProjectRoot] Error reading ${pkgPath}: ${e}`);
        }
    }
    else {
        log(`[findProjectRoot] ${pkgPath} does not exist`);
    }
    // Priority 3: Search up from __dirname
    let currentDir = __dirname;
    log(`[findProjectRoot] Searching up from __dirname`);
    while (currentDir !== '/' && currentDir.length > 1) {
        const pkgPath2 = path_1.default.join(currentDir, 'package.json');
        if (fs_1.default.existsSync(pkgPath2)) {
            try {
                const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath2, 'utf-8'));
                if (pkg.workspaces) {
                    log(`[findProjectRoot] Found workspaces at: ${currentDir}`);
                    return currentDir;
                }
            }
            catch (e) { }
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    // Last resort: return the fallback
    log(`[findProjectRoot] Returning fallback: ${fallbackPath}`);
    return fallbackPath;
}
/**
 * Create a gRPC client for the Grounds Service
 */
function createGroundsClient(serviceUrl) {
    // HARDCODED FIX for development - use absolute path
    const hardcodedRoot = '/Users/yontenkinleytenzin/Desktop/final-3-year-sem1/one-stop-book';
    const projectRoot = process.env.PROJECT_ROOT || hardcodedRoot;
    const protoPath = path_1.default.join(projectRoot, 'services/grounds-service/src/proto/grounds.proto');
    const options = {
        protoPath,
        packageName: 'grounds',
        serviceName: 'GroundsService',
        serviceUrl: serviceUrl || process.env.GROUNDS_SERVICE_URL || 'localhost:50052',
    };
    return factory_1.GrpcClientFactory.createClient(options);
}
// Lazy-loaded singleton instance - only created when first accessed
let _groundsClient = null;
function getGroundsClient() {
    if (!_groundsClient) {
        _groundsClient = createGroundsClient();
    }
    return _groundsClient;
}
// Export a Proxy that defers client creation until first method call
exports.groundsClient = new Proxy({}, {
    get(_target, prop) {
        return getGroundsClient()[prop];
    }
});
//# sourceMappingURL=grounds-client.js.map