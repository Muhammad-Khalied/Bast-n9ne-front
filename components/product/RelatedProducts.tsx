"use client";

import { ProductGrid } from "./ProductGrid";
import { mockProducts } from "../../lib/mockData";

export function RelatedProducts({ products = mockProducts.slice(1, 4) }: { products?: any[] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="pt-16 mt-16 border-t border-brand-ivory-dark">
      <h2 className="text-heading-md font-heading text-brand-black mb-8">You may also like</h2>
      <ProductGrid products={products} className="grid gap-x-6 gap-y-10 grid-cols-2 md:grid-cols-3" />
    </section>
  );
}
