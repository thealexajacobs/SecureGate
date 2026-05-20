import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? Number(port) : 587,
    secure: port ? Number(port) === 465 : false,
    auth: { user, pass },
  });
}

async function sendEmail(
  to: string,
  subject: string,
  component: React.ReactElement
): Promise<void> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping email to " + to
    );
    return;
  }

  try {
    const html = await render(component);
    const from = process.env.EMAIL_FROM || "SecureGate <noreply@securegate.app>";

    console.log(`Sending email to ${to} with subject: ${subject}`);

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}:`, info.messageId);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string | null,
  token: string
): Promise<void> {
  await sendEmail(
    email,
    "Verify your email address",
    <VerificationEmail name={name} token={token} />
  );
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  await sendEmail(
    email,
    "Reset your password",
    <ResetPasswordEmail token={token} />
  );
}
