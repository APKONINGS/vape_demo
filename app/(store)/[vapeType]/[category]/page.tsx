import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductsByCategorySlug } from "@/lib/products";
import { filterProducts, type ProductFilterParams } from "@/lib/filter-products";
import { NAV_VAPE_TYPES, PRODUCT_TYPES } from "@/lib/constants";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Breadcrumbs } from "@/components/breadcrumbs";

function findVapeType(slug: string) {
  return NAV_VAPE_TYPES.find((v) => v.slug === slug.toLowerCase()) ?? null;
}

function findType(slug: string) {
  return PRODUCT_TYPES.find((t) => t.type === slug.toLowerCase()) ?? null;
}

export function generateStaticParams() {
  return NAV_VAPE_TYPES.flatMap((v) => PRODUCT_TYPES.map((t) => ({ vapeType: v.slug, category: t.type })));
}

interface CategoryPageProps {
  params: { vapeType: string; category: string };
  searchParams: ProductFilterParams;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const vapeType = findVapeType(params.vapeType);
  const type = findType(params.category);
  if (!vapeType || !type) return {};

  return {
    title: `${vapeType.label} — ${type.label}`,
    description: `Shop ${type.label.toLowerCase()} ${vapeType.label.toLowerCase()}.`,
  };
}

export default async function VapeCategoryPage({ params, searchParams }: CategoryPageProps) {
  const vapeType = findVapeType(params.vapeType);
  const type = findType(params.category);
  if (!vapeType || !type) notFound();

  const dbCategorySlug = `${vapeType.slug}-${type.type}`;
  const products = await getProductsByCategorySlug(vapeType.value, dbCategorySlug);

  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const filtered = filterProducts(products, searchParams);

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: vapeType.label, href: `/${vapeType.slug}` },
          { label: type.label },
        ]}
      />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        {vapeType.label} — {type.label}
      </h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <ProductFilters sizes={allSizes} colors={allColors} />
        </aside>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
