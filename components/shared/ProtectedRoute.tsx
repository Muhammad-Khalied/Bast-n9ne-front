"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute({ children, requiredRole }: { children: ReactNode; requiredRole?: "ADMIN" | "CUSTOMER" }) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      router.push("/");
    }
  }, [isAuthenticated, requiredRole, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-sage"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
