"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/Button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-brand-ivory rounded-full flex items-center justify-center mb-6 text-brand-muted">
        <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h2 className="text-heading-md font-heading text-brand-black mb-2">Your Bag is Empty</h2>
      <p className="text-body-md text-brand-muted max-w-sm mb-10">
        It looks like you haven't added anything to your bag yet. Explore our latest collections to find your perfect fit.
      </p>
      <Link href="/products">
        <Button className="bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors px-12 h-14 uppercase tracking-widest font-bold text-xs">
          Explore Products
        </Button>
      </Link>
    </div>
  );
}
