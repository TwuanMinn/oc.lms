"use client";

import { trpc } from "@/lib/trpc/client";
import { RatingStars } from "./RatingStars";
import { formatDate, getInitials } from "@/lib/utils";

interface ReviewSectionProps {
  courseId: string;
}

export function ReviewSection({ courseId }: ReviewSectionProps) {
  const { data: reviews } = trpc.review.getByCourse.useQuery({
    courseId,
    limit: 10,
    offset: 0,
  });

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-lg border border-border/50 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              {review.userAvatar ? (
                <img
                  src={review.userAvatar}
                  alt={review.userName ?? ""}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(review.userName ?? "User")
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {review.userName}
                </span>
                <RatingStars rating={review.rating} size="sm" showValue={false} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </p>
              {review.body && (
                <p className="mt-2 text-sm text-foreground/80">
                  {review.body}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
