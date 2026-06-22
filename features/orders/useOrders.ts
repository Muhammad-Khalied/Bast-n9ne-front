import { useEffect, useState } from "react";
import { ordersApi } from "./ordersApi";

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    ordersApi.list().then((response) => setOrders(response.data.data ?? []));
  }, []);

  return { orders };
};
