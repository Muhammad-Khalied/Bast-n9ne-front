"use client";

import Link from "next/link";
import { formatPrice } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Lock } from "lucide-react";

export function CartSummary({ subtotal }: { subtotal: number }) {
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="bg-brand-ivory-light p-6 md:p-8 rounded-brand-lg">
      <h2 className="text-heading-sm font-heading text-brand-black mb-6">Order Summary</h2>
      
      <div className="space-y-4 text-sm">
        <div className="flex justify-between text-brand-charcoal">
          <span>Subtotal</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-brand-charcoal pb-4 border-b border-brand-ivory-dark">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-brand-black pt-2">
          <span className="font-bold uppercase tracking-widest text-xs">Estimated Total</span>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Link href="/checkout">
          <Button className="w-full h-14 bg-brand-black text-brand-white hover:bg-brand-charcoal transition-colors uppercase tracking-[0.2em] font-bold text-xs">
            Proceed to Checkout
          </Button>
        </Link>
        
        <div className="flex items-center justify-center gap-2 text-brand-muted text-[10px] uppercase font-bold tracking-widest">
          <Lock className="w-3 h-3" /> Secure Checkout
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-brand-ivory-dark">
        <p className="text-[10px] text-brand-muted uppercase font-bold tracking-widest mb-4">We Accept</p>
        <div className="flex gap-2 flex-wrap">
          <div className="px-2 py-1 bg-brand-white rounded text-[8px] font-bold border border-brand-ivory-dark">VISA</div>
          <div className="px-2 py-1 bg-brand-white rounded text-[8px] font-bold border border-brand-ivory-dark">MASTERCARD</div>
          <div className="px-2 py-1 bg-brand-white rounded text-[8px] font-bold border border-brand-ivory-dark">AMEX</div>
          <div className="px-2 py-1 bg-brand-white rounded text-[8px] font-bold border border-brand-ivory-dark">APPLE PAY</div>
        </div>
      </div>
    </div>
  );
}
