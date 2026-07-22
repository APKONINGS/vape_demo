"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlistAction } from "@/app/(store)/product/actions";
import { useWishlist } from "@/components/wishlist-context";

export function WishlistButton({
  productId,
  slug,
  initialWishlisted,
}: {
  productId: string;
  slug: string;
  initialWishlisted: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const { setWishlisted: setWishlistedInContext } = useWishlist();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (status !== "authenticated") {
      router.push(`/account/login?callbackUrl=/product/${slug}`);
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlistAction(productId, slug);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const nowWishlisted = result.wishlisted ?? false;
      setWishlisted(nowWishlisted);
      setWishlistedInContext(productId, nowWishlisted);
      toast.success(nowWishlisted ? "Added to your wishlist." : "Removed from your wishlist.");
    });
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5", wishlisted && "fill-destructive text-destructive")} />
    </Button>
  );
}
