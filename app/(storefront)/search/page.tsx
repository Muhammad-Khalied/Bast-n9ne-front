import { ProductGrid } from "../../../components/product/ProductGrid";
import { EmptyState } from "../../../components/shared/EmptyState";
import { apiGet } from "../../../lib/serverApi";

interface PageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const term = searchParams.q ?? "";
  const response = term ? await apiGet(`/search?q=${encodeURIComponent(term)}`) : null;
  const products = response?.data ?? [];

  if (!term) {
    return <EmptyState title="Search for products" description="Use the search bar to find items." />;
  }

  if (!products.length) {
    return <EmptyState title="No results found" description="Try a different keyword." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-heading-lg font-heading">Results for "{term}"</h1>
      <ProductGrid products={products} />
    </div>
  );
}
