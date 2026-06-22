import { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-brand-lg border border-dashed border-brand-ivory-dark bg-brand-ivory-light p-12 flex flex-col items-center justify-center text-center">
      <h3 className="text-heading-sm font-heading text-brand-black">{title}</h3>
      {description && <p className="mt-2 text-sm text-brand-muted max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
