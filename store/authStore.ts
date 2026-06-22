import { create } from "zustand";
import api from "../lib/api";
import { setAccessToken } from "../lib/authTokens";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // Start as true for initial check
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data.data;
      setAccessToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
      if (typeof window !== "undefined") {
        localStorage.setItem("login", Date.now().toString());
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/register", data);
      const { user, accessToken } = response.data.data;
      setAccessToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
      if (typeof window !== "undefined") {
        localStorage.setItem("login", Date.now().toString());
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      if (typeof window !== "undefined") {
        localStorage.setItem("logout", Date.now().toString());
        window.location.href = "/";
      }
    }
  },
  refreshToken: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post("/auth/refresh");
      const { accessToken, user } = response.data.data;
      setAccessToken(accessToken);
      set({
        accessToken,
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch {
      setAccessToken(null);
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
}));

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "logout") {
      setAccessToken(null);
      useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      window.location.href = "/";
    }
    if (event.key === "login") {
      window.location.reload();
    }
  });
}
