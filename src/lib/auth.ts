import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";
import { authConfig } from "./auth.config";
import { checkRateLimit, getClientIP } from "./rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, request) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const ip = getClientIP(request);
        const { success } = await checkRateLimit(`login:${ip}`);

        if (!success) {
          const error = new CredentialsSignin();
          error.code = "RateLimited";
          throw error;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        if (!user.emailVerified) {
          const error = new CredentialsSignin();
          error.code = "UnverifiedEmail";
          throw error;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
});
