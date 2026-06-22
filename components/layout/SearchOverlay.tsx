'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/lib/api';

interface Suggestion {
  title: string;
  slug: string;
}

export default function SearchOverlay() {
  const { isSearchOverlayOpen, toggleSearchOverlay, closeSearchOverlay } = useUIStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigatingTo, setIsNavigatingTo] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isSearchOverlayOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isSearchOverlayOpen) {
      setQuery('');
      setSuggestions([]);
      setIsNavigatingTo(null);
    }
  }, [isSearchOverlayOpen]);

  useEffect(() => {
    closeSearchOverlay();
  }, [pathname, closeSearchOverlay]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        setSuggestions(res.data.data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isNavigatingTo) {
      setIsNavigatingTo('search_form');
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    if (isNavigatingTo) return;
    setIsNavigatingTo(slug);
    router.push(`/products/${slug}`);
  };

  const popularSearches = ['Hoodies', 'Streetwear', 'T-Shirts', 'Sneakers', 'New Arrivals'];

  return (
    <AnimatePresence>
      {isSearchOverlayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-end p-4 sm:p-6">
            <button
              onClick={toggleSearchOverlay}
              className="p-2 hover:bg-brand-ivory-light rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-brand-charcoal" />
            </button>
          </div>

          {/* Search Content */}
          <div className="flex-1 flex flex-col items-center px-4 pt-8 sm:pt-16 max-w-2xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full"
            >
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products..."
                  disabled={!!isNavigatingTo}
                  className="w-full pl-12 pr-4 py-4 text-lg border-b-2 border-brand-ivory-dark focus:border-brand-sage bg-transparent outline-none text-brand-black placeholder:text-brand-muted transition-colors disabled:opacity-50"
                />
              </form>
            </motion.div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full mt-6 space-y-1"
              >
                {suggestions.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => handleSuggestionClick(item.slug)}
                    disabled={!!isNavigatingTo}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-brand-md hover:bg-brand-ivory-light transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-brand-charcoal">{item.title}</span>
                    {isNavigatingTo === item.slug ? (
                      <div className="w-4 h-4 border-2 border-brand-sage border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-sage transition-colors" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Loading */}
            {isLoading && query.length >= 2 && (
              <div className="w-full mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-brand-ivory-light rounded-brand-md animate-pulse" />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= 2 && suggestions.length === 0 && (
              <p className="text-brand-muted mt-8">No products found for &ldquo;{query}&rdquo;</p>
            )}

            {/* Popular Searches */}
            {query.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full mt-10"
              >
                <h3 className="flex items-center gap-2 text-sm font-medium text-brand-muted mb-4">
                  <TrendingUp className="w-4 h-4" /> Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        if (isNavigatingTo) return;
                        setIsNavigatingTo(term);
                        setQuery(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      disabled={!!isNavigatingTo}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-ivory-dark text-sm text-brand-charcoal hover:border-brand-sage hover:text-brand-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {term}
                      {isNavigatingTo === term && (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
