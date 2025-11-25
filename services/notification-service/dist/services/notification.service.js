"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const email_1 = require("../config/email");
const common_1 = require("@one-stop-book/common");
class NotificationService {
    constructor() {
        this.templates = new Map();
        this.loadTemplates();
    }
    /**
     * Load email templates from templates directory
     */
    loadTemplates() {
        try {
            const templatesDir = path_1.default.join(__dirname, '../templates');
            // Load booking confirmation template
            const confirmationPath = path_1.default.join(templatesDir, 'booking-confirmation.html');
            if (fs_1.default.existsSync(confirmationPath)) {
                const templateContent = fs_1.default.readFileSync(confirmationPath, 'utf-8');
                this.templates.set('booking-confirmation', handlebars_1.default.compile(templateContent));
                common_1.logger.info('Loaded booking-confirmation template');
            }
            else {
                common_1.logger.warn('booking-confirmation.html template not found');
            }
        }
        catch (error) {
            common_1.logger.error('Failed to load email templates', { error });
        }
    }
    /**
     * Calculate booking duration in hours
     */
    calculateDuration(startTime, endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const durationMinutes = endMinutes - startMinutes;
        const hours = Math.floor(durationMinutes / 60);
        return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    /**
     * Format date to user-friendly format
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    /**
     * T124: Send booking confirmation email
     */
    async sendBookingConfirmation(data) {
        try {
            // Check if email service is configured
            if (!email_1.emailTransporter) {
                common_1.logger.warn('Email transporter not configured. Skipping email send.', {
                    userEmail: data.userEmail,
                });
                return false;
            }
            // Get template
            const template = this.templates.get('booking-confirmation');
            if (!template) {
                common_1.logger.error('booking-confirmation template not loaded');
                return false;
            }
            // Prepare template data
            const templateData = {
                userName: data.userName,
                groundName: data.groundName,
                college: data.college,
                location: data.location,
                bookingDate: this.formatDate(data.bookingDate),
                startTime: data.startTime,
                endTime: data.endTime,
                duration: this.calculateDuration(data.startTime, data.endTime),
                confirmationCode: data.confirmationCode,
                status: data.status,
                statusClass: data.status.toLowerCase(),
                isPending: data.status === 'PENDING',
                isApproved: data.status === 'APPROVED',
                dashboardUrl: process.env.FRONTEND_URL
                    ? `${process.env.FRONTEND_URL}/dashboard`
                    : 'http://localhost:3000/dashboard',
            };
            // Render HTML
            const html = template(templateData);
            // Prepare email
            const mailOptions = {
                from: `${email_1.emailConfig.from.name} <${email_1.emailConfig.from.address}>`,
                to: data.userEmail,
                subject: data.status === 'PENDING'
                    ? '⏳ Booking Pending Approval - Confirmation Required'
                    : '✅ Booking Confirmed - Your Ground is Reserved',
                html,
            };
            // Send email
            const info = await email_1.emailTransporter.sendMail(mailOptions);
            common_1.logger.info('Booking confirmation email sent', {
                messageId: info.messageId,
                userEmail: data.userEmail,
                confirmationCode: data.confirmationCode,
                status: data.status,
            });
            return true;
        }
        catch (error) {
            common_1.logger.error('Failed to send booking confirmation email', {
                error,
                userEmail: data.userEmail,
            });
            return false;
        }
    }
    /**
     * Send booking cancellation email
     */
    async sendBookingCancellation(data) {
        try {
            if (!email_1.emailTransporter) {
                common_1.logger.warn('Email transporter not configured. Skipping cancellation email.');
                return false;
            }
            const mailOptions = {
                from: `${email_1.emailConfig.from.name} <${email_1.emailConfig.from.address}>`,
                to: data.userEmail,
                subject: '❌ Booking Canceled',
                html: `
          <h2>Booking Canceled</h2>
          <p>Dear ${data.userName},</p>
          <p>Your booking has been canceled:</p>
          <ul>
            <li><strong>Ground:</strong> ${data.groundName}</li>
            <li><strong>Date:</strong> ${this.formatDate(data.bookingDate)}</li>
            <li><strong>Time:</strong> ${data.startTime} - ${data.endTime}</li>
            <li><strong>Confirmation Code:</strong> ${data.confirmationCode}</li>
          </ul>
          <p>You can make a new booking anytime from your dashboard.</p>
        `,
            };
            const info = await email_1.emailTransporter.sendMail(mailOptions);
            common_1.logger.info('Cancellation email sent', { messageId: info.messageId });
            return true;
        }
        catch (error) {
            common_1.logger.error('Failed to send cancellation email', { error });
            return false;
        }
    }
}
exports.NotificationService = NotificationService;
// Export singleton instance
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map