"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Array<{
    id: string;
    title: string;
    duration: number;
    position: number;
  }>;
}

interface LessonSidebarProps {
  courseSlug: string;
  modules: Module[];
  currentLessonId: string;
  completedLessonIds: string[];
}

export function LessonSidebar({
  courseSlug,
  modules,
  currentLessonId,
  completedLessonIds,
}: LessonSidebarProps) {
  const completedSet = new Set(completedLessonIds);

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-r border-border/40 bg-card">
      <div className="p-4">
        {modules.map((mod) => (
          <div key={mod.id} className="mb-4">
            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mod.title}
            </h4>
            <div className="space-y-0.5">
              {mod.lessons.map((lesson) => {
                const isCurrent = lesson.id === currentLessonId;
                const isComplete = completedSet.has(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${courseSlug}/${lesson.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-all",
                      isCurrent
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    ) : isCurrent ? (
                      <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0" />
                    )}
                    <span className="line-clamp-1">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
