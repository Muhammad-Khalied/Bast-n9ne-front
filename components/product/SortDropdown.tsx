"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Popularity", value: "popular" },
];

export function SortDropdown({ isNavigating, setIsNavigating }: { isNavigating?: boolean; setIsNavigating?: (val: boolean) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(sortOptions[0]);

  useEffect(() => {
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      const option = sortOptions.find((opt) => opt.value === currentSort);
      if (option) {
        setSelected(option);
      }
    } else {
      setSelected(sortOptions[0]);
    }
  }, [searchParams]);

  const handleSelect = (option: typeof sortOptions[0]) => {
    setSelected(option);
    setIsOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", option.value);
    setIsNavigating?.(true);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isNavigating}
        className={`flex items-center gap-2 text-sm text-brand-charcoal hover:text-brand-black transition-colors ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span>Sort by: <strong>{selected.label}</strong></span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-brand bg-brand-white shadow-elevated z-50 py-2 border border-brand-ivory-dark">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-brand-ivory-light transition-colors ${
                selected.value === option.value ? "text-brand-sage font-medium bg-brand-sage-50" : "text-brand-charcoal"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
