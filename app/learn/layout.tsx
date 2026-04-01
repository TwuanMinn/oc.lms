import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Player",
  description: "Watch lessons, complete quizzes, and track your learning progress.",
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
