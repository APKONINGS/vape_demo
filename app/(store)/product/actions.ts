"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema, type ReviewInput } from "@/lib/validations";
import { getProductsBySlugs } from "@/lib/recommendations";
import type { ProductDTO } from "@/lib/products";

type ActionResult = { error?: string; success?: string };

export async function toggleWishlistAction(
  productId: string,
  slug: string
): Promise<ActionResult & { wishlisted?: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sign in to save items to your wishlist." };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath(`/product/${slug}`);
    revalidatePath("/account/wishlist");
    return { wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId: session.user.id, productId } });
  revalidatePath(`/product/${slug}`);
  revalidatePath("/account/wishlist");
  return { wishlisted: true };
}

export async function createReviewAction(input: ReviewInput, slug: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sign in to leave a review." };
  }

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid review." };
  }

  await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId: parsed.data.productId } },
    update: { rating: parsed.data.rating, comment: parsed.data.comment },
    create: {
      userId: session.user.id,
      productId: parsed.data.productId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  revalidatePath(`/product/${slug}`);
  return { success: "Thanks for your review!" };
}

/** Recently-viewed slugs live in localStorage (see store/recently-viewed-store.ts), so the
 * client fetches fresh product data for them via this action rather than a server-rendered query. */
export async function getRecentlyViewedProductsAction(slugs: string[]): Promise<ProductDTO[]> {
  return getProductsBySlugs(slugs);
}
