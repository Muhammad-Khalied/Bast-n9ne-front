"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

export function Footer() {
  const { settings, isLoading } = useSettings();

  if (isLoading) return <footer className="mt-20 bg-brand-black pt-16 pb-8 border-t border-brand-black min-h-[400px] animate-pulse" />;

  return (
    <footer className="mt-20 bg-brand-black text-brand-ivory-light pt-16 pb-8 border-t border-brand-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <h2 className="text-display-sm font-display text-brand-white mb-4">
              {settings.site_name || "Bast n9ne"}
            </h2>
            <p className="text-sm text-brand-muted max-w-xs mb-6">
              {settings.footer_description || "Luxury streetwear crafted for the modern wardrobe. Redefining everyday essentials with premium materials."}
            </p>
            <div className="flex gap-4">
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-white transition-colors">
                  <Instagram className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-white transition-colors">
                  <Facebook className="w-5 h-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-white transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-brand-white mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li><Link href="/products?sort=newest" className="hover:text-brand-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=women" className="hover:text-brand-white transition-colors">Women's Collection</Link></li>
              <li><Link href="/products?category=men" className="hover:text-brand-white transition-colors">Men's Collection</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-brand-white transition-colors">Accessories</Link></li>
              <li><Link href="/products?isSale=true" className="hover:text-brand-white transition-colors text-status-error hover:text-status-error/80">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-brand-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li><Link href="/contact" className="hover:text-brand-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-charcoal flex justify-center items-center">
          <p className="text-xs text-brand-muted">
            {settings.footer_copyright || `© ${new Date().getFullYear()} Bast n9ne. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
