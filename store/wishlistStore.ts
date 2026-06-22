import { create } from "zustand";
import api from "../lib/api";
import { getAccessToken } from "../lib/authTokens";

export interface WishlistItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    discountPrice?: number;
    media?: { url: string }[];
  };
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  fetchWishlist: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ items: [], isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.get("/wishlist");
      const items = response.data.data?.items ?? [];
      set({ items, isLoading: false });
    } catch {
      set({ items: [], isLoading: false });
    }
  },
  addItem: async (productId) => {
    if (!getAccessToken()) {
      throw new Error("Authentication required");
    }
    const currentItems = get().items;
    if (!currentItems.some((item) => item.product.id === productId)) {
      set({ items: [...currentItems, { id: "temp-" + Date.now(), product: { id: productId, title: "", price: 0 } } as any] });
    }
    try {
      await api.post("/wishlist/items", { productId });
      await get().fetchWishlist();
    } catch (error) {
      set({ items: currentItems });
      throw error;
    }
  },
  removeItem: async (productId) => {
    if (!getAccessToken()) {
      throw new Error("Authentication required");
    }
    const currentItems = get().items;
    set({ items: currentItems.filter((item) => item.product.id !== productId) });
    try {
      await api.delete(`/wishlist/items/${productId}`);
      await get().fetchWishlist();
    } catch (error) {
      set({ items: currentItems });
      throw error;
    }
  },
  isInWishlist: (productId) => get().items.some((item) => item.product.id === productId),
}));
