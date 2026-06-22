'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Minus, Plus, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

interface QuickViewProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  media?: { url: string; altText?: string }[];
  category?: { name: string };
  variants?: { id: string; size: string; color: string; stock: number }[];
}

interface QuickViewProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isWishlisted = product ? wishlistItems.some((item) => item.product.id === product.id) : false;
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  if (!product) return null;

  useEffect(() => {
    if (product?.sizes.length === 1 && selectedSize !== product.sizes[0]) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product?.sizes, selectedSize]);

  const selectedVariant = product?.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  useEffect(() => {
    if (selectedVariant) {
      setQuantity((prev) => {
        if (prev > selectedVariant.stock) {
          return Math.max(1, selectedVariant.stock);
        }
        return prev;
      });
    }
  }, [selectedVariant]);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const imageUrl = product.media?.[0]?.url;


  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      setIsAddingToCart(true);
      await addItem(product.id, selectedVariant.id, quantity);
      toast.success("Added to bag");
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add to bag";
      if (error.response?.status === 401) {
        toast.error("Please login to add items to your bag.");
      } else {
        toast.error(message);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first.");
      return;
    }
    if (!product) return;

    try {
      setIsWishlistLoading(true);
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product.id);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-brand-lg z-50 overflow-hidden shadow-modal max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full z-10 hover:bg-brand-ivory-light transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[3/4] bg-brand-ivory-light">
                {imageUrl ? (
                  <Image src={imageUrl} alt={product.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col">
                {product.category && (
                  <p className="text-xs text-brand-sage font-medium uppercase tracking-wider mb-1">
                    {product.category.name}
                  </p>
                )}
                <h2 className="font-heading text-heading-md text-brand-black">{product.title}</h2>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-heading font-semibold text-brand-black">
                    {formatPrice(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-brand-muted line-through">{formatPrice(product.price)}</span>
                  )}
                </div>

                {/* Size Selector */}
                {product.sizes.length > 1 && (
                  <div className="mt-5">
                    <p className="text-xs font-medium text-brand-charcoal mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 border rounded-brand text-sm transition-all ${
                            selectedSize === size
                              ? 'border-brand-sage bg-brand-sage text-white'
                              : 'border-brand-ivory-dark text-brand-charcoal hover:border-brand-sage'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-brand-charcoal mb-2">
                      Color {selectedColor && `— ${selectedColor}`}
                    </p>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            selectedColor === color.name ? 'border-brand-sage scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-brand-charcoal mb-2">Quantity</p>
                  <div className="flex items-center border border-brand-ivory-dark rounded-brand w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-brand-ivory-light transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-medium text-sm">{quantity}</span>
                    <button
                      onClick={() => {
                        if (selectedVariant && quantity < selectedVariant.stock) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      disabled={!selectedVariant || quantity >= selectedVariant.stock}
                      className="p-2 hover:bg-brand-ivory-light transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-5 space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || isAddingToCart}
                    className="w-full py-3 bg-brand-sage text-white rounded-brand font-medium text-sm hover:bg-brand-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleWishlistToggle}
                      disabled={isWishlistLoading}
                      className={`flex-1 py-2.5 border text-sm rounded-brand transition-colors flex items-center justify-center gap-1.5 ${
                        isWishlisted 
                          ? 'border-status-error text-status-error' 
                          : 'border-brand-ivory-dark text-brand-charcoal hover:bg-brand-ivory-light'
                      } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isWishlistLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                      )}
                      Wishlist
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex-1 py-2.5 border border-brand-ivory-dark text-brand-charcoal rounded-brand text-sm hover:bg-brand-ivory-light transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" /> Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
