"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authClient = exports.Role = void 0;
exports.createAuthClient = createAuthClient;
exports.getAuthClient = getAuthClient;
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
    const fallbackPath = path_1.default.resolve(__dirname, '../../..');
    const pkgPath = path_1.default.join(fallbackPath, 'package.json');
    if (fs_1.default.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath, 'utf-8'));
            if (pkg.workspaces) {
                return fallbackPath;
            }
        }
        catch (e) { }
    }
    let currentDir = __dirname;
    while (currentDir !== '/' && currentDir.length > 1) {
        const pkgPath2 = path_1.default.join(currentDir, 'package.json');
        if (fs_1.default.existsSync(pkgPath2)) {
            try {
                const pkg = JSON.parse(fs_1.default.readFileSync(pkgPath2, 'utf-8'));
                if (pkg.workspaces) {
                    return currentDir;
                }
            }
            catch (e) { }
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    return fallbackPath;
}
var Role;
(function (Role) {
    Role[Role["VISITOR"] = 0] = "VISITOR";
    Role[Role["USER"] = 1] = "USER";
    Role[Role["ADMIN"] = 2] = "ADMIN";
})(Role || (exports.Role = Role = {}));
/**
 * Create Auth gRPC client
 */
function createAuthClient(serviceUrl) {
    const hardcodedRoot = '/Users/yontenkinleytenzin/Desktop/final-3-year-sem1/one-stop-book';
    const projectRoot = process.env.PROJECT_ROOT || hardcodedRoot;
    const PROTO_PATH = path_1.default.join(projectRoot, 'services/auth-service/src/proto/auth.proto');
    const url = serviceUrl || process.env.AUTH_SERVICE_URL || 'localhost:50051';
    return factory_1.GrpcClientFactory.createClient({
        protoPath: PROTO_PATH,
        packageName: 'auth',
        serviceName: 'AuthService',
        serviceUrl: url,
    });
}
// Lazy-loaded singleton instance
let _authClient = null;
function getAuthClient() {
    if (!_authClient) {
        _authClient = createAuthClient();
    }
    return _authClient;
}
// Export as authClient for backward compatibility
exports.authClient = new Proxy({}, {
    get(_target, prop) {
        return getAuthClient()[prop];
    },
});
//# sourceMappingURL=auth-client.js.map