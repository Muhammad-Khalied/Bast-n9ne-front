'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCategoryStore } from '@/store/categoryStore';

const navLinks = [
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Streetwear', href: '/products?category=streetwear' },
  { label: 'Outerwear', href: '/products?category=outerwear' },
  { label: 'Footwear', href: '/products?category=footwear' },
  { label: 'Accessories', href: '/products?category=accessories' },
  { label: 'Sale', href: '/products?tags=sale' },
];

export default function MobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { categories } = useCategoryStore();

  const handleLinkClick = () => {
    if (useUIStore.getState().isMobileMenuOpen) toggleMobileMenu();
  };

  const handleClose = () => {
    if (useUIStore.getState().isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          key="mobile-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
        />
      )}

      {isMobileMenuOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-[110] flex flex-col shadow-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-brand-ivory-dark">
            <Link href="/" onClick={toggleMobileMenu}>
              <span className="text-3xl font-display tracking-tight text-brand-black whitespace-nowrap">Bast n9ne</span>
            </Link>
            <button onClick={handleClose} className="p-2 hover:bg-brand-ivory-light rounded-full transition-colors">
              <X className="w-5 h-5 text-brand-charcoal" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <Link
              href="/products?category=all"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-6 py-3.5 text-brand-charcoal hover:bg-brand-ivory-light hover:text-brand-sage transition-colors"
            >
              <span className="font-body text-body-md font-bold">Shop All</span>
              <ChevronRight className="w-4 h-4 text-brand-muted" />
            </Link>

            <Link
              href="/products?sort=newest"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-6 py-3.5 text-brand-charcoal hover:bg-brand-ivory-light hover:text-brand-sage transition-colors"
            >
              <span className="font-body text-body-md">New Arrivals</span>
              <ChevronRight className="w-4 h-4 text-brand-muted" />
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                onClick={handleLinkClick}
                className="flex items-center justify-between px-6 py-3.5 text-brand-charcoal hover:bg-brand-ivory-light hover:text-brand-sage transition-colors"
              >
                <span className="font-body text-body-md">{category.name}</span>
                <ChevronRight className="w-4 h-4 text-brand-muted" />
              </Link>
            ))}

          </nav>

          {/* Bottom Section */}
          <div className="border-t border-brand-ivory-dark p-5 space-y-3">
            {/* Cart & Wishlist */}
            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={handleLinkClick}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-sage text-white rounded-brand font-medium text-sm hover:bg-brand-sage-dark transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart {items.length > 0 && `(${items.length})`}
              </Link>
              <Link
                href="/wishlist"
                onClick={handleLinkClick}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-ivory-dark text-brand-charcoal rounded-brand font-medium text-sm hover:bg-brand-ivory-light transition-colors"
              >
                <Heart className="w-4 h-4" />
                Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
              </Link>
            </div>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/account"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-sm text-brand-charcoal hover:text-brand-sage transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user?.firstName} {user?.lastName}
                </Link>
                <button
                  onClick={() => { logout(); handleLinkClick(); }}
                  className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-status-error transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="flex-1 text-center py-2.5 border border-brand-sage text-brand-sage rounded-brand text-sm font-medium hover:bg-brand-sage/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={handleLinkClick}
                  className="flex-1 text-center py-2.5 bg-brand-black text-white rounded-brand text-sm font-medium hover:bg-brand-charcoal transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
