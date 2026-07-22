import { prisma } from "@/lib/prisma";
import { toProductDTO, type ProductDTO } from "@/lib/products";
import { asCartItems } from "@/lib/json";

const withCategory = { category: true } as const;

/** Other active products in the same category, excluding the one being viewed. */
export async function getSimilarProducts(product: ProductDTO, limit = 8): Promise<ProductDTO[]> {
  if (!product.category) return [];

  const products = await prisma.product.findMany({
    where: {
      active: true,
      id: { not: product.id },
      category: { slug: product.category.slug },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: withCategory,
  });

  return products.map(toProductDTO);
}

/**
 * Ranked by real quantity sold across all orders. A fresh store has no order history yet,
 * so the ranking is padded with other active products (excluding the current one and
 * anything already ranked) rather than showing an empty section.
 */
export async function getPopularProducts(limit = 8, excludeProductId?: string): Promise<ProductDTO[]> {
  const orders = await prisma.order.findMany({ select: { items: true } });

  const quantityByProductId = new Map<string, number>();
  for (const order of orders) {
    for (const item of asCartItems(order.items)) {
      quantityByProductId.set(item.productId, (quantityByProductId.get(item.productId) ?? 0) + item.quantity);
    }
  }

  const rankedIds = [...quantityByProductId.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([productId]) => productId)
    .filter((id) => id !== excludeProductId);

  const rankedProducts = rankedIds.length
    ? await prisma.product.findMany({
        where: { id: { in: rankedIds }, active: true },
        include: withCategory,
      })
    : [];

  const rankedById = new Map(rankedProducts.map((p) => [p.id, p]));
  const ordered = rankedIds.map((id) => rankedById.get(id)).filter((p): p is NonNullable<typeof p> => !!p);

  if (ordered.length >= limit) {
    return ordered.slice(0, limit).map(toProductDTO);
  }

  const fillerNeeded = limit - ordered.length;
  const excludeIds = [...ordered.map((p) => p.id), ...(excludeProductId ? [excludeProductId] : [])];

  const filler = await prisma.product.findMany({
    where: { active: true, id: { notIn: excludeIds } },
    orderBy: { createdAt: "desc" },
    take: fillerNeeded,
    include: withCategory,
  });

  return [...ordered, ...filler].map(toProductDTO);
}

export async function getProductsBySlugs(slugs: string[]): Promise<ProductDTO[]> {
  if (slugs.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, active: true },
    include: withCategory,
  });

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map(toProductDTO);
}
