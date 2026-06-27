'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { isCartDrawerOpen, toggleCartDrawer } = useUIStore();
  const { items, customItems, updateQuantity, removeItem, updateCustomQuantity, removeCustomItem } = useCartStore();

  const subtotal = items.reduce((sum, item) => {
    const price = (item as any).product?.discountPrice || (item as any).product?.price || 0;
    return sum + Number(price) * item.quantity;
  }, 0) + customItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);

  const totalItems = items.length + customItems.length;

  const handleClose = () => {
    if (useUIStore.getState().isCartDrawerOpen) {
      toggleCartDrawer();
    }
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <motion.div
          key="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
        />
      )}

      {isCartDrawerOpen && (
        <motion.div
          key="cart-drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[110] flex flex-col shadow-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-brand-ivory-dark">
            <h2 className="font-heading text-heading-sm text-brand-black flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Cart ({totalItems})
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-brand-ivory-light rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-brand-charcoal" />
            </button>
          </div>

          {/* Items */}
          {totalItems === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <ShoppingBag className="w-12 h-12 text-brand-muted mb-4" />
              <p className="font-heading text-heading-sm text-brand-black mb-2">Your cart is empty</p>
              <p className="text-sm text-brand-muted mb-6">Discover our latest collection</p>
              <Link
                href="/products"
                onClick={handleClose}
                className="px-6 py-3 bg-brand-sage text-white rounded-brand font-medium text-sm hover:bg-brand-sage-dark transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Regular items */}
                {items.map((item) => {
                const product = (item as any).product;
                const variant = (item as any).variant;
                const price = product?.discountPrice || product?.price || 0;
                const imageUrl = product?.media?.[0]?.url;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 relative rounded-brand bg-brand-ivory-light overflow-hidden flex-shrink-0">                        {imageUrl ? (
                          <Image src={imageUrl} alt={product?.title || ''} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-brand-ivory" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-black truncate">{product?.title || 'Product'}</p>
                        <p className="text-xs text-brand-muted mt-0.5">
                          {variant?.size} · {variant?.color}
                        </p>
                        <p className="text-sm font-medium text-brand-black mt-1">{formatPrice(Number(price))}</p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-brand-ivory-dark rounded-brand">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 hover:bg-brand-ivory-light transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-brand-ivory-light transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-brand-muted hover:text-status-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Custom AI T-Shirt items */}
                {customItems.map((item) => (
                  <motion.div
                    key={`custom-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 relative rounded-brand bg-brand-ivory-light overflow-hidden flex-shrink-0">
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
                      <p className="text-xs text-brand-muted mt-0.5">
                        {item.design.size} · {item.design.shirtColor}
                      </p>
                      <p className="text-sm font-medium text-brand-black mt-1">
                        {formatPrice(Number(item.unitPrice))}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-brand-ivory-dark rounded-brand">
                          <button
                            onClick={() => updateCustomQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1.5 hover:bg-brand-ivory-light transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCustomQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-brand-ivory-light transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeCustomItem(item.id)}
                          className="p-1.5 text-brand-muted hover:text-status-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-brand-ivory-dark p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-charcoal">Subtotal</span>
                  <span className="text-lg font-heading font-semibold text-brand-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-brand-muted">Shipping calculated at checkout</p>

                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={handleClose}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-sage text-white rounded-brand font-medium text-sm hover:bg-brand-sage-dark transition-colors"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={handleClose}
                    className="w-full flex items-center justify-center py-3 border border-brand-ivory-dark text-brand-charcoal rounded-brand text-sm font-medium hover:bg-brand-ivory-light transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
