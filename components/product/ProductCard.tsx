"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "../../lib/animations";
import { PriceDisplay } from "../shared/PriceDisplay";
import { ImageWithFallback } from "../shared/ImageWithFallback";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useSettings } from "../../hooks/useSettings";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    category?: { name: string };
    colors?: { hex: string; name: string }[];
    media?: { url: string }[];
    isNew?: boolean;
    isSale?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addWishlistItem = useWishlistStore((state) => state.addItem);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isWishlisted = wishlistItems.some((item) => item.product.id === product.id);
  const { settings } = useSettings();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first.");
      return;
    }

    try {
      setIsWishlistLoading(true);
      if (isWishlisted) {
        await removeWishlistItem(product.id);
        toast.success("Removed from wishlist");
      } else {
        await addWishlistItem(product.id);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <motion.div variants={fadeInUp} className="group relative block w-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-ivory-light">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10">
          {product.media?.[0]?.url ? (
            <ImageWithFallback 
              src={product.media[0].url} 
              alt={product.title} 
              fill 
              className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-brand-ivory flex items-center justify-center text-brand-muted text-sm">
              No image
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-brand-sage-500 text-brand-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
              New
            </span>
          )}
          {Number(product.discountPrice) > 0 && (
            <span className="bg-status-error text-brand-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
              {settings.product_sale_badge_text || "Sale"}
            </span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button 
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`absolute top-3 right-3 z-20 p-2 transition-colors bg-brand-white/70 backdrop-blur-sm rounded-full hover:bg-brand-white ${
            isWishlisted ? "text-status-error" : "text-brand-black hover:text-status-error"
          } ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
        >
          {isWishlistLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          )}
        </button>
      </div>

      <div className="mt-4 space-y-1">
        {product.category?.name && (
          <p className="text-overline text-brand-muted uppercase tracking-widest">{product.category.name}</p>
        )}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-body-md text-brand-charcoal font-medium line-clamp-1 group-hover:underline decoration-1 underline-offset-4 decoration-brand-sage">
            {product.title}
          </h3>
        </Link>
        <div className="flex flex-wrap justify-between items-center mt-3 gap-y-2 gap-x-4">
          <PriceDisplay price={Number(product.price)} discountPrice={product.discountPrice ?? undefined} />
          
          {/* Colors */}
          {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="flex gap-1.5 shrink-0">
              {product.colors.slice(0, 4).map((color: any, i: number) => (
                <div 
                  key={i} 
                  className="w-4 h-4 rounded-full border border-brand-ivory-dark shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-brand-muted ml-0.5 flex items-center">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
