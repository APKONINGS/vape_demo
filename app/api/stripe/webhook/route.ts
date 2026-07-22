import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { asStringArray, type CartItemSnapshot } from "@/lib/json";
import { effectivePrice } from "@/lib/pricing";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const existing = await prisma.order.findUnique({ where: { stripeSessionId: session.id } });
  if (existing) return; // idempotent on webhook retries

  const email = session.customer_details?.email ?? session.customer_email ?? "unknown@guest.checkout";
  const metadataUserId = session.metadata?.userId || null;
  const compactItems: Array<{ p: string; s: string; c: string; q: number }> = JSON.parse(
    session.metadata?.items ?? "[]"
  );

  const productIds = [...new Set(compactItems.map((i) => i.p))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const items: CartItemSnapshot[] = compactItems
    .map((i) => {
      const product = productMap.get(i.p);
      if (!product) return null;
      const images = asStringArray(product.images);
      return {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: effectivePrice(product),
        image: images[0] ?? "",
        size: i.s,
        color: i.c,
        quantity: i.q,
      } satisfies CartItemSnapshot;
    })
    .filter((i): i is CartItemSnapshot => i !== null);

  const userId = metadataUserId ?? (await prisma.user.findUnique({ where: { email } }))?.id ?? null;

  await prisma.$transaction([
    prisma.order.create({
      data: {
        userId,
        email,
        total: session.amount_total ?? 0,
        items: JSON.stringify(items),
        status: "PAID",
        stripeSessionId: session.id,
      },
    }),
    ...compactItems.map((i) =>
      prisma.product.updateMany({
        where: { id: i.p, stock: { gte: i.q } },
        data: { stock: { decrement: i.q } },
      })
    ),
  ]);
}
