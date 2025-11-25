"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundsController = void 0;
const grpc_clients_1 = require("@one-stop-book/grpc-clients");
const common_1 = require("@one-stop-book/common");
const common_2 = require("@one-stop-book/common");
/**
 * Controller for grounds-related endpoints
 */
class GroundsController {
    /**
     * GET /api/grounds - Search for grounds with optional filters
     */
    static async searchGrounds(req, res, next) {
        try {
            const { college, is_active, page, limit } = req.query;
            common_1.logger.info('Searching grounds', {
                college: college || 'all',
                is_active,
                page,
                limit,
            });
            // Call gRPC Grounds Service
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.groundsClient.SearchGrounds({
                    college: college,
                    is_active: is_active !== undefined ? is_active === 'true' : true,
                    page: page ? parseInt(page, 10) : 1,
                    limit: limit ? parseInt(limit, 10) : 10,
                }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC SearchGrounds error', { error });
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            res.json(response);
        }
        catch (error) {
            common_1.logger.error('Failed to search grounds', { error });
            next(new common_2.InternalError('Failed to retrieve grounds. Please try again.'));
        }
    }
    /**
     * GET /api/grounds/:id - Get a single ground by ID
     */
    static async getGround(req, res, next) {
        try {
            const { id } = req.params;
            common_1.logger.info('Getting ground details', { groundId: id });
            // Call gRPC Grounds Service
            const response = await new Promise((resolve, reject) => {
                grpc_clients_1.groundsClient.GetGround({ id }, (error, response) => {
                    if (error) {
                        common_1.logger.error('gRPC GetGround error', { error });
                        reject(error);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
            res.json(response);
        }
        catch (error) {
            common_1.logger.error('Failed to get ground', { error });
            next(new common_2.InternalError('Failed to retrieve ground details. Please try again.'));
        }
    }
}
exports.GroundsController = GroundsController;
//# sourceMappingURL=grounds.controller.js.map