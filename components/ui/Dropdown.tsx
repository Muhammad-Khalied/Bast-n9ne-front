import { ReactNode } from "react";

export function Dropdown({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative inline-block">
      <button className="rounded-brand border border-brand-ivory-dark px-3 py-2 text-sm">{label}</button>
      <div className="absolute right-0 mt-2 w-48 rounded-brand-lg bg-brand-white p-2 shadow-card">{children}</div>
    </div>
  );
}
