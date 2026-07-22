import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/products";
import { WishlistButton } from "@/components/wishlist-button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { product: { include: { category: true } } },
  });

  const products = items.map((item) => toProductDTO(item.product));

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-2xl font-bold">My Wishlist</h1>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t saved anything yet.{" "}
          <Link href="/products" className="underline underline-offset-4">
            Browse jackets
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <div key={product.id}>
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                  )}
                </div>
              </Link>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <Link href={`/product/${product.slug}`} className="text-sm font-medium hover:underline">
                    {product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(product.salePrice ?? product.price)}
                  </p>
                </div>
                <WishlistButton productId={product.id} slug={product.slug} initialWishlisted />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
