"use client";

import { useEffect } from "react";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useAuthStore } from "../../../store/authStore";
import { ProductGrid } from "../../../components/product/ProductGrid";
import { EmptyState } from "../../../components/shared/EmptyState";
import Link from "next/link";

export default function WishlistPage() {
  const { items, fetchWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist().catch(() => undefined);
    }
  }, [fetchWishlist, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <EmptyState 
        title="Please sign in" 
        description="You need to be signed in to view your wishlist." 
        action={
          <Link href="/login" className="inline-flex items-center justify-center bg-brand-black text-brand-white px-6 py-3 rounded-brand font-bold text-xs uppercase tracking-widest hover:bg-brand-charcoal transition-colors">
            Sign In
          </Link>
        }
      />
    );
  }

  if (!items.length) {
    return <EmptyState title="Wishlist is empty" description="Save products to view them here." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-heading-lg font-heading">Wishlist</h1>
      <ProductGrid products={items.map((item) => item.product)} />
    </div>
  );
}
