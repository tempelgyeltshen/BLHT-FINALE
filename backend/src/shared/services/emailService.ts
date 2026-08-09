/**
 * Email notification service.
 *
 * Supports three transports (first configured wins):
 *  1. `RESEND_API_KEY`      — Resend REST API (https://api.resend.com/emails).
 *                             Recommended: simple REST call, generous free tier,
 *                             no extra dependencies (uses global fetch).
 *  2. `EMAIL_WEBHOOK_URL`   — the message is POSTed as JSON, which lets
 *                             deployments hook up any provider (Zapier, etc.).
 *  3. Console/log transport — used in development and when no transport is
 *                             configured, so calls are safe no-ops instead of
 *                             silent failures.
 */

import { logger } from '../../core/config/logger.js';

export interface EmailMessage {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  cc?: string | string[];
  replyTo?: string | string[];
}

const resendApiKey = process.env.RESEND_API_KEY || '';
const webhookUrl = process.env.EMAIL_WEBHOOK_URL || '';
// Default from is Resend's test address: it only delivers to the account
// owner until a custom domain is verified — swap in EMAIL_FROM once verified.
const fromAddress = process.env.EMAIL_FROM || 'Inquiries <onboarding@resend.dev>';
// Default admin inbox for inquiry notifications (site owner).
const defaultAdminEmail = process.env.ADMIN_EMAIL || 'tempelgyeltshen12345@gmail.com';

const isResendConfigured = () => resendApiKey.length > 0;
const isWebhookConfigured = () => webhookUrl.length > 0;

