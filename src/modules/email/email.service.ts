import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail = 'SecureMango <noreply@securemango.com>';

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('resend.apiKey') || '';
    this.resend = new Resend(apiKey || 'placeholder');
    if (!apiKey) {
      this.logger.warn('Resend API key not configured — emails will not be sent');
    }
  }

  async sendWelcomeEmail(email: string, name?: string) {
    const blogUrl = this.config.get<string>('blogUrl');
    const greeting = name ? `Hi ${name}` : 'Hi there';

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Welcome to SecureMango — You\'re In! 🥭',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #065f46; font-size: 24px; margin-bottom: 16px;">${greeting},</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Welcome to <strong>SecureMango</strong>! You're now part of a community of security professionals
              who stay ahead of the curve.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Here's what you'll get:</p>
            <ul style="color: #374151; font-size: 16px; line-height: 1.8;">
              <li><strong>Weekly security digest</strong> — curated insights delivered to your inbox</li>
              <li><strong>Exclusive content</strong> — deep-dives you won't find on the blog</li>
              <li><strong>Zero spam</strong> — unsubscribe anytime with one click</li>
            </ul>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              In the meantime, check out our latest articles:
            </p>
            <a href="${blogUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">
              Browse the Blog
            </a>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">
              You received this because you subscribed at ${blogUrl}.
              <a href="${blogUrl}/api/subscribers/unsubscribe/${encodeURIComponent(email)}" style="color: #9ca3af;">Unsubscribe</a>
            </p>
          </div>
        `,
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const blogUrl = this.config.get<string>('blogUrl');

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Confirm your SecureMango subscription',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #065f46; font-size: 24px; margin-bottom: 16px;">Confirm your email</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Click the button below to verify your email and complete your subscription to SecureMango.
            </p>
            <a href="${blogUrl}/api/subscribers/verify/${token}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
              Verify Email
            </a>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you didn't subscribe, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">SecureMango — ${blogUrl}</p>
          </div>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
    }
  }

  async sendLeadMagnetEmail(email: string, title: string, downloadUrl: string) {
    const blogUrl = this.config.get<string>('blogUrl');

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Your download: ${title}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #065f46; font-size: 24px; margin-bottom: 16px;">Your resource is ready!</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Here's your download link for <strong>${title}</strong>:
            </p>
            <a href="${downloadUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
              Download Now
            </a>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              This link will remain active. You can come back and download anytime.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">
              SecureMango — ${blogUrl} |
              <a href="${blogUrl}/api/subscribers/unsubscribe/${encodeURIComponent(email)}" style="color: #9ca3af;">Unsubscribe</a>
            </p>
          </div>
        `,
      });
      this.logger.log(`Lead magnet email sent to ${email} for "${title}"`);
    } catch (error) {
      this.logger.error(`Failed to send lead magnet email to ${email}`, error);
    }
  }
}
