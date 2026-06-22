import api from "../../lib/api";

export const adminApi = {
  products: () => api.get("/admin/products"),
  orders: () => api.get("/admin/orders"),
  analytics: () => api.get("/analytics/overview"),
  users: () => api.get("/admin/users"),
};
