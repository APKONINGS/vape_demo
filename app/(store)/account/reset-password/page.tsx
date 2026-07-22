"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordRequirements } from "@/components/password-requirements";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { resetPasswordAction } from "@/app/(store)/account/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const password = watch("password") ?? "";

  async function onSubmit(data: ResetPasswordInput) {
    setMessage(null);
    setIsSubmitting(true);

    const result = await resetPasswordAction(data);

    setIsSubmitting(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    setMessage({ type: "success", text: result.success ?? "Password updated." });
    setTimeout(() => router.push("/account/login"), 1500);
  }

  if (!token) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid link</CardTitle>
            <CardDescription>
              This password reset link is missing a token.{" "}
              <Link href="/account/forgot-password" className="underline underline-offset-4">
                Request a new one
              </Link>
              .
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("token")} />
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <PasswordInput id="password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              <PasswordRequirements password={password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {message && (
              <p className={message.type === "error" ? "text-sm text-destructive" : "text-sm text-green-600"}>
                {message.text}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

