import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { getActiveProducts } from "@/lib/products";
import { NAV_VEHICLE_TYPES, PRODUCT_TYPES } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PAGES = ["/shipping", "/returns", "/fitment-guide", "/contact"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getActiveProducts(),
    prisma.collection.findMany({ select: { slug: true } }),
  ]);

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const vehicleTypeUrls: MetadataRoute.Sitemap = NAV_VEHICLE_TYPES.map((vehicleType) => ({
    url: `${siteUrl}/${vehicleType.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const vehicleCategoryUrls: MetadataRoute.Sitemap = NAV_VEHICLE_TYPES.flatMap((vehicleType) =>
    PRODUCT_TYPES.map((type) => ({
      url: `${siteUrl}/${vehicleType.slug}/${type.type}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }))
  );

  const collectionUrls: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${siteUrl}/collections/${collection.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...vehicleTypeUrls,
    ...vehicleCategoryUrls,
    ...collectionUrls,
    ...productUrls,
    ...staticUrls,
  ];
}
