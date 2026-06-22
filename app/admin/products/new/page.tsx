"use client";

import { ProductForm } from "../../../../components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Add New Product</h1>
        <p className="text-sm text-brand-muted">Fill in the details to publish a new piece to the collection</p>
      </div>
      <ProductForm />
    </div>
  );
}
