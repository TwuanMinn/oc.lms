"use client";

import { Bookmark, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
  lessonId: string;
}

export function BookmarkButton({ lessonId }: BookmarkButtonProps) {
  const utils = trpc.useUtils();

  const { data } = trpc.bookmark.isBookmarked.useQuery({ lessonId });

  const toggle = trpc.bookmark.toggle.useMutation({
    onMutate: async () => {
      await utils.bookmark.isBookmarked.cancel({ lessonId });
      const prevData = utils.bookmark.isBookmarked.getData({ lessonId });

      utils.bookmark.isBookmarked.setData({ lessonId }, (old) => ({
        bookmarked: !old?.bookmarked,
      }));

      return { prevData };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        utils.bookmark.isBookmarked.setData({ lessonId }, context.prevData);
      }
      toast.error("Failed to update bookmark");
    },
    onSuccess: (result) => {
      utils.bookmark.getAll.invalidate();
      toast.success(result.bookmarked ? "Bookmarked!" : "Bookmark removed");
    },
  });

  return (
    <button
      onClick={() => toggle.mutate({ lessonId })}
      disabled={toggle.isPending}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all",
        data?.bookmarked
          ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
          : "text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {toggle.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark
          className={cn("h-4 w-4", data?.bookmarked && "fill-current")}
        />
      )}
      {data?.bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
