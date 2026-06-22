import { useEffect, useState } from "react";
import { adminApi } from "./adminApi";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    adminApi.products().then((response) => setProducts(response.data.data ?? []));
  }, []);

  return { products };
};
