import { create } from "zustand";

type SortOption = "price_asc" | "price_desc" | "newest" | "popular" | "name_asc";

interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort: SortOption;
  search?: string;
}

interface FilterState {
  filters: Filters;
  category: string | null;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sort: SortOption;
  search: string;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  getQueryParams: () => URLSearchParams;
}

const defaultFilters: Filters = {
  sort: "newest",
};

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: { ...defaultFilters },
  category: null,
  priceRange: [0, 1000],
  sizes: [],
  colors: [],
  sort: "newest",
  search: "",
  setFilter: (key, value) => {
    set((state) => ({
      [key]: value,
      filters: { ...state.filters, [key]: value },
    }));
  },
  clearFilters: () =>
    set({
      category: null,
      priceRange: [0, 1000],
      sizes: [],
      colors: [],
      sort: "newest",
      search: "",
      filters: { ...defaultFilters },
    }),
  hasActiveFilters: () => {
    const state = get();
    return !!(
      state.category ||
      state.sizes.length > 0 ||
      state.colors.length > 0 ||
      state.search ||
      state.priceRange[0] > 0 ||
      state.priceRange[1] < 1000
    );
  },
  getQueryParams: () => {
    const params = new URLSearchParams();
    const state = get();
    if (state.category) params.set("category", state.category);
    if (state.priceRange[0] > 0) params.set("minPrice", String(state.priceRange[0]));
    if (state.priceRange[1] < 1000) params.set("maxPrice", String(state.priceRange[1]));
    if (state.sizes.length) params.set("sizes", state.sizes.join(","));
    if (state.colors.length) params.set("colors", state.colors.join(","));
    if (state.search) params.set("search", state.search);
    params.set("sort", state.sort);
    return params;
  },
}));
