import { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-brand border border-brand-ivory-dark bg-brand-white px-3 py-2 text-sm focus:border-brand-sage focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
