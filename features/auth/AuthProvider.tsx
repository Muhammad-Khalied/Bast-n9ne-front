"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const refreshToken = useAuthStore((state) => state.refreshToken);

  useEffect(() => {
    refreshToken().catch(() => undefined);
  }, [refreshToken]);

  return <>{children}</>;
}
