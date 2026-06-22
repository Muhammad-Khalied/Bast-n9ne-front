import { create } from "zustand";
import api from "../lib/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  isFetched: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  isFetched: false,
  fetchCategories: async () => {
    if (get().isFetched) return;
    set({ isLoading: true });
    try {
      // Assuming public endpoint /categories returns all active categories
      const response = await api.get("/categories");
      const data = response.data.data;
      set({ categories: data || [], isFetched: true });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
