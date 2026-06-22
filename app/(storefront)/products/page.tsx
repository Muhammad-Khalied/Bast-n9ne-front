import { apiGet } from "../../../lib/serverApi";
import { ProductsCatalog } from "../../../components/product/ProductsCatalog";

export const dynamic = "force-dynamic";

const MAX_PRODUCT_PAGE_SIZE = 100;

const fetchAllProducts = async () => {
  const firstResponse = await apiGet(`/products?perPage=${MAX_PRODUCT_PAGE_SIZE}`);
  const firstPageProducts = firstResponse?.data?.products ?? [];
  const totalPages = firstResponse?.meta?.totalPages ?? 1;

  if (totalPages <= 1) {
    return firstPageProducts;
  }

  const remainingResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_value, index) =>
      apiGet(`/products?page=${index + 2}&perPage=${MAX_PRODUCT_PAGE_SIZE}`),
    ),
  );

  return [
    ...firstPageProducts,
    ...remainingResponses.flatMap((response) => response?.data?.products ?? []),
  ];
};

export default async function ProductsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const allProducts = await fetchAllProducts();
  return (
    <ProductsCatalog products={allProducts} />
  );
}
