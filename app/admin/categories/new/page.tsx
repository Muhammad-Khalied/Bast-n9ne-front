"use client";

import { CategoryForm } from "../../../../components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Add Category</h1>
        <p className="text-sm text-brand-muted">Create a new product category</p>
      </div>
      <CategoryForm />
    </div>
  );
}
