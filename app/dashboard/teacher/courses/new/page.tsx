"use client";


import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema, type CreateCourseInput } from "@/lib/validations/course";
import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewCoursePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
  });

  const createCourse = trpc.course.create.useMutation({
    onSuccess: (data) => {
      toast.success("Course created!");
      router.push(`/dashboard/teacher/courses/${data.id}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data: CreateCourseInput) {
    createCourse.mutate(data);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight">Create new course</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the basics. You can edit and add lessons later.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  placeholder="e.g., Complete TypeScript Course"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  placeholder="What will students learn?"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="text-sm font-medium">
                  Price (USD) — leave empty for free
                </label>
                <input
                  id="price"
                  type="text"
                  {...register("price")}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="thumbnail" className="text-sm font-medium">
                  Thumbnail URL
                </label>
                <input
                  id="thumbnail"
                  type="text"
                  {...register("thumbnail")}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                disabled={createCourse.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {createCourse.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Create course
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
