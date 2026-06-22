import { create } from 'zustand';

interface CheckoutState {
  hasAddress: boolean;
  setHasAddress: (val: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  hasAddress: false,
  setHasAddress: (val) => set({ hasAddress: val }),
}));