/** Send via the Resend REST API. */
async function sendViaResend(message: EmailMessage): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: message.to,
        subject: message.subject,
        text: message.text,
        ...(message.html ? { html: message.html } : {}),
        ...(message.cc ? { cc: message.cc } : {}),
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      logger.warn(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
      return false;
    }
    logger.info(`[email:resend] "${message.subject}" -> ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`);
    return true;
  } catch (error) {
    logger.error('Email delivery via Resend failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/** Send via a generic webhook that receives the email payload as JSON. */
async function sendViaWebhook(message: EmailMessage): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromAddress, ...message }),
    });

    if (!response.ok) {
      logger.warn(`Email webhook responded ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    logger.error('Email delivery via webhook failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Send an email. Never throws — failures are logged and reported as `false`
 * so callers (e.g. the inquiry flow) can proceed regardless.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (isResendConfigured()) {
    return sendViaResend(message);
  }

  if (isWebhookConfigured()) {
    return sendViaWebhook(message);
  }

  logger.info(
    `[email:dev] ${message.subject} -> ${Array.isArray(message.to) ? message.to.join(', ') : message.to}\n${message.text}`,
  );
  return true;
}

/** Build a plain-text + HTML rendering of the inquiry for email bodies. */
function inquiryText(inquiry: {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  travelDates?: string;
  durationDays?: number;
  groupSize?: number;
  interests?: string[];
  estimatedBudgetPerPerson?: string;
  message?: string;
}): string {
  return [
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    inquiry.phone ? `Phone: ${inquiry.phone}` : '',
    inquiry.country ? `Country: ${inquiry.country}` : '',
    inquiry.travelDates ? `Preferred Dates: ${inquiry.travelDates}` : '',
    inquiry.durationDays ? `Duration: ${inquiry.durationDays} days` : '',
    inquiry.groupSize ? `Group Size: ${inquiry.groupSize} guests` : '',
    inquiry.estimatedBudgetPerPerson ? `Estimated Budget: ${inquiry.estimatedBudgetPerPerson}` : '',
    inquiry.interests?.length ? `Interests: ${inquiry.interests.join(', ')}` : '',
    inquiry.message ? `\nMessage:\n${inquiry.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** Minimal HTML escaping so admin/client text never corrupts email markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inquiryHtml(inquiry: {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  travelDates?: string;
  durationDays?: number;
  groupSize?: number;
  interests?: string[];
  estimatedBudgetPerPerson?: string;
  message?: string;
}): string {
  const row = (label: string, value?: string | number) =>
    value
      ? `<tr><td style="padding:6px 12px;font-weight:bold;color:#7c4a03;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#2b1d14">${value}</td></tr>`
      : '';
  return `
  <div style="font-family:Georgia,serif;background:#fcf8f2;padding:24px;color:#2b1d14">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e2d1be;border-radius:12px;overflow:hidden">
      <div style="background:#3b2314;color:#f5eee4;padding:16px 20px">
        <h2 style="margin:0;font-size:18px">New Inquiry — ${inquiry.fullName}</h2>
        <p style="margin:4px 0 0;font-size:12px;color:#d96b27">Bhutan Land Of Happiness Tours</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        ${row('Name', inquiry.fullName)}
        ${row('Email', inquiry.email)}
        ${row('Phone', inquiry.phone)}
        ${row('Country', inquiry.country)}
        ${row('Preferred Dates', inquiry.travelDates)}
        ${row('Duration', inquiry.durationDays ? `${inquiry.durationDays} days` : undefined)}
        ${row('Group Size', inquiry.groupSize ? `${inquiry.groupSize} guests` : undefined)}
        ${row('Budget', inquiry.estimatedBudgetPerPerson)}
        ${row('Interests', inquiry.interests?.join(', '))}
      </table>
      ${inquiry.message ? `<div style="padding:14px 20px;border-top:1px solid #eee"><strong style="color:#7c4a03">Message:</strong><p style="margin:6px 0 0;line-height:1.6">${escapeHtml(inquiry.message)}</p></div>` : ''}
      <div style="background:#f5eee4;padding:12px 20px;font-size:11px;color:#7c4a03">
        Reply to the client directly at ${inquiry.email} to dispatch a proposal.
      </div>
    </div>
  </div>`;
}

/** Notification email sent to the admin inbox when a new inquiry arrives. */
export function sendInquiryNotification(inquiry: {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  travelDates?: string;
  durationDays?: number;
  groupSize?: number;
  interests?: string[];
  estimatedBudgetPerPerson?: string;
  message?: string;
}): Promise<boolean> {
  return sendEmail({
    to: defaultAdminEmail,
    subject: `New inquiry from ${inquiry.fullName}`,
    text: `A new tour inquiry was submitted on the website.\n\n${inquiryText(inquiry)}`,
    html: inquiryHtml(inquiry),
    replyTo: inquiry.email,
  });
}

/** Email sent to the client when the admin dispatches a proposal from the inbox. */
export function sendProposalEmail(
  inquiry: { fullName: string; email: string },
  proposalText: string,
): Promise<boolean> {
  return sendEmail({
    to: inquiry.email,
    subject: `Your Bhutan Tour Proposal — from Bhutan Land Of Happiness Tours`,
    text: `Dear ${inquiry.fullName},\n\nThank you for your inquiry. Here is your personalized tour proposal:\n\n${proposalText}\n\nWith warm regards,\nBhutan Land Of Happiness Tours\n`,
    html: `
    <div style="font-family:Georgia,serif;background:#fcf8f2;padding:24px;color:#2b1d14">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e2d1be;border-radius:12px;overflow:hidden">
        <div style="background:#3b2314;color:#f5eee4;padding:16px 20px">
          <h2 style="margin:0;font-size:18px">Your Bhutan Tour Proposal</h2>
          <p style="margin:4px 0 0;font-size:12px;color:#d96b27">Bhutan Land Of Happiness Tours</p>
        </div>
        <div style="padding:20px;font-size:13px;line-height:1.7">
          <p>Dear <strong>${inquiry.fullName}</strong>,</p>
          <p>Thank you for your inquiry. Here is your personalized tour proposal:</p>
          <div style="background:#f5eee4;border-left:4px solid #d96b27;padding:14px 16px;border-radius:8px;white-space:pre-wrap">${escapeHtml(proposalText)}</div>
          <p>With warm regards,<br/><strong>Bhutan Land Of Happiness Tours</strong></p>
        </div>
      </div>
    </div>`,
    replyTo: defaultAdminEmail,
  });
}
