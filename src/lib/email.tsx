import { Resend } from "resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set in environment variables");
  }
  return new Resend(apiKey || "");
}

async function sendEmail(
  to: string,
  subject: string,
  component: React.ReactElement
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      `RESEND_API_KEY is not set. Skipping email to ${to}`
    );
    return;
  }

  try {
    const html = await render(component);
    console.log(`Sending email to ${to} with subject: ${subject}`);

    const { data, error } = await getResend().emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`Resend API error for ${to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`Email sent successfully to ${to}:`, data);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

