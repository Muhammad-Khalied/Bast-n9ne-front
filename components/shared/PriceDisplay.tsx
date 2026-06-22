import { formatPrice, cn } from "../../lib/utils";

export function PriceDisplay({ price, discountPrice, className }: { price: number | string; discountPrice?: number | string | null; className?: string }) {
  const numDiscount = Number(discountPrice);
  const numPrice = Number(price);
  if (numDiscount > 0) {
    return (
      <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 leading-tight", className)}>
        <span className="text-brand-black font-bold tracking-tight">{formatPrice(numDiscount)}</span>
        <span className="text-xs sm:text-sm text-brand-muted line-through opacity-70">{formatPrice(numPrice)}</span>
      </div>
    );
  }
  return <span className={cn("text-brand-black font-bold tracking-tight", className)}>{formatPrice(numPrice)}</span>;
}
