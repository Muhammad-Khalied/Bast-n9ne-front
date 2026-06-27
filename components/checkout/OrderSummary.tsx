'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Package, Truck, Loader2, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCheckoutStore } from '@/store/checkoutStore';

export function OrderSummary() {
  const { items, customItems, isLoading } = useCartStore();

  const { hasAddress } = useCheckoutStore();

  const regularSubtotal = items.reduce((sum, item) => {
    const price = (item as any).product?.discountPrice || (item as any).product?.price || 0;
    return sum + Number(price) * item.quantity;
  }, 0);
  const customSubtotal = customItems.reduce((sum, item) => {
    return sum + Number(item.unitPrice) * item.quantity;
  }, 0);
  const subtotal = regularSubtotal + customSubtotal;
  const shipping = 150;
  const total = subtotal + (hasAddress ? shipping : 0);

  if (isLoading && items.length === 0 && customItems.length === 0) {
    return (
      <div className="bg-white border border-brand-ivory-dark rounded-brand-lg overflow-hidden flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-ivory-dark rounded-brand-lg overflow-hidden">
      <div className="p-5 border-b border-brand-ivory-dark">
        <h3 className="font-heading text-heading-sm text-brand-black">Order Summary</h3>
      </div>

      {/* Items */}
      <div className="divide-y divide-brand-ivory-dark">
        {/* Regular items */}
        {items.map((item) => {
          const product = (item as any).product;
          const variant = (item as any).variant;
          const price = product?.discountPrice || product?.price || 0;
          const imageUrl = product?.media?.[0]?.url;

          return (
            <div key={item.id} className="flex gap-4 p-5">
              <div className="w-16 h-20 relative rounded-brand bg-brand-ivory-light overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <Image src={imageUrl} alt={product?.title || ''} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-brand-muted" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-black truncate">{product?.title || 'Product'}</p>
                <p className="text-xs text-brand-muted mt-1">
                  {variant?.size && `Size: ${variant.size}`}
                  {variant?.size && variant?.color && ' · '}
                  {variant?.color && `Color: ${variant.color}`}
                </p>
                <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-brand-black whitespace-nowrap">
                {formatPrice(Number(price) * item.quantity)}
              </p>
            </div>
          );
        })}

        {/* Custom AI T-Shirt items */}
        {customItems.map((item) => (
          <div key={`custom-${item.id}`} className="flex gap-4 p-5">
            <div className="w-16 h-20 relative rounded-brand bg-brand-ivory-light overflow-hidden flex-shrink-0">
              <Image
                src={item.design.imageUrl}
                alt="Custom AI Design"
                fill
                className="object-contain p-1"
              />
              <div className="absolute top-1 left-1">
                <Sparkles className="w-3 h-3 text-brand-sage" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-black truncate flex items-center gap-1">
                Custom AI T-Shirt
              </p>
              <p className="text-xs text-brand-muted mt-1">
                Size: {item.design.size} · Color: {item.design.shirtColor}
              </p>
              <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-brand-black whitespace-nowrap">
              {formatPrice(Number(item.unitPrice) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-5 bg-brand-ivory-50 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-brand-charcoal">Subtotal</span>
          <span className="text-brand-black font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-charcoal flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Shipping
          </span>
          <span className="text-brand-black font-medium">
            {!hasAddress ? (
              <span className="text-brand-muted text-xs font-normal">Calculated at next step</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="border-t border-brand-ivory-dark pt-3 flex justify-between">
          <span className="font-medium text-brand-black">Total</span>
          <span className="text-lg font-heading font-semibold text-brand-black">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
