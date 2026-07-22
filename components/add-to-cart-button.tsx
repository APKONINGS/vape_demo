"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart-store";
import type { ProductDTO } from "@/lib/products";
import { effectivePrice } from "@/lib/pricing";
import { TapScale } from "@/components/motion/tap-scale";

export function AddToCartButton({ product }: { product: ProductDTO }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const addItem = useCartStore((s) => s.addItem);

  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    if (!size || !color) {
      toast.error("Please select a size and color.");
      return;
    }

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

    toast.success(`${product.title} added to cart.`);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {product.colors.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TapScale className="w-full">
        <Button size="lg" className="w-full" disabled={outOfStock} onClick={handleAddToCart}>
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </Button>
      </TapScale>
    </div>
  );
}
