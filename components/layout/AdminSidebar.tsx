"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ClipboardList, 
  Users, 
  Package, 
  BarChart3,
  Settings,
  ExternalLink
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-brand-ivory-dark bg-brand-white flex flex-col h-screen sticky top-0">
      <div className="p-8 border-b border-brand-ivory">
        <h1 className="text-lg font-display tracking-widest text-brand-black">Bast n9ne</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-brand-muted mt-1">Management</p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-brand text-xs font-bold uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-brand-black text-brand-white shadow-sm" 
                  : "text-brand-muted hover:text-brand-black hover:bg-brand-ivory"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-brand-ivory">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center justify-between px-4 py-3 rounded-brand text-[10px] font-bold uppercase tracking-[0.2em] text-brand-sage hover:bg-brand-sage-50 transition-all"
        >
          View Storefront <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
