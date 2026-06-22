"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "./ProductGrid";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown } from "./SortDropdown";
import { slugify } from "../../lib/utils";

const parseParamList = (value: string | null) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const toNumber = (value: unknown) => Number(value ?? 0);

export function ProductsCatalog({ products }: { products: any[] }) {
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [searchParams]);

  const rawCategories = parseParamList(searchParams.get("category")).map((category) => slugify(category));
  const isNewArrivals = rawCategories.includes("new-arrivals");
  const selectedCategories = rawCategories.filter(c => c !== "new-arrivals");

  const selectedSizes = parseParamList(searchParams.get("sizes"));
  const selectedColors = parseParamList(searchParams.get("colors"));
  const searchTerm = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 1000;
  const sortValue = searchParams.get("sort") ?? (isNewArrivals ? "newest" : "newest");
  const isSaleOnly = searchParams.get("isSale") === "true" || searchParams.get("tags") === "sale";

  const allCategorySlugs = useMemo(
    () => Array.from(new Set(products.map((product) => slugify(product.category?.slug || product.category?.name || "")).filter(Boolean))),
    [products],
  );

  const effectiveCategories = useMemo(() => {
    if (selectedCategories.length === 0 || selectedCategories.includes("all")) {
      return allCategorySlugs;
    }
    return selectedCategories;
  }, [selectedCategories, allCategorySlugs]);

  const categoryFilteredProducts = useMemo(
    () => {
      if (effectiveCategories.length === 0) return [];
      return products.filter((product) => {
        const categorySlug = slugify(product.category?.slug || product.category?.name || "");
        return effectiveCategories.includes(categorySlug);
      });
    },
    [products, effectiveCategories],
  );

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    categoryFilteredProducts.forEach((p) => {
      (p.sizes || []).forEach((s: string) => sizes.add(s));
    });
    return Array.from(sizes).sort();
  }, [categoryFilteredProducts]);

  const availableColors = useMemo(() => {
    const colorMap = new Map<string, { name: string, hex: string }>();
    categoryFilteredProducts.forEach((p) => {
      (p.colors || []).forEach((c: any) => {
        if (c?.name && c?.hex) colorMap.set(c.name, c);
      });
    });
    return Array.from(colorMap.values());
  }, [categoryFilteredProducts]);

  const filteredProducts = useMemo(
    () => {
      if (effectiveCategories.length === 0) return [];
      return products
        .filter((product) => {
          const categorySlug = slugify(product.category?.slug || product.category?.name || "");
          const categoryMatches = effectiveCategories.includes(categorySlug);

          const sizeMatches =
            selectedSizes.length === 0 ||
            (product.sizes ?? []).some((size: string) => selectedSizes.includes(size));

          const colorMatches =
            selectedColors.length === 0 ||
            (product.colors ?? []).some((color: { name?: string }) => color?.name && selectedColors.includes(color.name));

          const effectivePrice = toNumber(product.discountPrice ?? product.price);
          const priceMatches = effectivePrice >= minPrice && effectivePrice <= maxPrice;

          const searchMatches =
            !searchTerm ||
            [product.title, product.description, product.shortDescription]
              .filter(Boolean)
              .some((value) => String(value).toLowerCase().includes(searchTerm));

          const saleMatches = !isSaleOnly || Boolean(product.discountPrice);

          return categoryMatches && sizeMatches && colorMatches && priceMatches && searchMatches && saleMatches;
        })
        .sort((left, right) => {
          if (sortValue === "price_asc") return toNumber(left.discountPrice ?? left.price) - toNumber(right.discountPrice ?? right.price);
          if (sortValue === "price_desc") return toNumber(right.discountPrice ?? right.price) - toNumber(left.discountPrice ?? left.price);
          if (sortValue === "popular") {
            if (left.featured && !right.featured) return -1;
            if (!left.featured && right.featured) return 1;
            const diff = toNumber(right.soldCount) - toNumber(left.soldCount);
            if (diff !== 0) return diff;
            return toNumber(right.viewCount) - toNumber(left.viewCount);
          }
          if (sortValue === "name_asc") return String(left.title).localeCompare(String(right.title));
          return new Date(String(right.createdAt)).getTime() - new Date(String(left.createdAt)).getTime();
        });
    }, [isSaleOnly, maxPrice, minPrice, products, searchTerm, effectiveCategories, selectedColors, selectedSizes, sortValue],
  );

  const getPageTitle = () => {
    if (searchTerm) return `Search Results for "${searchTerm}"`;
    if (isSaleOnly && effectiveCategories.length === allCategorySlugs.length) return "Sale Items";
    if (searchParams.get("sort") === "newest" && effectiveCategories.length === allCategorySlugs.length) return "New Arrivals";

    if (effectiveCategories.length === 0) return "Please Select a Category";
    if (effectiveCategories.length === allCategorySlugs.length && allCategorySlugs.length > 0) return "All Products";
    if (effectiveCategories.length === 1) {
      const cat = effectiveCategories[0];
      return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
    return "Filtered Selection";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-display-md font-display text-brand-black mb-4">{getPageTitle()}</h1>
        <p className="text-body-lg text-brand-charcoal max-w-2xl">
          Explore our complete collection of premium streetwear. Filter by category, size, and color to find exactly what you're looking for.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative">
        <FilterSidebar availableSizes={availableSizes} availableColors={availableColors} isNavigating={isNavigating} setIsNavigating={setIsNavigating} />

        <div className="flex-1 relative">
          {isNavigating && (
            <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-brand-lg cursor-wait">
              <div className="w-10 h-10 border-4 border-brand-sage border-t-transparent rounded-full animate-spin shadow-sm" />
            </div>
          )}

          <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-ivory-dark">
            <p className="text-sm text-brand-muted font-medium">Showing {filteredProducts.length} results</p>
            <SortDropdown isNavigating={isNavigating} setIsNavigating={setIsNavigating} />
          </div>

          <ProductGrid products={filteredProducts} className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-brand-muted">
                {effectiveCategories.length === 0 
                  ? "Please select a category from the sidebar to view products." 
                  : "No products found matching your filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}