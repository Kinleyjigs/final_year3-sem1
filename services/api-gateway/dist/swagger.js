"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const common_1 = require("@one-stop-book/common");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
function setupSwagger(app) {
    try {
        // Load OpenAPI spec from contracts directory
        const specPath = path_1.default.join(__dirname, '../../../..', 'specs/001-ground-booking/contracts/rest-api-gateway.yaml');
        if (fs_1.default.existsSync(specPath)) {
            const swaggerDocument = js_yaml_1.default.load(fs_1.default.readFileSync(specPath, 'utf8'));
            app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, {
                explorer: true,
                customCss: '.swagger-ui .topbar { display: none }',
                customSiteTitle: 'One Stop Book API Documentation',
            }));
            common_1.logger.info('Swagger documentation available at /api-docs');
        }
        else {
            common_1.logger.warn('OpenAPI spec not found, Swagger documentation disabled');
        }
    }
    catch (error) {
        common_1.logger.error('Failed to setup Swagger documentation', { error });
    }
}
//# sourceMappingURL=swagger.js.map