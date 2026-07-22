import type { Metadata } from "next";
import { Search } from "lucide-react";

import { searchProducts } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/product-grid";

export const metadata: Metadata = { title: "Search" };

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="container py-8">
      <form action="/search" method="GET" className="relative mb-8 max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={query} placeholder="Search jackets..." className="pl-8" autoFocus />
      </form>

      {query ? (
        <>
          <h1 className="mb-8 text-xl text-muted-foreground">
            {products.length} result{products.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </h1>
          <ProductGrid products={products} />
        </>
      ) : (
        <p className="text-muted-foreground">Search for a jacket by name or description.</p>
      )}
    </div>
  );
}
