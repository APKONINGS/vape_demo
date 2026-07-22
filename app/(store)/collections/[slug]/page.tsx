import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getProductsByCollectionSlug } from "@/lib/products";
import { filterProducts, type ProductFilterParams } from "@/lib/filter-products";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Breadcrumbs } from "@/components/breadcrumbs";

export async function generateStaticParams() {
  const collections = await prisma.collection.findMany({ select: { slug: true } });
  return collections.map((c) => ({ slug: c.slug }));
}

interface CollectionPageProps {
  params: { slug: string };
  searchParams: ProductFilterParams;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await prisma.collection.findUnique({ where: { slug: params.slug } });
  if (!collection) return {};

  return {
    title: collection.title,
    description: `Shop the ${collection.title} collection at 4F Store.`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const collection = await prisma.collection.findUnique({ where: { slug: params.slug } });
  if (!collection) notFound();

  const products = await getProductsByCollectionSlug(params.slug);
  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap((p) => p.colors)));
  const filtered = filterProducts(products, searchParams);

  return (
    <div>
      {collection.bannerUrl && (
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <Image src={collection.bannerUrl} alt={collection.title} fill className="object-cover" priority />
          <div className="absolute inset-0 flex items-center bg-black/30">
            <h1 className="container text-3xl font-bold text-white sm:text-4xl">{collection.title}</h1>
          </div>
        </div>
      )}

      <div className="container py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: collection.title }]} />
        {!collection.bannerUrl && (
          <h1 className="mb-8 text-3xl font-bold tracking-tight">{collection.title}</h1>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">
            <ProductFilters sizes={allSizes} colors={allColors} />
          </aside>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
