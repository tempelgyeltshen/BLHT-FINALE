/**
 * Email notification service.
 *
 * The project intentionally has no hard SMTP dependency. Instead this service
 * supports two transports:
 *  1. A webhook URL (`EMAIL_WEBHOOK_URL`) — the message is POSTed as JSON,
 *     which lets deployments hook up any provider (Resend, SendGrid, Zapier…).
 *  2. Console/log transport — used in development and when no webhook is set,
 *     so calls are safe no-ops instead of silent failures.
 */

import { logger } from '../../core/config/logger.js';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const webhookUrl = process.env.EMAIL_WEBHOOK_URL || '';

const isWebhookConfigured = () => webhookUrl.length > 0;

/**
 * Send an email. Never throws — failures are logged and reported as `false`
 * so callers (e.g. the inquiry flow) can proceed regardless.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!isWebhookConfigured()) {
    logger.info(
      `[email:dev] ${message.subject} -> ${message.to}\n${message.text}`,
    );
    return true;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'no-reply@bhutanlhtours.com',
        ...message,
      }),
    });

    if (!response.ok) {
      logger.warn(`Email webhook responded ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    logger.error('Email delivery failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/** Shortcut for sending the inquiry acknowledgment to the admin inbox. */
export function sendInquiryNotification(inquiry: {
  fullName: string;
  email: string;
  country?: string;
  message?: string;
}): Promise<boolean> {
  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'info@bhutanlhtours.com',
    subject: `New inquiry from ${inquiry.fullName}`,
    text: [
      `Name: ${inquiry.fullName}`,
      `Email: ${inquiry.email}`,
      inquiry.country ? `Country: ${inquiry.country}` : '',
      inquiry.message ? `\nMessage:\n${inquiry.message}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  });
}
