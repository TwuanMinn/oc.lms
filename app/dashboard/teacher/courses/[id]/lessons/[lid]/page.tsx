"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function LessonEditorPage() {
  const params = useParams<{ id: string; lid: string }>();
  const router = useRouter();

  const { data: lesson, isLoading } = trpc.lesson.byId.useQuery(
    { id: params.lid },
    { retry: false }
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState(0);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setDescription(lesson.description ?? "");
      setVideoUrl(lesson.videoUrl ?? "");
      setContent(lesson.content ?? "");
      setDuration(lesson.duration);
      setIsFree(lesson.isFree);
    }
  }, [lesson]);

  const updateLesson = trpc.lesson.update.useMutation({
    onSuccess: () => toast.success("Lesson saved!"),
    onError: (err) => toast.error(err.message),
  });

  function handleSave() {
    updateLesson.mutate({
      id: params.lid,
      title: title || undefined,
      description: description || undefined,
      videoUrl: videoUrl || undefined,
      content: content || undefined,
      duration,
      isFree,
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar role="TEACHER" />
          <main className="flex flex-1 items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <button
              onClick={() => router.push(`/dashboard/teacher/courses/${params.id}`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to course
            </button>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit lesson</h1>

            <div>
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
            </div>

            <div>
              <label htmlFor="videoUrl" className="text-sm font-medium">Video URL</label>
              <input
                id="videoUrl"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                YouTube or Google Drive URLs are supported
              </p>
            </div>

            <div>
              <label htmlFor="content" className="text-sm font-medium">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none ring-ring focus:ring-2"
                placeholder="# Lesson content in Markdown..."
              />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={0}
                  className="mt-1.5 w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">Free preview</span>
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={updateLesson.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {updateLesson.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save lesson
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
