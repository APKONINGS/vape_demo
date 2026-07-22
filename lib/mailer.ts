import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Promise<Transporter> | null = null;

/**
 * In dev, when SMTP_HOST isn't set, auto-provisions a free Ethereal.email test
 * inbox so password-reset emails can be previewed without any real SMTP account.
 */
async function getTransporter(): Promise<Transporter> {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = (async () => {
    if (process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });
    }

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SMTP_HOST is not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS in .env for production."
      );
    }

    const testAccount = await nodemailer.createTestAccount();
    console.log(
      `[mailer] No SMTP_HOST set — using Ethereal test inbox. Login: ${testAccount.user} / ${testAccount.pass}`
    );

    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  })();

  return cachedTransporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "4F Store <no-reply@4fstore.example>",
    to,
    subject: "Reset your 4F Store password",
    text: `Reset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p style="color:#666;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[mailer] Preview password reset email: ${previewUrl}`);
  }
}
