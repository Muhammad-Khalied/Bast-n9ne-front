"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { AdminTopbar } from "../../components/layout/AdminTopbar";
import { ProtectedRoute } from "../../components/shared/ProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-brand-white flex">
        <div className="print:hidden">
          <AdminSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="print:hidden">
            <AdminTopbar />
          </div>
          <main className="flex-1 overflow-y-auto bg-brand-ivory/50 print:bg-white print:overflow-visible">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
