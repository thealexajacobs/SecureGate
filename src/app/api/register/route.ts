import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    // Improve error handling and logging
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error);
      return Response.json(
        { error: "Invalid input. Please check your details." },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    console.log("Register: parsed input for", email);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.error("Duplicate email detected:", email);
      return Response.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    console.log("Register: user created for", email);

    const token = generateToken();
    const createdToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: tokenExpiry(15),
      },
    });
    console.log("Register: verification token created", { token: createdToken.token, expires: createdToken.expires });

    try {
      await sendVerificationEmail(email, name ?? null, token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;
      console.log("DEV FALLBACK - Verification URL:", verificationUrl);
      // Do not block account creation if email fails
    }

    return Response.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Register error:", errorMessage, error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
