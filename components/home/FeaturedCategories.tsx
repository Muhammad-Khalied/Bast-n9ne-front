"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../lib/animations";
import { useCategoryStore } from "../../store/categoryStore";
import { useSettings } from "../../hooks/useSettings";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEFAULT_CATEGORY_IMAGE } from "../../lib/constants";



export function FeaturedCategories() {
  const { categories, fetchCategories, isLoading: isCategoriesLoading } = useCategoryStore();
  const { settings, isLoading: isSettingsLoading } = useSettings();

  useEffect(() => {
    fetchCategories().catch(() => undefined);
  }, [fetchCategories]);

  if (isCategoriesLoading || isSettingsLoading) return <div className="h-64 flex items-center justify-center text-sm font-bold tracking-widest uppercase text-brand-muted">Loading collections...</div>;
  if (!categories.length) return null;

  const title = settings.explore_title || "Explore Collections";
  const subtitle = settings.explore_subtitle || "Curated selections for every occasion.";

  const displayCategories = categories;

  return (
    <section className="py-section px-4 md:px-8 w-full mx-auto relative group/section">
      <div className="flex justify-between items-end mb-10 max-w-[1600px] mx-auto">
        <div>
          <h2 className="text-heading-lg font-heading text-brand-black">{title}</h2>
          <p className="text-body-md text-brand-muted mt-2">{subtitle}</p>
        </div>
        <Link href="/products" className="text-sm font-semibold tracking-wide uppercase text-brand-sage hover:text-brand-sage-dark transition-colors hidden md:block">
          Shop All
        </Link>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full"
      >
        {displayCategories.map((category) => (
          <motion.div key={category.id} variants={fadeInUp} className="group relative aspect-[2/3] overflow-hidden bg-brand-ivory-light">
            <Link href={`/products?category=${category.slug}`} className="absolute inset-0 z-10 block" />
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[800ms] ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${category.image || DEFAULT_CATEGORY_IMAGE}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start justify-end h-full">
              <h3 className="text-heading-md font-heading text-brand-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">{category.name}</h3>
              <div className="overflow-hidden">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-sage transform translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                  Shop Collection
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
