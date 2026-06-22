import { create } from "zustand";
import api from "../lib/api";
import { getAccessToken } from "../lib/authTokens";

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    discountPrice?: number;
    media?: { url: string }[];
  };
  variant: {
    id: string;
    size: string;
    color: string;
  };
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, qty: number) => Promise<void>;
  updateQuantity: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const computeTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, itemCount };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
  fetchCart: async () => {
    // Don't fetch if user is not authenticated
    const token = getAccessToken();
    if (!token) {
      set({ items: [], subtotal: 0, itemCount: 0, isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const response = await api.get("/cart");
      const items = response.data.data?.items ?? [];
      const { subtotal, itemCount } = computeTotals(items);
      set({ items, subtotal, itemCount, isLoading: false });
    } catch {
      set({ items: [], subtotal: 0, itemCount: 0, isLoading: false });
    }
  },
  addItem: async (productId, variantId, qty) => {
    const currentCount = get().itemCount;
    set({ itemCount: currentCount + qty });
    try {
      await api.post("/cart/items", { productId, variantId, quantity: qty });
      await get().fetchCart();
    } catch (error) {
      set({ itemCount: currentCount });
      throw error;
    }
  },
  updateQuantity: async (itemId, qty) => {
    // Exact diff requires finding the item, but we'll let it be near-instant 
    // fetchCart will true it up anyway. 
    await api.patch(`/cart/items/${itemId}`, { quantity: qty });
    await get().fetchCart();
  },
  removeItem: async (itemId) => {
    const currentItems = get().items;
    const itemToRemove = currentItems.find(i => i.id === itemId);
    if (itemToRemove) {
      const currentCount = get().itemCount;
      set({ 
        itemCount: Math.max(0, currentCount - itemToRemove.quantity),
        items: currentItems.filter(i => i.id !== itemId)
      });
    }
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
    } catch (error) {
      await get().fetchCart(); // revert
      throw error;
    }
  },
  clearCart: async () => {
    try {
      await api.delete("/cart");
    } catch {
      // ignore if cart doesn't exist
    }
    set({ items: [], itemCount: 0, subtotal: 0 });
  },
}));
