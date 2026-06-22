import { useEffect, useState } from "react";
import { adminApi } from "./adminApi";

export const useAdminAnalytics = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    adminApi.analytics().then((response) => setStats(response.data.data));
  }, []);

  return { stats };
};
