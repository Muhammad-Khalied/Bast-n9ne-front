"use client";

import { ProductForm } from "../../../../../components/admin/ProductForm";

interface PageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: PageProps) {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Edit Product</h1>
        <p className="text-sm text-brand-muted">ID: {params.id}</p>
      </div>
      <ProductForm productId={params.id} />
    </div>
  );
}
