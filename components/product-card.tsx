"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import type { ProductDTO } from "@/lib/products";
import { ProductCardActions } from "@/components/product-card-actions";

export function ProductCard({ product }: { product: ProductDTO }) {
  const [hovered, setHovered] = useState(false);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? primaryImage;

  return (
    <div className="group relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <ProductCardActions product={product} />

      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
          {primaryImage && (
            <Image
              src={(hovered ? secondaryImage : primaryImage) ?? primaryImage}
              alt={product.title}
              fill
              loading="lazy"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {product.stock === 0 && (
            <span className="absolute left-2 top-2 rounded bg-background/90 px-2 py-1 text-xs font-medium">
              Sold out
            </span>
          )}
          {product.salePrice && product.stock > 0 && (
            <span className="absolute left-2 top-2 rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
              Sale
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium">{product.title}</h3>
          {product.salePrice ? (
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
              <span className="font-medium text-destructive">{formatPrice(product.salePrice)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
