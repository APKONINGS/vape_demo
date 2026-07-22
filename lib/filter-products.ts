import type { ProductDTO } from "@/lib/products";

export interface ProductFilterParams {
  size?: string;
  color?: string;
  price?: string;
}

/** Shared price/size/color filtering used by /products, /[gender], and /collections/[slug]. */
export function filterProducts(products: ProductDTO[], searchParams: ProductFilterParams): ProductDTO[] {
  const selectedSizes = searchParams.size?.split(",").filter(Boolean) ?? [];
  const selectedColors = searchParams.color?.split(",").filter(Boolean) ?? [];
  const [minPrice, maxPrice]: (number | undefined)[] = (searchParams.price ?? "").split("-").map(Number);

  return products.filter((product) => {
    if (selectedSizes.length && !product.sizes.some((s) => selectedSizes.includes(s))) return false;
    if (selectedColors.length && !product.colors.some((c) => selectedColors.includes(c))) return false;
    if (minPrice !== undefined && maxPrice !== undefined && !Number.isNaN(minPrice) && !Number.isNaN(maxPrice)) {
      if (product.price < minPrice || product.price > maxPrice) return false;
    }
    return true;
  });
}
