"use client";

import { CategoryForm } from "../../../../../components/admin/CategoryForm";

interface PageProps {
  params: { id: string };
}

export default function EditCategoryPage({ params }: PageProps) {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Edit Category</h1>
        <p className="text-sm text-brand-muted">ID: {params.id}</p>
      </div>
      <CategoryForm categoryId={params.id} />
    </div>
  );
}
