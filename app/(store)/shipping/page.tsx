import type { Metadata } from "next";

import { formatPrice } from "@/lib/utils";
import { SHIPPING_FEE_CENTS } from "@/lib/constants";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Shipping</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Flat-rate shipping</h2>
          <p>
            Every order ships for a flat {formatPrice(SHIPPING_FEE_CENTS)}, shown at checkout before you pay.
            Most orders arrive within 5–7 business days.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Age verification on delivery</h2>
          <p>
            All orders require an adult (18+) signature on delivery, and the carrier may ask for photo ID.
            Orders cannot be left unattended.
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">Order tracking</h2>
          <p>
            You&apos;ll receive a shipping confirmation email with tracking as soon as your order leaves our
            warehouse. Signed-in customers can also check order status any time from{" "}
            <a href="/account" className="underline underline-offset-4">
              My Account
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="mb-1 text-base font-semibold text-foreground">International orders</h2>
          <p>
            We currently ship within the country of origin only, in line with local vaping import restrictions.
            Contact us if you&apos;d like to be notified when international shipping becomes available.
          </p>
        </section>
      </div>
    </div>
  );
}
