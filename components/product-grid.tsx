import { ProductCard } from "@/components/product-card";
import type { ProductDTO } from "@/lib/products";

export function ProductGrid({ products }: { products: ProductDTO[] }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
        No jackets match your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
