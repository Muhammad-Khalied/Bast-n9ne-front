"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";

import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCategoryStore } from "../../store/categoryStore";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "../../components/cart/CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { itemCount, fetchCart } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { toggleMobileMenu, toggleSearchOverlay, toggleCartDrawer } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCart().catch(() => undefined);
    fetchCategories().catch(() => undefined);
  }, [fetchCart, fetchCategories]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist().catch(() => undefined);
    }
  }, [fetchWishlist, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always use dark text for guaranteed readability
  const navClass = `sticky top-0 z-40 transition-all duration-300 bg-brand-ivory border-b border-brand-ivory-dark ${
    isScrolled ? "shadow-sm py-3" : "py-4"
  }`;

  const textClass = "text-brand-black";
  const hoverClass = "hover:text-brand-sage";

  return (
    <>
      <header className={navClass}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className={`p-2 -ml-2 ${textClass}`} aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className={`flex-1 md:flex-none text-center md:text-left ${textClass}`}>
            <Link href="/" className="inline-flex items-center justify-center md:justify-start gap-3">
              <Image src="/bast_n9ne_icon.svg" alt="Bast n9ne Logo" width={40} height={40} priority className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-3xl md:text-display-md font-display leading-none tracking-tight whitespace-nowrap">Bast n9ne</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase ${textClass}`}>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`} 
                className={`transition-colors ${hoverClass}`}
              >
                {category.name}
              </Link>
            ))}
            <Link href="/products?category=all" className={`transition-colors ${hoverClass}`}>Shop All</Link>
          </nav>

          {/* Icons */}
          <div className={`flex items-center gap-4 md:gap-5 ${textClass}`}>
            <button onClick={toggleSearchOverlay} className={`transition-colors ${hoverClass}`} aria-label="Search">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className={`hidden sm:block relative transition-colors ${hoverClass}`} aria-label="Wishlist">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold bg-brand-sage text-brand-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href={isAuthenticated ? "/account" : "/login"} className={`hidden sm:block transition-colors ${hoverClass}`} aria-label="Account">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <button onClick={toggleCartDrawer} className={`relative flex items-center transition-colors ${hoverClass}`} aria-label="Cart">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold bg-brand-sage text-brand-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Overlays & Drawers */}
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
    </>
  );
}
