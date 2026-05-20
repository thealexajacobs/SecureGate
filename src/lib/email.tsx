import nodemailer from "nodemailer";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";

type EmailProvider = "nodemailer" | "resend";

function getProvider(): EmailProvider | null {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase().trim();
  if (provider === "resend") return "resend";
  return "nodemailer";
}

async function sendViaNodemailer(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping email to " + to);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
  });

  const from = process.env.EMAIL_FROM || "SecureGate <noreply@securegate.app>";

  const info = await transporter.sendMail({ from, to, subject, html });
  console.log(`Email sent via Nodemailer to ${to}:`, info.messageId);
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Skipping email to " + to);
    return;
  }

  const { data, error } = await new Resend(apiKey).emails.send({
    from: process.env.EMAIL_FROM || "SecureGate <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error("Resend error: " + error.message);
  }

  console.log("Email sent via Resend to " + to + ":", data);
}

async function sendEmail(
  to: string,
  subject: string,
  component: React.ReactElement
): Promise<void> {
  const provider = getProvider();

  try {
    const html = await render(component);
    console.log(`Sending email to ${to} via ${provider} — subject: ${subject}`);

    if (provider === "resend") {
      await sendViaResend(to, subject, html);
    } else {
      await sendViaNodemailer(to, subject, html);
    }
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
