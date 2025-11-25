import nodemailer from 'nodemailer';
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
export declare function createEmailTransporter(): nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options> | null;
export declare const emailTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options> | null;
/**
 * Email sender configuration
 */
export declare const emailConfig: {
    from: {
        name: string;
        address: string;
    };
};
//# sourceMappingURL=email.d.ts.map