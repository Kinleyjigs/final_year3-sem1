"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = exports.emailTransporter = void 0;
exports.createEmailTransporter = createEmailTransporter;
const nodemailer_1 = __importDefault(require("nodemailer"));
const common_1 = require("@one-stop-book/common");
/**
 * Create Nodemailer transporter with SMTP configuration
 */
function createEmailTransporter() {
    const config = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
    };
    // Validate configuration
    if (!config.auth.user || !config.auth.pass) {
        common_1.logger.warn('SMTP credentials not configured. Email notifications will be disabled.');
        return null;
    }
    const transporter = nodemailer_1.default.createTransport(config);
    // Verify connection
    transporter.verify((error) => {
        if (error) {
            common_1.logger.error('SMTP connection failed', { error });
        }
        else {
            common_1.logger.info('SMTP server ready to send emails');
        }
    });
    return transporter;
}
// Export singleton transporter
exports.emailTransporter = createEmailTransporter();
/**
 * Email sender configuration
 */
exports.emailConfig = {
    from: {
        name: process.env.EMAIL_FROM_NAME || 'Campus Ground Booking',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'noreply@groundbooking.com',
    },
};
//# sourceMappingURL=email.js.map