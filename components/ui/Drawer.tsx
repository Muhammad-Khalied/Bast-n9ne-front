import { ReactNode } from "react";

export function Drawer({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-md bg-brand-white p-6 shadow-elevated">{children}</div>
    </div>
  );
}
