"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { slugify } from "../../lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  availableSizes?: string[];
  availableColors?: { name: string; hex: string }[];
  isNavigating?: boolean;
  setIsNavigating?: (val: boolean) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-ivory-dark py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold tracking-wide text-brand-black uppercase">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-brand-muted" /> : <ChevronDown className="h-4 w-4 text-brand-muted" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({ availableSizes = [], availableColors = [], isNavigating, setIsNavigating }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [localMinPrice, setLocalMinPrice] = useState(searchParams.get("minPrice") || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get("maxPrice") || "1000");

  useEffect(() => {
    setLocalMinPrice(searchParams.get("minPrice") || "");
    setLocalMaxPrice(searchParams.get("maxPrice") || "1000");
  }, [searchParams]);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (localMinPrice && Number(localMinPrice) > 0) {
      params.set("minPrice", localMinPrice);
    } else {
      params.delete("minPrice");
    }

    if (localMaxPrice && Number(localMaxPrice) < 1000) {
      params.set("maxPrice", localMaxPrice);
    } else {
      params.delete("maxPrice");
    }
    
    // Only update URL if something actually changed
    if (params.toString() !== searchParams.toString()) {
      updateURL(params);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const selectedSizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
  const selectedColors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
  const selectedCategories = searchParams
    .get("category")
    ?.split(",")
    .map((category) => slugify(category))
    .filter(Boolean) || [];

  const updateURL = (newParams: URLSearchParams) => {
    // Always reset to page 1 when filters change
    newParams.delete("page");
    const queryString = newParams.toString();
    setIsNavigating?.(true);
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  const toggleSize = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedSizes = params.get("sizes")?.split(",").filter(Boolean) || [];
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    
    if (newSizes.length > 0) params.set("sizes", newSizes.join(","));
    else params.delete("sizes");
    
    updateURL(params);
  };

  const toggleColor = (colorName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedColors = params.get("colors")?.split(",").filter(Boolean) || [];
    const newColors = selectedColors.includes(colorName)
      ? selectedColors.filter((c) => c !== colorName)
      : [...selectedColors, colorName];
    
    if (newColors.length > 0) params.set("colors", newColors.join(","));
    else params.delete("colors");
    
    updateURL(params);
  };

  const toggleCategory = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedSlug = slugify(categorySlug);
    let currentCategories = params
      .get("category")
      ?.split(",")
      .map((category) => slugify(category))
      .filter(Boolean) || [];

    // Automatically remove "all" when interacting with specific categories
    currentCategories = currentCategories.filter(c => c !== "all");

    const nextCategories = currentCategories.includes(normalizedSlug)
      ? currentCategories.filter((category) => category !== normalizedSlug)
      : [...currentCategories, normalizedSlug];

    if (nextCategories.length > 0) {
      params.set("category", nextCategories.join(","));
    } else {
      params.delete("category");
    }
    
    updateURL(params);
  };

  const toggleSale = () => {
    const params = new URLSearchParams(searchParams.toString());
    const isSale = params.get("isSale") === "true";
    if (isSale) {
      params.delete("isSale");
    } else {
      params.set("isSale", "true");
    }
    updateURL(params);
  };

  const clearAll = () => {
    if (searchParams.toString() !== "") {
      setIsNavigating?.(true);
      router.push("/products");
    }
  };

  return (
    <aside className={`w-full lg:w-64 flex-shrink-0 transition-opacity duration-200 ${isNavigating ? "pointer-events-none opacity-50" : ""}`}>
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 pb-12 scrollbar-thin">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-heading-sm font-heading text-brand-black">Filters</h2>
          <button onClick={clearAll} className="text-xs text-brand-muted hover:text-brand-sage underline underline-offset-4">
            Clear all
          </button>
        </div>

        {categories.length > 0 && (
          <FilterSection title="Category">
            <ul className="space-y-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.slug);
                return (
                  <li key={category.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`relative flex items-center justify-center w-4 h-4 border rounded-[2px] transition-colors ${isSelected ? "border-brand-sage bg-brand-sage" : "border-brand-ivory-dark bg-brand-white group-hover:border-brand-sage"}`}>
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={isSelected}
                          onChange={() => toggleCategory(category.slug)}
                        />
                        <Check className={`w-3 h-3 text-brand-white transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`} />
                      </div>
                      <span className="text-sm text-brand-charcoal group-hover:text-brand-black transition-colors flex-1">{category.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </FilterSection>
        )}

        {availableSizes.length > 0 && (
          <FilterSection title="Size">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-10 h-10 flex items-center justify-center border text-xs font-medium transition-all ${
                      isSelected 
                        ? "border-brand-black bg-brand-black text-brand-white" 
                        : "border-brand-ivory-dark bg-brand-white text-brand-charcoal hover:border-brand-sage hover:text-brand-sage"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}

        {availableColors.length > 0 && (
          <FilterSection title="Color">
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`relative w-8 h-8 rounded-full border shadow-sm transition-transform flex items-center justify-center ${
                      isSelected ? "scale-110 border-brand-black" : "border-brand-ivory-dark hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  >
                    {isSelected && (
                      <Check className={`w-4 h-4 ${color.hex === "#FFFFFF" || color.hex === "#ffffff" ? "text-brand-black" : "text-brand-white"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}

        <FilterSection title="Sale">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`relative flex items-center justify-center w-4 h-4 border rounded-[2px] transition-colors ${searchParams.get("isSale") === "true" ? "border-brand-sage bg-brand-sage" : "border-brand-ivory-dark bg-brand-white group-hover:border-brand-sage"}`}>
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={searchParams.get("isSale") === "true"}
                onChange={toggleSale}
              />
              <Check className={`w-3 h-3 text-brand-white transition-opacity ${searchParams.get("isSale") === "true" ? "opacity-100" : "opacity-0"}`} />
            </div>
            <span className="text-sm text-brand-charcoal group-hover:text-brand-black transition-colors flex-1">Sale Items Only</span>
          </label>
        </FilterSection>
        
        <FilterSection title="Price">
           <div className="pt-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-brand-muted mb-1 block">Min (EGP)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    onBlur={applyPriceFilter}
                    onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                    placeholder="0"
                    className="w-full border border-brand-ivory-dark rounded-[2px] px-2 py-1.5 text-sm focus:outline-none focus:border-brand-sage transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-brand-muted mb-1 block">Max (EGP)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    onBlur={applyPriceFilter}
                    onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                    placeholder="1000"
                    className="w-full border border-brand-ivory-dark rounded-[2px] px-2 py-1.5 text-sm focus:outline-none focus:border-brand-sage transition-colors"
                  />
                </div>
              </div>
              <div>
                <input 
                  type="range" 
                  className="w-full accent-brand-sage cursor-pointer" 
                  min="0" 
                  max="1000"
                  value={localMaxPrice || 1000}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  onMouseUp={applyPriceFilter}
                  onTouchEnd={applyPriceFilter}
                />
                <div className="flex justify-between text-xs text-brand-muted mt-1">
                  <span>EGP 0</span>
                  <span>EGP {localMaxPrice || 1000}+</span>
                </div>
              </div>
           </div>
        </FilterSection>
      </div>
    </aside>
  );
}
