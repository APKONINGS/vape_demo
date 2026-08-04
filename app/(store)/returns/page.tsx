import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Returns &amp; Exchanges</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">30-day returns on devices &amp; accessories</h2>
          <p>
            Return any unopened, unused device, kit, or accessory in its original packaging within 30 days of
            delivery for a full refund to your original payment method.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Opened e-liquids, pods &amp; disposables</h2>
          <p>
            For health and safety reasons, we can&apos;t accept returns on opened or used e-liquids, pods, coils, or
            disposable vapes. If a consumable item arrives faulty or damaged, contact us within 7 days and
            we&apos;ll replace it.
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
          <h2 className="mb-1 text-base font-semibold text-foreground">Refund timing</h2>
          <p>Once we receive your return, refunds are processed within 3–5 business days.</p>
        </section>
      </div>
    </div>
  );
}
