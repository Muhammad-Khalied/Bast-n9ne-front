'use client';

import { X } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';

export default function ProductFilters() {
  const { filters, setFilter, clearFilters, hasActiveFilters } = useFilterStore();

  if (!hasActiveFilters()) return null;

  const activeFilters: { label: string; key: string; value: string }[] = [];

  if (filters.category) {
    activeFilters.push({ label: `Category: ${filters.category}`, key: 'category', value: filters.category });
  }
  if (filters.minPrice || filters.maxPrice) {
    const range = `EGP ${filters.minPrice || 0} – EGP ${filters.maxPrice || '∞'}`;
    activeFilters.push({ label: `Price: ${range}`, key: 'price', value: range });
  }
  filters.sizes?.forEach((size) => {
    activeFilters.push({ label: `Size: ${size}`, key: 'size', value: size });
  });
  filters.colors?.forEach((color) => {
    activeFilters.push({ label: `Color: ${color}`, key: 'color', value: color });
  });

  const removeFilter = (key: string, value: string) => {
    switch (key) {
      case 'category':
        setFilter('category', undefined);
        break;
      case 'price':
        setFilter('minPrice', undefined);
        setFilter('maxPrice', undefined);
        break;
      case 'size':
        setFilter('sizes', filters.sizes?.filter((s) => s !== value));
        break;
      case 'color':
        setFilter('colors', filters.colors?.filter((c) => c !== value));
        break;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-brand-muted font-medium">Active Filters:</span>
      {activeFilters.map((filter, i) => (
        <button
          key={`${filter.key}-${filter.value}-${i}`}
          onClick={() => removeFilter(filter.key, filter.value)}
          className="flex items-center gap-1 px-3 py-1 bg-brand-sage/10 text-brand-sage text-xs font-medium rounded-full hover:bg-brand-sage/20 transition-colors group"
        >
          {filter.label}
          <X className="w-3 h-3 group-hover:text-status-error transition-colors" />
        </button>
      ))}
      <button
        onClick={clearFilters}
        className="text-xs text-brand-muted hover:text-brand-charcoal transition-colors underline underline-offset-2"
      >
        Clear All
      </button>
    </div>
  );
}
