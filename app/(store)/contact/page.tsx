import type { Metadata } from "next";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
        Questions about an order, fitment, or a product? Reach out and we&apos;ll get back to you as soon as we can.
      </p>

      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <a href="mailto:support@4fstore.example" className="text-sm text-muted-foreground hover:text-foreground">
              support@4fstore.example
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Support hours</p>
            <p className="text-sm text-muted-foreground">Monday–Friday, 9am–5pm</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        For order-specific questions, sign in to{" "}
        <a href="/account" className="underline underline-offset-4">
          My Account
        </a>{" "}
        first so we can look up your order faster.
      </p>
    </div>
  );
}
