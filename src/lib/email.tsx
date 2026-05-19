import { Resend } from "resend";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

async function sendEmail(
  to: string,
  subject: string,
  component: React.ReactElement
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "RESEND_API_KEY is not set. Skipping email to", to
    );
    return;
  }

  const html = await render(component);

  await resend.emails.send({
    from: "SecureGate <noreply@securegate.auth>",
    to,
    subject,
    html,
  });
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
