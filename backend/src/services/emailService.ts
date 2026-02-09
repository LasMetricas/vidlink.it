import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ERROR_NOTIFY_EMAIL = process.env.ERROR_NOTIFY_EMAIL || GMAIL_USER;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export interface FrontendErrorPayload {
  errorMessage: string;
  errorStack?: string;
  errorType: string;
  url: string;
  userAgent: string;
  userEmail?: string;
  errorId?: string;
  metadata?: Record<string, unknown>;
}

export async function sendFrontendErrorNotification(
  payload: FrontendErrorPayload
): Promise<void> {
  const transport = getTransporter();
  if (!transport || !ERROR_NOTIFY_EMAIL) {
    console.warn(
      "Gmail not configured (GMAIL_USER, GMAIL_APP_PASSWORD, or ERROR_NOTIFY_EMAIL). Skipping email."
    );
    return;
  }

  const {
    errorMessage,
    errorStack,
    errorType,
    url,
    userAgent,
    userEmail,
    errorId,
    metadata,
  } = payload;

  const stackPreview =
    errorStack && errorStack.length > 500
      ? errorStack.slice(0, 500) + "\n..."
      : errorStack || "(no stack)";
  const metaStr =
    metadata && Object.keys(metadata).length
      ? JSON.stringify(metadata, null, 2)
      : "(none)";

  const html = `
    <h2>Frontend error reported</h2>
    <p><strong>Type:</strong> ${errorType}</p>
    <p><strong>Message:</strong> ${escapeHtml(errorMessage)}</p>
    <p><strong>URL:</strong> ${escapeHtml(url)}</p>
    <p><strong>User agent:</strong> ${escapeHtml(userAgent)}</p>
    ${userEmail ? `<p><strong>User email:</strong> ${escapeHtml(userEmail)}</p>` : ""}
    ${errorId ? `<p><strong>Error ID:</strong> ${errorId}</p>` : ""}
    <h3>Stack</h3>
    <pre>${escapeHtml(stackPreview)}</pre>
    <h3>Metadata</h3>
    <pre>${escapeHtml(metaStr)}</pre>
  `;

  const text = [
    "Frontend error reported",
    `Type: ${errorType}`,
    `Message: ${errorMessage}`,
    `URL: ${url}`,
    `User agent: ${userAgent}`,
    userEmail ? `User email: ${userEmail}` : "",
    errorId ? `Error ID: ${errorId}` : "",
    "Stack:",
    stackPreview,
    "Metadata:",
    metaStr,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await transport.sendMail({
      from: `Vidlink Errors <${GMAIL_USER}>`,
      to: ERROR_NOTIFY_EMAIL,
      subject: `[Vidlink] Frontend error: ${errorMessage.slice(0, 60)}${errorMessage.length > 60 ? "…" : ""}`,
      text,
      html,
    });
  } catch (err) {
    console.error("Failed to send frontend error email:", err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
