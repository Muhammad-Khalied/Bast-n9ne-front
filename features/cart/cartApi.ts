import api from "../../lib/api";

export const cartApi = {
  get: () => api.get("/cart"),
  addItem: (data: { productId: string; variantId: string; quantity: number }) => api.post("/cart/items", data),
  updateItem: (id: string, quantity: number) => api.patch(`/cart/items/${id}`, { quantity }),
  removeItem: (id: string) => api.delete(`/cart/items/${id}`),
  clear: () => api.delete("/cart"),
};
