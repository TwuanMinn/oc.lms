# PLAN: Green Academy LMS — Full Improvements

## Overview
Implement all 12 brainstormed improvements in priority order, batched into rounds.

---

## Round 1 — Visual Impact (This Session)
> Goal: Make the platform look populated and premium

### Task 1.1: Course Thumbnails
- Generate 5 category-themed thumbnails (1 per genre)
- Update seed script to assign thumbnails
- **Files:** `scripts/seed-courses.ts`, `public/images/courses/`
- **Agent:** frontend-specialist

### Task 1.2: Social Proof — Seed Enrollments + Reviews
- Seed 50+ enrollments across courses (spread across student accounts)
- Seed 20+ reviews with realistic ratings (4-5 stars)
- **Files:** `scripts/seed-courses.ts`
- **Agent:** backend-specialist

### Task 1.3: Dark Mode Audit
- Test all pages in dark mode, fix contrast issues
- Ensure cards, borders, and glows render correctly
- **Files:** `app/globals.css`, component files
- **Agent:** frontend-specialist

---

## Round 2 — Core Features (This Session)
> Goal: Complete the student learning loop

### Task 2.1: Visual Certificate Page
- Build `/certificates/[id]` page with branded certificate card
- Student name, course title, date, certificate number
- Print/download support via CSS `@media print`
- **Files:** `app/certificates/[id]/page.tsx`
- **Agent:** frontend-specialist

### Task 2.2: Quiz Student UI
- Build quiz component inside lesson player
- Multiple choice questions with instant feedback
- Score tracking and pass/fail state
- **Files:** `components/learn/QuizPlayer.tsx`, update lesson page
- **Agent:** frontend-specialist + backend-specialist

### Task 2.3: Student Profile/Settings
- Build `/dashboard/student/settings` page
- Name editing, password change, notification prefs
- **Files:** `app/dashboard/student/settings/page.tsx`
- **Agent:** frontend-specialist

---

## Round 3 — Teacher & Admin (Next Session)
> Goal: Enable platform growth

### Task 3.1: Teacher Course Builder Enhancement
- Multi-step form: Details → Modules → Lessons → Pricing → Publish
- Drag-and-drop lesson reordering
- **Agent:** frontend-specialist + backend-specialist

### Task 3.2: Image Upload System
- Integrate UploadThing for thumbnails and avatars
- **Agent:** backend-specialist

### Task 3.3: Email Notifications (Resend)
- Enrollment confirmation, completion, certificate emails
- **Agent:** backend-specialist

---

## Round 4 — Engagement & Quality (Future)

### Task 4.1: Discussion Forums
### Task 4.2: Gamification (XP, Badges, Leaderboard)
### Task 4.3: E2E Testing (Playwright Critical Path)

---

## Agent Assignments

| Agent | Tasks |
|-------|-------|
| `project-planner` | This plan |
| `frontend-specialist` | Thumbnails, Dark Mode, Certificate, Quiz UI, Profile |
| `backend-specialist` | Seed data, Quiz logic, Email integration |
| `security-auditor` | Auth cookie audit, input validation review |

## Verification
- TypeScript: `npx tsc --noEmit`
- Dev server: `npm run dev` + visual browser check
- All pages render without errors
