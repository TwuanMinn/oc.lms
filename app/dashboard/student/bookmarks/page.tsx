"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Bookmark, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedPage, AnimatedShimmerButton } from "@/components/ui/animated";

export default function StudentBookmarksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6">
          <AnimatedPage>
            <PageHeader
              title="Bookmarks"
              description="Save your favorite lessons and courses for later"
            />

            <div className="mt-8">
              <EmptyState
                icon={Bookmark}
                title="Bookmarking coming soon!"
                description="We are actively building the ability for you to bookmark specific lessons and resources. Stay tuned!"
                action={
                  <AnimatedShimmerButton className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                    <Link
                      href="/dashboard/student"
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Sparkles className="h-4 w-4" />
                      Return Home
                    </Link>
                  </AnimatedShimmerButton>
                }
              />
            </div>
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
