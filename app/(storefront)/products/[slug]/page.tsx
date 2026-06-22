import { ProductGallery } from "../../../../components/product/ProductGallery";
import { ProductInfo } from "../../../../components/product/ProductInfo";
import { RelatedProducts } from "../../../../components/product/RelatedProducts";
import { Breadcrumb } from "../../../../components/ui/Breadcrumb";
import { apiGet } from "../../../../lib/serverApi";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const productResponse = await apiGet(`/products/${params.slug}`);
  const product = productResponse?.data;

  if (!product) {
    notFound();
  }

  const relatedResponse = await apiGet(`/products/${params.slug}/related`);
  const related = relatedResponse?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: "Home", href: "/" },
            { label: product.category?.name || "Products", href: `/products?category=${product.category?.slug}` },
            { label: product.title, href: "#" },
          ]} 
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="sticky top-24 self-start">
          <ProductGallery images={product.media ?? []} />
        </div>
        <div>
          <ProductInfo product={product as any} />
          {related.length > 0 && <RelatedProducts products={related} />}
        </div>
      </div>
    </div>
  );
}
