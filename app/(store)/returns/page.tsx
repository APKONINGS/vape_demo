import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Returns &amp; Exchanges</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">30-day returns</h2>
          <p>
            Not the right fit for your vehicle? Return any uninstalled, unused part in its original packaging
            within 30 days of delivery for a full refund to your original payment method.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Installed or used parts</h2>
          <p>
            Parts that have been installed, mounted, or show signs of use (including wheels and tires that have
            been road-driven) can&apos;t be returned for safety and liability reasons.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">How to start a return</h2>
          <p>
            Sign in to{" "}
            <a href="/account" className="underline underline-offset-4">
              My Account
            </a>
            , find your order, and select &ldquo;Start a return.&rdquo; Checked out as a guest? Contact us with your
            order number and we&apos;ll take care of it.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Wrong fitment</h2>
          <p>
            Ordered the wrong wheel size or bolt pattern? Check our{" "}
            <a href="/fitment-guide" className="underline underline-offset-4">
              Fitment Guide
            </a>{" "}
            before reordering, or contact us with your vehicle&apos;s year, make, and model for help.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Refund timing</h2>
          <p>Once we receive your return, refunds are processed within 3–5 business days.</p>
        </section>
      </div>
    </div>
  );
}
