import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductsByVehicleType } from "@/lib/products";
import { filterProducts, type ProductFilterParams } from "@/lib/filter-products";
import { NAV_VEHICLE_TYPES, PRODUCT_TYPES } from "@/lib/constants";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Breadcrumbs } from "@/components/breadcrumbs";

function findVehicleType(slug: string) {
  return NAV_VEHICLE_TYPES.find((v) => v.slug === slug.toLowerCase()) ?? null;
}

export function generateStaticParams() {
  return NAV_VEHICLE_TYPES.map((v) => ({ vehicleType: v.slug }));
}

interface VehicleTypePageProps {
  params: { vehicleType: string };
  searchParams: ProductFilterParams;
}

export async function generateMetadata({ params }: VehicleTypePageProps): Promise<Metadata> {
  const vehicleType = findVehicleType(params.vehicleType);
  if (!vehicleType) return {};

  return {
    title: vehicleType.label,
    description: `Shop exterior, interior, electronics, tires & wheels, and accessories for ${vehicleType.label.toLowerCase()}.`,
  };
}

export default async function VehicleTypePage({ params, searchParams }: VehicleTypePageProps) {
  const vehicleType = findVehicleType(params.vehicleType);
  if (!vehicleType) notFound();

  const products = await getProductsByVehicleType(vehicleType.value);

  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const filtered = filterProducts(products, searchParams);

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: vehicleType.label }]} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{vehicleType.label}</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        {PRODUCT_TYPES.map((type) => (
          <Link
            key={type.type}
            href={`/${vehicleType.slug}/${type.type}`}
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
