import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  variant?: "success" | "error" | "info";
}

interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOverlayOpen: boolean;
  activeModal: string | null;
  toasts: Toast[];
  toggleMobileMenu: () => void;
  toggleCartDrawer: () => void;
  toggleSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOverlayOpen: false,
  activeModal: null,
  toasts: [],
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  toggleSearchOverlay: () => set((state) => ({ isSearchOverlayOpen: !state.isSearchOverlayOpen })),
  closeSearchOverlay: () => set({ isSearchOverlayOpen: false }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  removeToast: (id) => set({ toasts: get().toasts.filter((toast) => toast.id !== id) }),
}));
