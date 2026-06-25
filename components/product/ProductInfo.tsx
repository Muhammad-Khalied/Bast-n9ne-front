"use client";

import { useState, useMemo, useEffect } from "react";
import { Heart, Truck, RefreshCw, Star } from "lucide-react";
import { PriceDisplay } from "../shared/PriceDisplay";
import { Button } from "../ui/Button";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { toast } from "react-hot-toast";

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    price: number;
    discountPrice?: number | null;
    category?: { name: string };
    description?: string;
    colors?: { hex: string; name: string }[];
    sizes?: string[];
    avgRating?: number;
    soldCount?: number;
    variants?: { id: string; size: string; color: string; stock: number }[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "shipping">("description");
  
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addWishlistItem = useWishlistStore((state) => state.addItem);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isWishlisted = wishlistItems.some((item) => item.product.id === product.id);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const availableVariants = useMemo(() => {
    return product.variants?.filter((v) => v.color === selectedColor && v.stock > 0) || [];
  }, [product.variants, selectedColor]);

  const availableSizes = useMemo(() => {
    return Array.from(new Set(availableVariants.map((v) => v.size)));
  }, [availableVariants]);

  const currentVariant = useMemo(() => {
    return availableVariants.find((v) => v.size === selectedSize);
  }, [availableVariants, selectedSize]);

  // Reset selected size if it's not available for the new color
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setQuantity(1);
  };

  useEffect(() => {
    if (availableSizes.length === 1 && selectedSize !== availableSizes[0]) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  useEffect(() => {
    if (currentVariant) {
      setQuantity((prev) => {
        if (prev > currentVariant.stock) {
          return Math.max(1, currentVariant.stock);
        }
        return prev;
      });
    }
  }, [currentVariant]);

  const handleQuantityChange = (delta: number) => {
    if (!currentVariant) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= currentVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!currentVariant) {
      toast.error("Selected variant is not available");
      return;
    }

    try {
      await addItem(product.id, currentVariant.id, quantity);
      toast.success("Added to bag");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add to bag";
      if (error.response?.status === 401) {
        toast.error("Please login to add items to your bag.");
      } else {
        toast.error(message);
      }
    }
  };

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
    <div className="flex flex-col h-full">
      <p className="text-overline text-brand-muted uppercase tracking-widest mb-2">
        {product.category?.name || "Category"}
      </p>
      
      <h1 className="text-heading-xl font-heading text-brand-black mb-3">{product.title}</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-brand-sage">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.avgRating || 4.5) ? "fill-current" : ""}`} />
          ))}
          <span className="text-sm text-brand-charcoal ml-2">({product.avgRating || 4.5})</span>
        </div>
        {(product.soldCount && product.soldCount > 50) ? (
          <>
            <span className="text-sm text-brand-muted">·</span>
            <span className="text-sm text-brand-charcoal">{product.soldCount} sold</span>
          </>
        ) : null}
      </div>

      <div className="mb-8">
        <PriceDisplay price={Number(product.price)} discountPrice={product.discountPrice ?? undefined} className="text-heading-lg" />
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wide uppercase text-brand-black">Color: <span className="text-brand-muted font-normal capitalize">{selectedColor || "Standard"}</span></span>
          </div>
          <div className="flex gap-3">
            {product.colors.map((color) => {
              // Only check if there's any stock for this color across all sizes
              const hasStockForColor = product.variants?.some(v => v.color === color.name && v.stock > 0);
              return (
                <button
                  key={color.name || "standard"}
                  onClick={() => handleColorChange(color.name)}
                  disabled={!hasStockForColor}
                  className={`w-10 h-10 rounded-full border shadow-sm transition-transform flex items-center justify-center ${
                    selectedColor === color.name ? "border-brand-black ring-2 ring-offset-2 ring-brand-black" : "border-brand-ivory-dark hover:scale-110"
                  } ${!hasStockForColor ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name || "Standard"}
                />
              );
            })}
          </div>
        </div>
      )}

      {availableSizes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wide uppercase text-brand-black">Size</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
            {availableSizes.map((size) => (
              <button
                key={size || "default"}
                onClick={() => setSelectedSize(size)}
                className={`h-12 flex items-center justify-center border text-sm font-medium transition-colors ${
                  selectedSize === size 
                    ? "border-brand-black bg-brand-black text-brand-white" 
                    : "border-brand-ivory-dark bg-brand-white text-brand-charcoal hover:border-brand-sage hover:text-brand-sage"
                }`}
              >
                {size || "Standard"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <div className="flex items-center border border-brand-ivory-dark bg-brand-white h-14">
          <button 
            className="w-12 h-full flex items-center justify-center text-brand-charcoal hover:text-brand-black disabled:opacity-50"
            onClick={() => handleQuantityChange(-1)}
            disabled={!currentVariant || quantity <= 1}
          >-</button>
          <span className="w-8 text-center text-sm font-medium text-brand-black">{quantity}</span>
          <button 
            className="w-12 h-full flex items-center justify-center text-brand-charcoal hover:text-brand-black disabled:opacity-50"
            onClick={() => handleQuantityChange(1)}
            disabled={!currentVariant || quantity >= currentVariant.stock}
          >+</button>
        </div>
        <Button 
          onClick={handleAddToCart}
          disabled={!currentVariant}
          className="flex-1 h-14 bg-brand-sage text-brand-white hover:bg-brand-sage-dark transition-colors uppercase tracking-widest font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentVariant ? "Add to Bag" : "Out of Stock"}
        </Button>
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className={`w-14 h-14 border flex items-center justify-center transition-colors ${
            isWishlisted
              ? "border-status-error text-status-error"
              : "border-brand-ivory-dark text-brand-charcoal hover:text-status-error hover:border-status-error"
          } ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isWishlistLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          )}
        </button>
      </div>

      <div className="space-y-3 mb-10 py-6 border-y border-brand-ivory-dark">
        <div className="flex items-center gap-3 text-sm text-brand-charcoal">
          <div className={`w-2 h-2 rounded-full ${currentVariant ? "bg-status-success" : "bg-status-error"}`} />
          <span>{currentVariant ? `In Stock (${currentVariant.stock} available)` : "Select a size"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-brand-charcoal">
          <Truck className="w-4 h-4 text-brand-muted" />
          <span>Fixed shipping rate EGP 150</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-brand-charcoal">
          <RefreshCw className="w-4 h-4 text-brand-muted" />
          <span>30-day easy returns</span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex border-b border-brand-ivory-dark">
          {["description", "details", "shipping"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                activeTab === tab ? "text-brand-black" : "text-brand-muted hover:text-brand-charcoal"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-sage" />
              )}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm text-brand-charcoal leading-relaxed min-h-[150px]">
          {activeTab === "description" && (
            <p>{product.description || "No description available for this product."}</p>
          )}
          {activeTab === "details" && (
            <ul className="list-disc pl-5 space-y-2">
              <li>100% Premium Cotton</li>
              <li>Heavyweight 450gsm fabric</li>
              <li>Oversized fit</li>
              <li>Drop shoulder design</li>
              <li>Machine wash cold, tumble dry low</li>
            </ul>
          )}
          {activeTab === "shipping" && (
            <p>
              Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. 
              Returns are accepted within 30 days of receiving your order. Items must be unworn and in original condition.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
