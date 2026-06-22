import { ProductGrid } from "../../../../components/product/ProductGrid";
import { EmptyState } from "../../../../components/shared/EmptyState";
import { apiGet } from "../../../../lib/serverApi";

interface PageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const response = await apiGet(`/categories/${params.slug}`);
  const category = response?.data;

  if (!category) {
    return <EmptyState title="Category not found" />;
  }

  const products = category.products ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-heading-lg font-heading">{category.name}</h1>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState title="No products in this category" />
      )}
    </div>
  );
}
