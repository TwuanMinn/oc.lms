import { create } from "zustand";

interface LayoutStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

interface QuizStore {
  activeQuizId: string | null;
  setActiveQuizId: (id: string | null) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  activeQuizId: null,
  setActiveQuizId: (id) => set({ activeQuizId: id }),
}));

interface ModalStore {
  courseCompleteOpen: boolean;
  setCourseCompleteOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  courseCompleteOpen: false,
  setCourseCompleteOpen: (open) => set({ courseCompleteOpen: open }),
}));
