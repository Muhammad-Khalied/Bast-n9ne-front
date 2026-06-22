import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-brand bg-brand-sage px-5 py-2 text-sm font-semibold text-brand-white transition hover:bg-brand-sage-dark",
        className
      )}
      {...props}
    />
  );
}
