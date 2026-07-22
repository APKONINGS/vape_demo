import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { getProductReviews, getUserReviewForProduct } from "@/lib/reviews";
import { getSimilarProducts, getPopularProducts } from "@/lib/recommendations";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { ReviewSection } from "@/components/review-section";
import { CollectionCarousel } from "@/components/collection-carousel";
import { RecentlyViewedSection } from "@/components/recently-viewed-section";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.title,
    description:
      product.description ||
      `${product.title} — ${formatPrice(product.price)}. Shop auto parts & accessories at 4F Store.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const session = await auth();
  const { reviews, average, count } = await getProductReviews(product.id);

  const [isWishlisted, userReview, similarProducts, popularProducts] = await Promise.all([
    session?.user?.id
      ? prisma.wishlistItem
          .findUnique({ where: { userId_productId: { userId: session.user.id, productId: product.id } } })
          .then((w) => !!w)
      : Promise.resolve(false),
    session?.user?.id ? getUserReviewForProduct(session.user.id, product.id) : Promise.resolve(null),
    getSimilarProducts(product),
    getPopularProducts(8, product.id),
  ]);

  return (
    <div>
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {product.category.name}
                </p>
              )}
              <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
              {product.salePrice ? (
                <p className="mt-2 flex items-center gap-3 text-xl">
                  <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  <span className="font-semibold text-destructive">{formatPrice(product.salePrice)}</span>
                </p>
              ) : (
                <p className="mt-2 text-xl">{formatPrice(product.price)}</p>
              )}
              {product.description && (
                <p className="mt-4 rounded-md bg-secondary/50 p-3 text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <AddToCartButton product={product} />
              </div>
              <WishlistButton productId={product.id} slug={product.slug} initialWishlisted={isWishlisted} />
            </div>

            <div className="space-y-2 border-t pt-6 text-sm text-muted-foreground">
              <p>Flat-rate shipping, calculated at checkout.</p>
              <p>30-day hassle-free returns on uninstalled parts.</p>
              <p>{product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ReviewSection
            productId={product.id}
            slug={product.slug}
            reviews={reviews}
            average={average}
            count={count}
            initialUserReview={userReview ? { rating: userReview.rating, comment: userReview.comment } : null}
          />
        </div>
      </div>

      <CollectionCarousel title="Similar Products" products={similarProducts} className="container py-12" />
      <CollectionCarousel title="Popular Choices" products={popularProducts} className="container py-12" />
      <div className="container">
        <RecentlyViewedSection currentSlug={product.slug} />
      </div>
    </div>
  );
}
