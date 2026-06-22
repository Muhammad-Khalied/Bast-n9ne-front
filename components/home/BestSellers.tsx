"use client";

import Link from "next/link";
import { ProductGrid } from "../product/ProductGrid";
import { mockProducts } from "../../lib/mockData";

export function BestSellers({ products = mockProducts }: { products?: any[] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="py-section px-4 md:px-8 max-w-7xl mx-auto bg-brand-ivory-light/50 rounded-brand-xl my-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-heading-lg font-heading text-brand-black">Best Sellers</h2>
          <p className="text-body-md text-brand-muted mt-2">Our most loved pieces.</p>
        </div>
        <Link href="/products?sort=popular" className="text-sm font-semibold tracking-wide uppercase text-brand-sage hover:text-brand-sage-dark transition-colors hidden md:block">
          Shop All
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
