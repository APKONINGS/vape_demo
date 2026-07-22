import type { Metadata } from "next";

import { getActiveProducts } from "@/lib/products";
import { filterProducts, type ProductFilterParams } from "@/lib/filter-products";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";

export const metadata: Metadata = {
  title: "Winter Jackets",
  description: "Browse our full collection of winter jackets and outerwear.",
};

interface ProductsPageProps {
  searchParams: ProductFilterParams;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getActiveProducts();

  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const filtered = filterProducts(products, searchParams);

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Winter Jackets</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <ProductFilters sizes={allSizes} colors={allColors} />
        </aside>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
