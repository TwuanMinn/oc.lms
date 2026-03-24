"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CompleteButtonProps {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
  onComplete?: () => void;
}

export function CompleteButton({
  courseId,
  lessonId,
  isCompleted,
  onComplete,
}: CompleteButtonProps) {
  const utils = trpc.useUtils();

  const markComplete = trpc.progress.markComplete.useMutation({
    onMutate: async () => {
      await utils.progress.getCompletedLessons.cancel({ courseId });
      const prevData = utils.progress.getCompletedLessons.getData({ courseId });

      utils.progress.getCompletedLessons.setData({ courseId }, (old) => {
        if (!old) return [lessonId];
        return [...old, lessonId];
      });

      return { prevData };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        utils.progress.getCompletedLessons.setData(
          { courseId },
          context.prevData
        );
      }
      toast.error("Failed to mark lesson as complete");
    },
    onSuccess: () => {
      utils.progress.getCourseProgress.invalidate({ courseId });
      utils.progress.getCompletedLessons.invalidate({ courseId });
      toast.success("Lesson completed!");
      onComplete?.();
    },
  });

  if (isCompleted) {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-500"
      >
        <CheckCircle className="h-4 w-4" />
        Completed
      </button>
    );
  }

  return (
    <button
      onClick={() => markComplete.mutate({ courseId, lessonId })}
      disabled={markComplete.isPending}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      )}
    >
      {markComplete.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      Mark Complete
    </button>
  );
}
