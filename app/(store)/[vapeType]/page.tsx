import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductsByVapeType } from "@/lib/products";
import { filterProducts, type ProductFilterParams } from "@/lib/filter-products";
import { NAV_VAPE_TYPES, PRODUCT_TYPES } from "@/lib/constants";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Breadcrumbs } from "@/components/breadcrumbs";

function findVapeType(slug: string) {
  return NAV_VAPE_TYPES.find((v) => v.slug === slug.toLowerCase()) ?? null;
}

export function generateStaticParams() {
  return NAV_VAPE_TYPES.map((v) => ({ vapeType: v.slug }));
}

interface VapeTypePageProps {
  params: { vapeType: string };
  searchParams: ProductFilterParams;
}

export async function generateMetadata({ params }: VapeTypePageProps): Promise<Metadata> {
  const vapeType = findVapeType(params.vapeType);
  if (!vapeType) return {};

  return {
    title: vapeType.label,
    description: `Shop ${vapeType.label.toLowerCase()} — fruit, menthol & ice, dessert, tobacco flavors, and accessories.`,
  };
}

export default async function VapeTypePage({ params, searchParams }: VapeTypePageProps) {
  const vapeType = findVapeType(params.vapeType);
  if (!vapeType) notFound();

  const products = await getProductsByVapeType(vapeType.value);

  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const filtered = filterProducts(products, searchParams);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: vapeType.label }]} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{vapeType.label}</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        {PRODUCT_TYPES.map((type) => (
          <Link
            key={type.type}
            href={`/${vapeType.slug}/${type.type}`}
            className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            {type.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <ProductFilters sizes={allSizes} colors={allColors} />
        </aside>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
