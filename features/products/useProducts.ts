import { useEffect, useState } from "react";
import { productsApi } from "./productsApi";

export const useProducts = (params?: Record<string, any>) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    productsApi
      .list(params)
      .then((response) => {
        if (active) setData(response.data.data);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [JSON.stringify(params)]);

  return { data, loading };
};
