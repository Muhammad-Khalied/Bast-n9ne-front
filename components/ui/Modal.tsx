import { ReactNode } from "react";

export function Modal({ open, title, children }: { open: boolean; title?: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-brand-lg bg-brand-white p-6 shadow-modal">
        {title && <h3 className="mb-4 text-heading-sm font-heading">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
