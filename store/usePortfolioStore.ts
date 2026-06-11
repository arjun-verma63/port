import { create } from 'zustand';

interface PortfolioState {
  isUnlocked: boolean;
  activeProject: string | null;
  isModalOpen: boolean;
  setUnlocked: (unlocked: boolean) => void;
  setActiveProject: (projectId: string | null) => void;
  setModalOpen: (open: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  isUnlocked: false,
  activeProject: null,
  isModalOpen: false,
  setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),
  setActiveProject: (projectId) => set({ activeProject: projectId }),
  setModalOpen: (open) => set({ isModalOpen: open }),
}));
