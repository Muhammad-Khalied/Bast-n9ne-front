"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { staggerContainer } from "../../lib/animations";

interface ProductGridProps {
  products: any[];
  className?: string;
}

export function ProductGrid({ products, className = "grid gap-x-6 gap-y-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }: ProductGridProps) {
  if (!products.length) return null;

  // Key changes when the product list changes, forcing React to remount
  // the motion container so every card gets a fresh stagger animation.
  const gridKey = products.map((p) => p.id).join(",");

  return (
    <motion.div 
      key={gridKey}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
