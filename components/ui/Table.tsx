import { TableHTMLAttributes } from "react";

export function Table({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className="w-full border-collapse text-sm" {...props}>
      {children}
    </table>
  );
}
