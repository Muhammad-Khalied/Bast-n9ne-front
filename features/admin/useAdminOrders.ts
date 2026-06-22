import { useEffect, useState } from "react";
import { adminApi } from "./adminApi";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    adminApi.orders().then((response) => setOrders(response.data.data ?? []));
  }, []);

  return { orders };
};
