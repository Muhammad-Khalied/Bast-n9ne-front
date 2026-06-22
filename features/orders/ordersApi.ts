import api from "../../lib/api";

export const ordersApi = {
  list: () => api.get("/orders"),
  get: (id: string) => api.get(`/orders/${id}`),
  create: (data: { addressId: string; notes?: string }) => api.post("/orders", data),
};
