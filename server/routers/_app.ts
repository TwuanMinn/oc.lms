import { router } from "@/server/trpc";
import { courseRouter } from "./course.router";
import { lessonRouter } from "./lesson.router";
import { enrollmentRouter } from "./enrollment.router";
import { progressRouter } from "./progress.router";
import { quizRouter } from "./quiz.router";
import { bookmarkRouter } from "./bookmark.router";
import { reviewRouter } from "./review.router";
import { notificationRouter } from "./notification.router";
import { searchRouter } from "./search.router";
import { adminRouter } from "./admin.router";
import { billingRouter } from "./billing.router";
import { certificateRouter } from "./certificate.router";

export const appRouter = router({
  course: courseRouter,
  lesson: lessonRouter,
  enrollment: enrollmentRouter,
  progress: progressRouter,
  quiz: quizRouter,
  bookmark: bookmarkRouter,
  review: reviewRouter,
  notification: notificationRouter,
  search: searchRouter,
  admin: adminRouter,
  billing: billingRouter,
  certificate: certificateRouter,
});

export type AppRouter = typeof appRouter;
