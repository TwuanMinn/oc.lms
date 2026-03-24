"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tab = "settings" | "curriculum" | "students";

export default function CourseEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("settings");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/teacher/courses")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to courses
            </button>
          </div>

          <div className="mb-6 flex items-center gap-1 border-b border-border">
            {(["settings", "curriculum", "students"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "settings" && <SettingsTab courseId={params.id} />}
          {activeTab === "curriculum" && <CurriculumTab courseId={params.id} />}
          {activeTab === "students" && <StudentsTab />}
        </main>
      </div>
    </div>
  );
}

function SettingsTab({ courseId }: { courseId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState("0");

  const utils = trpc.useUtils();

  const updateCourse = trpc.course.update.useMutation({
    onSuccess: () => {
      toast.success("Course updated");
      utils.course.myCoursesAsTeacher.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const publishCourse = trpc.course.publish.useMutation({
    onSuccess: () => {
      toast.success("Course published!");
      utils.course.myCoursesAsTeacher.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          placeholder="Course title" />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
      </div>
      <div>
        <label className="text-sm font-medium">Thumbnail URL</label>
        <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
      </div>
      <div>
        <label className="text-sm font-medium">Price (USD)</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateCourse.mutate({ id: courseId, title: title || undefined, description: description || undefined, thumbnail: thumbnail || undefined, price: price || undefined })}
          disabled={updateCourse.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {updateCourse.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </button>
        <button
          onClick={() => publishCourse.mutate({ id: courseId })}
          disabled={publishCourse.isPending}
          className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-500 hover:bg-green-500/20 disabled:opacity-50">
          {publishCourse.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Publish
        </button>
      </div>
    </div>
  );
}

function CurriculumTab({ courseId }: { courseId: string }) {
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const createModule = trpc.lesson.createModule.useMutation({
    onSuccess: () => { setNewModuleTitle(""); toast.success("Module added"); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <input type="text" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)}
          placeholder="New module title..."
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          onKeyDown={(e) => { if (e.key === "Enter" && newModuleTitle.trim()) createModule.mutate({ courseId, title: newModuleTitle.trim(), position: 0 }); }} />
        <button
          onClick={() => { if (newModuleTitle.trim()) createModule.mutate({ courseId, title: newModuleTitle.trim(), position: 0 }); }}
          disabled={!newModuleTitle.trim() || createModule.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          <Plus className="h-4 w-4" />
          Add Module
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Modules and lessons are managed here. Add modules first, then add lessons to each module.
      </p>
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Course modules will appear here once the course data is loaded from the database.
      </div>
    </div>
  );
}

function StudentsTab() {
  return (
    <div className="max-w-4xl">
      <p className="text-sm text-muted-foreground">
        Students enrolled in this course will appear here with their progress.
      </p>
      <div className="mt-4 rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Student enrollment data loads from the database once the course exists.
      </div>
    </div>
  );
}
