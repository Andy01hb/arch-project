import nodemailer from 'nodemailer';
import logger from '../utils/logger';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private isConfigured: boolean = false;

    constructor() {
        this.isConfigured = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);

        if (this.isConfigured) {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        }
    }

    async sendOrderConfirmation(to: string, orderId: string, total: number, items: Array<{ name: string; price: number }>) {
        if (!this.transporter) {
            logger.warn('Email service not configured. Skipping order confirmation email.');
            return;
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"ArchStore" <noreply@archstore.com>',
                to,
                subject: `Confirmation of Order #${orderId.slice(0, 8)}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333;">Thank you for your purchase!</h1>
                        <p>Your order has been confirmed.</p>
                        
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h2 style="margin-top: 0;">Order Details</h2>
                            <ul style="list-style: none; padding: 0;">
                                ${items.map(item => `
                                    <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                                        <span>${item.name}</span>
                                        <strong>$${item.price.toFixed(2)}</strong>
                                    </li>
                                `).join('')}
                            </ul>
                            <div style="text-align: right; margin-top: 15px; font-size: 1.2em;">
                                <strong>Total: $${total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/downloads/${orderId}" 
                               style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Download Your Files
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 0.9em;">
                            If the button doesn't work, copy this link:<br>
                            ${process.env.FRONTEND_URL}/downloads/${orderId}
                        </p>
                    </div>
                `,
            });
            logger.info(`Order confirmation email sent: ${info.messageId}`);
        } catch (error) {
            logger.error('Error sending email:', error);
            throw error;
        }
    }
}

