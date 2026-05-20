import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { success } = await checkRateLimit(`forgot-password:${ip}`);

    if (!success) {
      return Response.json(
        { error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const token = generateToken();
      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires: tokenExpiry(60),
        },
      });

      try {
        await sendPasswordResetEmail(email, token);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
      }
    }

    return Response.json({
      message: "If an account exists with this email, you will receive a reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
