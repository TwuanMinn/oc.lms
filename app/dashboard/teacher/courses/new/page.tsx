"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema, type CreateCourseInput } from "@/lib/validations/course";
import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2, Sparkles, Eye, Image as ImageIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AnimatedPage, AnimatedShimmerButton } from "@/components/ui/animated";
import Image from "next/image";
import { motion } from "motion/react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function NewCoursePage() {
  const router = useRouter();
  const { user } = useAuth(); // To display instructor's name on preview

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
  });

  const previewTitle = watch("title");
  const previewDesc = watch("description");

  const previewThumbnail = watch("thumbnail");

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <AnimatedPage>
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider mb-4 uppercase drop-shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Curated Experience
                </div>
                <h1 className="font-extrabold text-4xl md:text-5xl tracking-tight text-foreground mb-4">
                  Create new course
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                  Fill in the basics. You can edit and add lessons later. Your curriculum should feel like a guided journey.
                </p>
              </header>

              {/* Course Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Side */}
                <div className="lg:col-span-8 space-y-8 relative">
                  <div className="bg-card rounded-4xl p-8 shadow-xl relative overflow-hidden border border-border/40">
                    {/* Subtle Ghost Border */}
                    <div className="absolute inset-0 border border-primary/5 rounded-4xl pointer-events-none" />
                    
                    <form id="create-course-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                          Title
                        </label>
                        <input
                          type="text"
                          {...register("title")}
                          className="w-full bg-secondary/20 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all placeholder:text-muted-foreground/50 shadow-sm"
                          placeholder="e.g., Complete TypeScript Course"
                        />
                        {errors.title && (
                          <p className="mt-1 text-xs text-destructive animate-pulse">{errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                          Description
                        </label>
                        <textarea
                          {...register("description")}
                          className="w-full bg-secondary/20 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all placeholder:text-muted-foreground/50 resize-none shadow-sm"
                          placeholder="What will students learn?"
                          rows={5}
                        />
                        {errors.description && (
                          <p className="mt-1 text-xs text-destructive animate-pulse">{errors.description.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                            Category
                          </label>
                          <select 
                            className="w-full bg-secondary/20 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all shadow-sm appearance-none cursor-pointer"
                          >
                            <option>Development</option>
                            <option>Design</option>
                            <option>Business</option>
                            <option>Marketing</option>
                          </select>
                          <p className="text-[10px] text-muted-foreground mt-1">Categories feature coming soon.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                          Thumbnail URL
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            {...register("thumbnail")}
                            className="flex-1 bg-secondary/20 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all placeholder:text-muted-foreground/50 shadow-sm"
                            placeholder="https://images.unsplash.com/..."
                          />
                          <button
                            type="button"
                            className="bg-secondary/40 text-foreground px-6 rounded-xl font-bold hover:bg-secondary/60 transition-colors shadow-sm"
                            onClick={() => toast.info("Media gallery coming soon.")}
                          >
                            Browse
                          </button>
                        </div>
                        {errors.thumbnail && (
                          <p className="mt-1 text-xs text-destructive animate-pulse">{errors.thumbnail.message}</p>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <button 
                      type="button" 
                      onClick={() => router.push("/dashboard/teacher/courses")}
                      className="text-muted-foreground font-bold hover:text-foreground transition-colors px-6 py-3"
                    >
                      Cancel
                    </button>
                    
                    <AnimatedShimmerButton className="rounded-full bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                      <button
                        type="submit"
                        form="create-course-form"
                        disabled={createCourse.isPending}
                        className="flex items-center justify-center gap-3 px-10 py-4 font-extrabold text-lg text-primary-foreground disabled:opacity-70"
                      >
                        {createCourse.isPending ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <>
                            Create course
                            <ArrowRight className="h-6 w-6" />
                          </>
                        )}
                      </button>
                    </AnimatedShimmerButton>
                  </div>
                </div>

                {/* Preview Side (Editorial Touch) */}
                <div className="hidden lg:col-span-4 lg:block sticky top-32">
                  <div className="bg-card/50 backdrop-blur-md rounded-4xl p-6 border border-border/40 shadow-2xl">
                    <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                      <Eye className="text-primary h-5 w-5" />
                      Live Preview
                    </h4>
                    
                    <motion.div 
                      key={previewTitle || previewThumbnail}
                      initial={{ scale: 0.98, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="h-48 bg-secondary/30 relative flex items-center justify-center overflow-hidden">
                        {previewThumbnail ? (
                          <Image
                            src={previewThumbnail}
                            alt="Course thumbnail preview"
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          Draft
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex gap-2 mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                            Development
                          </span>
                        </div>
                        
                        <h5 className="font-extrabold text-foreground text-xl mb-3 leading-tight line-clamp-2">
                          {previewTitle || "Course Title Appears Here"}
                        </h5>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                          {previewDesc || "Your description will be displayed here to entice students to join your learning atelier."}
                        </p>
                        
                        <div className="flex items-center justify-between border-t border-border/50 pt-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold overflow-hidden relative">
                               {user?.image ? (
                                  <Image src={user.image} alt="User Avatar" fill className="object-cover" />
                               ) : (
                                  user?.name?.charAt(0).toUpperCase() || "I"
                               )}
                            </div>
                            <span className="text-xs text-muted-foreground font-semibold">
                              {user?.name || "Instructor"}
                            </span>
                          </div>
                          <span className="text-base font-black text-foreground">
                            Free
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="mt-8">
                      <div className="bg-primary/5 p-5 rounded-3xl border-l-4 border-primary">
                        <h6 className="text-[11px] font-extrabold text-primary uppercase mb-2 tracking-wider flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3" />
                          Pro Tip
                        </h6>
                        <p className="text-xs text-primary/80 leading-relaxed font-medium">
                          Courses with high-quality thumbnails and clear summaries get 40% more student engagement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
