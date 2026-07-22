"use client";

import { useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlist } from "@/components/wishlist-context";
import { toggleWishlistAction } from "@/app/(store)/product/actions";
import { effectivePrice } from "@/lib/pricing";
import type { ProductDTO } from "@/lib/products";

/** Overlaid top-right on <ProductCard> — sits as a sibling of the card's <Link>, not a
 * descendant, so clicking these buttons never triggers the card's own navigation. */
export function ProductCardActions({ product }: { product: ProductDTO }) {
  const { status } = useSession();
  const router = useRouter();
  const { isWishlisted, setWishlisted } = useWishlist();
  const [isPending, startTransition] = useTransition();
  const addItem = useCartStore((s) => s.addItem);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock === 0;

  function handleAddToCart(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    const size = product.sizes[0];
    const color = product.colors[0];
    if (!size || !color) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: effectivePrice(product),
      image: product.images[0] ?? "",
      size,
      color,
      quantity: 1,
    });

    toast.success(`${product.title} added to cart.`, {
      description: `${size} / ${color}`,
    });
  }

  function handleToggleWishlist(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push(`/account/login?callbackUrl=/product/${product.slug}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlistAction(product.id, product.slug);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const nowWishlisted = result.wishlisted ?? false;
      setWishlisted(product.id, nowWishlisted);
      toast.success(nowWishlisted ? "Added to your wishlist." : "Removed from your wishlist.");
    });
  }

  return (
    <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleToggleWishlist}
        disabled={isPending}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-background disabled:opacity-50"
      >
        <Heart className={cn("h-4 w-4", wishlisted && "fill-destructive text-destructive")} />
      </button>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock}
        aria-label="Add to cart"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-background disabled:opacity-40"
      >
        <ShoppingBag className="h-4 w-4" />
      </button>
    </div>
  );
}
