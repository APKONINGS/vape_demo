import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { asStringArray } from "@/lib/json";
import { effectivePrice } from "@/lib/pricing";
import { SHIPPING_FEE_CENTS } from "@/lib/constants";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        size: z.string().min(1),
        color: z.string().min(1),
        quantity: z.number().int().positive().max(10),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }

  const session = await auth();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const productIds = [...new Set(parsed.data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems: Array<{
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images: string[]; metadata: Record<string, string> };
    };
    quantity: number;
  }> = [];

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.active) {
      return NextResponse.json({ error: "One or more items are no longer available." }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `${product.title} is out of stock.` }, { status: 400 });
    }

    const images = asStringArray(product.images);

    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: effectivePrice(product),
        product_data: {
          name: `${product.title} (${item.size} / ${item.color})`,
          images: images[0] ? [images[0]] : [],
          metadata: { productId: product.id, size: item.size, color: item.color },
        },
      },
      quantity: item.quantity,
    });
  }

  // Compact metadata (Stripe limits each value to 500 chars) — full snapshot is rebuilt from
  // Product records in the webhook handler, never trusted from the client.
  const compactItems = parsed.data.items.map((i) => ({
    p: i.productId,
    s: i.size,
    c: i.color,
    q: i.quantity,
  }));

  let stripeCustomerId: string | undefined;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    stripeCustomerId = user?.stripeCustomerId ?? undefined;

    if (!stripeCustomerId && user) {
      const customer = await stripe.customers.create({ email: user.email, name: user.name ?? undefined });
      stripeCustomerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId } });
    }
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/products?checkout=cancelled`,
    customer: stripeCustomerId,
    // Shipping is not free — a flat rate is added as a real Checkout line item (not a
    // cosmetic display-only fee) so session.amount_total, and therefore Order.total in
    // the webhook, already includes it with no extra bookkeeping.
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: SHIPPING_FEE_CENTS, currency: "usd" },
          display_name: "Flat-rate shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    metadata: {
      userId: session?.user?.id ?? "",
      items: JSON.stringify(compactItems),
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
