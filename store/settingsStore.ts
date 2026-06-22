import { create } from "zustand";
import api from "../lib/api";

interface SettingsState {
  settings: Record<string, any>;
  isLoading: boolean;
  hasLoaded: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
  isLoading: false,
  hasLoaded: false,
  fetchSettings: async () => {
    if (get().hasLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const res = await api.get("/settings");
      const settingsMap: Record<string, any> = {};
      res.data.data.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });
      set({ settings: settingsMap, hasLoaded: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
