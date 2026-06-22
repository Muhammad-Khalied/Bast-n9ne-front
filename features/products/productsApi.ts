import api from "../../lib/api";

export const productsApi = {
  list: (params?: Record<string, any>) => api.get("/products", { params }),
  get: (slug: string) => api.get(`/products/${slug}`),
  related: (slug: string) => api.get(`/products/${slug}/related`),
  featured: () => api.get("/products/featured"),
  newArrivals: () => api.get("/products/new-arrivals"),
  bestSellers: () => api.get("/products/best-sellers"),
};
