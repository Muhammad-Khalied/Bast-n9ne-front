import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-brand-muted whitespace-nowrap overflow-x-auto no-scrollbar py-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="text-brand-charcoal font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-brand-black transition-colors">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="w-3 h-3 mx-2 text-brand-ivory-dark" />}
          </div>
        );
      })}
    </nav>
  );
}
