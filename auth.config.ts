import type { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import type { Role } from "@/lib/constants";

/**
 * Edge-safe config: no Prisma adapter, no Credentials provider (bcrypt is Node-only).
 * Used directly by middleware.ts to read/verify the session JWT on the Edge runtime.
 * The full config in auth.ts extends this with the Prisma adapter + Credentials provider.
 */
export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/account/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: { id?: string; role?: Role } }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        if (token.id) session.user.id = token.id;
        session.user.role = token.role ?? "CUSTOMER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
