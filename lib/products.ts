import { prisma } from "@/lib/prisma";
import { asStringArray } from "@/lib/json";
import type { VehicleType } from "@/lib/constants";

export interface ProductCategoryDTO {
  id: string;
  slug: string;
  name: string;
  vehicleType: VehicleType;
}

export interface ProductDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  active: boolean;
  category: ProductCategoryDTO | null;
}

interface RawProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string;
  sizes: string;
  colors: string;
  stock: number;
  active: boolean;
  category: { id: string; slug: string; name: string; vehicleType: string } | null;
}

export function toProductDTO(product: RawProduct): ProductDTO {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    images: asStringArray(product.images),
    sizes: asStringArray(product.sizes),
    colors: asStringArray(product.colors),
    stock: product.stock,
    active: product.active,
    category: product.category
      ? {
          id: product.category.id,
          slug: product.category.slug,
          name: product.category.name,
          vehicleType: product.category.vehicleType as VehicleType,
        }
      : null,
  };
}

const withCategory = { category: true } as const;

export async function getActiveProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: withCategory,
  });
  return products.map(toProductDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include: withCategory });
  if (!product || !product.active) return null;
  return toProductDTO(product);
}

export async function getProductsByVehicleType(vehicleType: VehicleType): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { active: true, category: { vehicleType } },
    orderBy: { createdAt: "desc" },
    include: withCategory,
  });
  return products.map(toProductDTO);
}

/** `categorySlug` is the DB slug, e.g. "sedans-exterior" — see PRODUCT_TYPES in lib/constants.ts. */
export async function getProductsByCategorySlug(vehicleType: VehicleType, categorySlug: string): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { active: true, category: { vehicleType, slug: categorySlug } },
    orderBy: { createdAt: "desc" },
    include: withCategory,
  });
  return products.map(toProductDTO);
}

export async function getProductsByCollectionSlug(slug: string): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { active: true, collections: { some: { slug } } },
    orderBy: { createdAt: "desc" },
    include: withCategory,
  });
  return products.map(toProductDTO);
}

export async function searchProducts(query: string): Promise<ProductDTO[]> {
  const q = query.trim();
  if (!q) return [];

  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ title: { contains: q } }, { description: { contains: q } }],
    },
    orderBy: { createdAt: "desc" },
    include: withCategory,
  });
  return products.map(toProductDTO);
}
