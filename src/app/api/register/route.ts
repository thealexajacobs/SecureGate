import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations";
import { generateToken, tokenExpiry } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input. Please check your details." },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json(
        { error: "Something went wrong. Please try again." },
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

    const token = generateToken();
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: tokenExpiry(15),
      },
    });

    await sendVerificationEmail(email, name ?? null, token);

    return Response.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
