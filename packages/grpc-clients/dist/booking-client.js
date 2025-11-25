"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingClient = void 0;
exports.createBookingClient = createBookingClient;
exports.getBookingClient = getBookingClient;
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
/**
 * Create Booking Service gRPC client
 */
function createBookingClient() {
    const hardcodedRoot = '/Users/yontenkinleytenzin/Desktop/final-3-year-sem1/one-stop-book';
    const projectRoot = process.env.PROJECT_ROOT || hardcodedRoot;
    const PROTO_PATH = path_1.default.join(projectRoot, 'services/booking-service/src/proto/booking.proto');
    const serviceUrl = process.env.BOOKING_SERVICE_URL || 'localhost:50053';
    return factory_1.GrpcClientFactory.createClient({
        protoPath: PROTO_PATH,
        packageName: 'booking',
        serviceName: 'BookingService',
        serviceUrl,
    });
}
// Lazy-loaded singleton instance
let _bookingClient = null;
function getBookingClient() {
    if (!_bookingClient) {
        _bookingClient = createBookingClient();
    }
    return _bookingClient;
}
// Export as bookingClient for backward compatibility
exports.bookingClient = new Proxy({}, {
    get(_target, prop) {
        return getBookingClient()[prop];
    },
});
//# sourceMappingURL=booking-client.js.map