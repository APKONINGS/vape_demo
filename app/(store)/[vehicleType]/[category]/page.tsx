import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductsByCategorySlug } from "@/lib/products";
import { filterProducts, type ProductFilterParams } from "@/lib/filter-products";
import { NAV_VEHICLE_TYPES, PRODUCT_TYPES } from "@/lib/constants";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Breadcrumbs } from "@/components/breadcrumbs";

function findVehicleType(slug: string) {
  return NAV_VEHICLE_TYPES.find((v) => v.slug === slug.toLowerCase()) ?? null;
}

function findType(slug: string) {
  return PRODUCT_TYPES.find((t) => t.type === slug.toLowerCase()) ?? null;
}

export function generateStaticParams() {
  return NAV_VEHICLE_TYPES.flatMap((v) => PRODUCT_TYPES.map((t) => ({ vehicleType: v.slug, category: t.type })));
}

interface CategoryPageProps {
  params: { vehicleType: string; category: string };
  searchParams: ProductFilterParams;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const vehicleType = findVehicleType(params.vehicleType);
  const type = findType(params.category);
  if (!vehicleType || !type) return {};

  return {
    title: `${vehicleType.label} ${type.label}`,
    description: `Shop ${type.label.toLowerCase()} for ${vehicleType.label.toLowerCase()}.`,
  };
}

export default async function VehicleCategoryPage({ params, searchParams }: CategoryPageProps) {
  const vehicleType = findVehicleType(params.vehicleType);
  const type = findType(params.category);
  if (!vehicleType || !type) notFound();

  const dbCategorySlug = `${vehicleType.slug}-${type.type}`;
  const products = await getProductsByCategorySlug(vehicleType.value, dbCategorySlug);

  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const filtered = filterProducts(products, searchParams);

  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: vehicleType.label, href: `/${vehicleType.slug}` },
          { label: type.label },
        ]}
      />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        {vehicleType.label} {type.label}
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
