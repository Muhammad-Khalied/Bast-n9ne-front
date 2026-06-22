import { ReactNode } from "react";

export function Tabs({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}
