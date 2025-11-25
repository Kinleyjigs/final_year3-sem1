import nodemailer from 'nodemailer';
import { logger } from '@one-stop-book/common';

/**
 * T128: Configure Nodemailer with SMTP
 * Email configuration for sending booking notifications
 */

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Create Nodemailer transporter with SMTP configuration
 */
export function createEmailTransporter() {
  const config: EmailConfig = {
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
    logger.warn('SMTP credentials not configured. Email notifications will be disabled.');
    return null;
  }

  const transporter = nodemailer.createTransport(config);

  // Verify connection
  transporter.verify((error: Error | null) => {
    if (error) {
      logger.error('SMTP connection failed', { error });
    } else {
      logger.info('SMTP server ready to send emails');
    }
  });

  return transporter;
}

// Export singleton transporter
export const emailTransporter = createEmailTransporter();

/**
 * Email sender configuration
 */
export const emailConfig = {
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Campus Ground Booking',
    address: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'noreply@groundbooking.com',
  },
};
