import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-brand-lg bg-brand-white p-8 shadow-card">{children}</div>
    </div>
  );
}
