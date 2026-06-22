"use client";

import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { CartItem as CartItemType, useCartStore } from "../../store/cartStore";
import { PriceDisplay } from "../shared/PriceDisplay";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { formatPrice } from "../../lib/utils";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleUpdateQty = async (newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(item.id, newQty);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update quantity";
      import("react-hot-toast").then((module) => {
        module.toast.error(message);
      });
    }
  };

  const itemPrice = Number(item.product.discountPrice ?? item.product.price);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 items-center">
      <div className="col-span-12 md:col-span-6 flex gap-4">
        <div className="relative w-20 h-24 bg-brand-ivory flex-shrink-0">
          {item.product.media?.[0]?.url && (
            <ImageWithFallback src={item.product.media[0].url} alt={item.product.title} fill className="object-cover" />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-brand-black">{item.product.title}</h3>
          <p className="text-xs text-brand-muted mt-1 uppercase tracking-tight">
            {item.variant.color} / {item.variant.size}
          </p>
          <button 
            onClick={() => removeItem(item.id)}
            className="md:hidden flex items-center gap-1 text-[10px] uppercase font-bold text-status-error mt-2 tracking-widest"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      </div>

      <div className="col-span-4 md:col-span-2 text-center hidden md:block">
        <PriceDisplay price={Number(item.product.price)} discountPrice={item.product.discountPrice ?? undefined} className="text-xs" />
      </div>

      <div className="col-span-6 md:col-span-2 flex justify-center">
        <div className="flex items-center border border-brand-ivory-dark h-8 bg-brand-white">
          <button 
            className="w-8 h-full flex items-center justify-center text-brand-charcoal hover:text-brand-black transition-colors"
            onClick={() => handleUpdateQty(item.quantity - 1)}
          ><Minus className="w-3 h-3" /></button>
          <span className="w-6 text-center text-xs font-medium text-brand-black">{item.quantity}</span>
          <button 
            className="w-8 h-full flex items-center justify-center text-brand-charcoal hover:text-brand-black transition-colors"
            onClick={() => handleUpdateQty(item.quantity + 1)}
          ><Plus className="w-3 h-3" /></button>
        </div>
      </div>

      <div className="col-span-6 md:col-span-2 text-right flex flex-col md:block items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted md:hidden mb-1">Total</span>
        <p className="text-sm font-bold text-brand-black">
          {formatPrice(itemPrice * item.quantity)}
        </p>
        <button 
          onClick={() => removeItem(item.id)}
          className="hidden md:flex items-center gap-1 text-[10px] uppercase font-bold text-brand-muted hover:text-status-error mt-2 tracking-widest transition-colors ml-auto"
        >
          <X className="w-3 h-3" /> Remove
        </button>
      </div>
    </div>
  );
}
