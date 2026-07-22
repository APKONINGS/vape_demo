import { prisma } from "@/lib/prisma";

export interface ReviewDTO {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
}

export interface ProductReviewsSummary {
  reviews: ReviewDTO[];
  average: number;
  count: number;
}

export async function getProductReviews(productId: string): Promise<ProductReviewsSummary> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const count = reviews.length;
  const average = count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / count;

  return {
    average,
    count,
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      authorName: r.user.name ?? r.user.email.split("@")[0] ?? "Customer",
    })),
  };
}

export async function getUserReviewForProduct(userId: string, productId: string) {
  return prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}
