"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createReviewAction } from "@/app/(store)/product/actions";
import type { ReviewDTO } from "@/lib/reviews";

function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("h-4 w-4", n <= Math.round(value) ? "fill-amber-500 text-amber-500" : "text-muted-foreground")} />
      ))}
    </div>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} out of 5`}
          className="p-0.5"
        >
          <Star className={cn("h-6 w-6", n <= value ? "fill-amber-500 text-amber-500" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
}

interface ReviewSectionProps {
  productId: string;
  slug: string;
  reviews: ReviewDTO[];
  average: number;
  count: number;
  initialUserReview: { rating: number; comment: string } | null;
}

export function ReviewSection({ productId, slug, reviews, average, count, initialUserReview }: ReviewSectionProps) {
  const { status } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(initialUserReview?.rating ?? 5);
  const [comment, setComment] = useState(initialUserReview?.comment ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createReviewAction({ productId, rating, comment }, slug);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success ?? "Review saved.");
      router.refresh();
    });
  }

  return (
    <section className="border-t pt-8">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-bold">Reviews</h2>
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StarRating value={average} />
            <span>
              {average.toFixed(1)} · {count} review{count === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>

      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded-lg border p-4">
          <p className="text-sm font-medium">{initialUserReview ? "Update your review" : "Leave a review"}</p>
          <StarInput value={rating} onChange={setRating} />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think of this jacket?"
            rows={3}
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Saving..." : initialUserReview ? "Update review" : "Submit review"}
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">
          <a href={`/account/login?callbackUrl=/product/${slug}`} className="underline underline-offset-4">
            Sign in
          </a>{" "}
          to leave a review.
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review, index) => (
            <div key={review.id}>
              {index > 0 && <Separator className="mb-5" />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{review.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating value={review.rating} className="my-1" />
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
