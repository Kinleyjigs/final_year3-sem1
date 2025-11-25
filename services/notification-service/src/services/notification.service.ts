import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { emailTransporter, emailConfig } from '../config/email';
import { logger } from '@one-stop-book/common';

/**
 * T124: Notification Service
 * Handles sending booking confirmation emails
 */

export interface BookingConfirmationData {
  userName: string;
  userEmail: string;
  groundName: string;
  college: string;
  location: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  confirmationCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
}

export class NotificationService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  /**
   * Load email templates from templates directory
   */
  private loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates');
      
      // Load booking confirmation template
      const confirmationPath = path.join(templatesDir, 'booking-confirmation.html');
      if (fs.existsSync(confirmationPath)) {
        const templateContent = fs.readFileSync(confirmationPath, 'utf-8');
        this.templates.set('booking-confirmation', Handlebars.compile(templateContent));
        logger.info('Loaded booking-confirmation template');
      } else {
        logger.warn('booking-confirmation.html template not found');
      }
    } catch (error) {
      logger.error('Failed to load email templates', { error });
    }
  }

  /**
   * Calculate booking duration in hours
   */
  private calculateDuration(startTime: string, endTime: string): string {
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
  private formatDate(dateString: string): string {
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
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    try {
      // Check if email service is configured
      if (!emailTransporter) {
        logger.warn('Email transporter not configured. Skipping email send.', {
          userEmail: data.userEmail,
        });
        return false;
      }

      // Get template
      const template = this.templates.get('booking-confirmation');
      if (!template) {
        logger.error('booking-confirmation template not loaded');
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
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: data.userEmail,
        subject: data.status === 'PENDING' 
          ? '⏳ Booking Pending Approval - Confirmation Required'
          : '✅ Booking Confirmed - Your Ground is Reserved',
        html,
      };

      // Send email
      const info = await emailTransporter.sendMail(mailOptions);

      logger.info('Booking confirmation email sent', {
        messageId: info.messageId,
        userEmail: data.userEmail,
        confirmationCode: data.confirmationCode,
        status: data.status,
      });

      return true;
    } catch (error) {
      logger.error('Failed to send booking confirmation email', {
        error,
        userEmail: data.userEmail,
      });
      return false;
    }
  }

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellation(data: BookingConfirmationData): Promise<boolean> {
    try {
      if (!emailTransporter) {
        logger.warn('Email transporter not configured. Skipping cancellation email.');
        return false;
      }

      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
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

      const info = await emailTransporter.sendMail(mailOptions);
      logger.info('Cancellation email sent', { messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error('Failed to send cancellation email', { error });
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
