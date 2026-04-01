import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalog",
  description:
    "Browse expert-led courses in web development, design, data science and more. Filter by category, sort by popularity, and start learning today.",
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
