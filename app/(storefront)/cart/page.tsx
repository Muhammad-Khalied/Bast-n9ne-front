"use client";

import { useEffect } from "react";
import { useCartStore } from "../../../store/cartStore";
import { CartItem } from "../../../components/cart/CartItem";
import { CartSummary } from "../../../components/cart/CartSummary";
import { EmptyCart } from "../../../components/cart/EmptyCart";

export default function CartPage() {
  const { items, subtotal, fetchCart, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart().catch(() => undefined);
  }, [fetchCart]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
      <h1 className="text-display-sm font-display text-brand-black mb-10">Your Bag</h1>
      
      {isLoading && !items.length ? (
        <div className="h-64 flex items-center justify-center text-brand-muted">Loading your bag...</div>
      ) : items.length ? (
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-brand-ivory-dark text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <div className="divide-y divide-brand-ivory">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 sticky top-24">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}
