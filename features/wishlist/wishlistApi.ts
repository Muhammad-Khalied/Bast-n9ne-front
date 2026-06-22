import api from "../../lib/api";

export const wishlistApi = {
  get: () => api.get("/wishlist"),
  addItem: (productId: string) => api.post("/wishlist/items", { productId }),
  removeItem: (productId: string) => api.delete(`/wishlist/items/${productId}`),
};
