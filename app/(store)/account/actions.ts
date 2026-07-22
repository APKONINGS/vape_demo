"use server";

import { createHash, randomBytes } from "crypto";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignupInput,
} from "@/lib/validations";

type ActionResult = { error?: string; success?: string };

export async function signupAction(input: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
    },
  });

  // Deliberately does NOT call signIn()/redirect server-side here: Auth.js's signIn()
  // inside a server action triggers a client-side route transition that reuses the
  // already-cached root layout, so the header's session data stays stale until an
  // unrelated refresh. The client calls signIn() itself (redirect: false) and then
  // router.refresh() — same pattern the login form already uses — which correctly
  // invalidates the layout's server-rendered session.
  return { success: "Account created." };
}

function generateResetToken() {
  const raw = randomBytes(32).toString("hex");
  const hashed = createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
}

export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const allowed = rateLimit(`forgot-password:${ip}:${parsed.data.email}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return { error: "Too many reset requests. Please try again in 15 minutes." };
  }

  const genericSuccess = {
    success: "If an account exists for that email, a password reset link has been sent.",
  };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Google-only accounts (passwordHash = null) can't use forgot-password. Fail silently
  // to avoid leaking whether an email exists or how it authenticates.
  if (!user || !user.passwordHash) {
    return genericSuccess;
  }

  const { raw, hashed } = generateResetToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashed,
      resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/account/reset-password?token=${raw}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return genericSuccess;
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const hashedToken = createHash("sha256").update(parsed.data.token).digest("hex");
  const user = await prisma.user.findFirst({
    where: { resetToken: hashedToken, resetTokenExpiry: { gt: new Date() } },
  });

  if (!user) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

  return { success: "Your password has been updated. You can now log in." };
}
