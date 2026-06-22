"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export function AccountSidebar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="w-64 border-r border-brand-ivory-dark bg-brand-white p-6">
      <h2 className="text-heading-sm font-heading">Account</h2>
      <nav className="mt-6 flex flex-col gap-3 text-sm">
        <Link href="/account">Overview</Link>
        <Link href="/account/orders">Orders</Link>
        <Link href="/account/addresses">Addresses</Link>
        <Link href="/account/settings">Settings</Link>
        <button 
          onClick={handleLogout}
          className="text-left text-status-error hover:text-red-700 transition-colors mt-4 pt-4 border-t border-brand-ivory-dark"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
