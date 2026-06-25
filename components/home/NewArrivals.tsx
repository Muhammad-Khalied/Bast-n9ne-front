"use client";

import Link from "next/link";
import { ProductGrid } from "../product/ProductGrid";
import { mockProducts } from "../../lib/mockData";

export function NewArrivals({ products = mockProducts }: { products?: any[] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="py-section px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10 px-2 sm:px-0">
        <div>
          <h2 className="text-heading-lg font-heading text-brand-black">New Arrivals</h2>
          <p className="text-body-md text-brand-muted mt-2">The latest drops from our collection.</p>
        </div>
        <Link href="/products?sort=newest" className="text-sm font-semibold tracking-wide uppercase text-brand-sage hover:text-brand-sage-dark transition-colors hidden md:block">
          Shop All
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
