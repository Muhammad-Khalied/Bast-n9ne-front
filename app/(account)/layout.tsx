"use client";

import { ReactNode } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { AccountSidebar } from "../../components/layout/AccountSidebar";
import { ProtectedRoute } from "../../components/shared/ProtectedRoute";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brand-ivory">
        <Navbar />
        <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
          <AccountSidebar />
          <div className="flex-1">{children}</div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
