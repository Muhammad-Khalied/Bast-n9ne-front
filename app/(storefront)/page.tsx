import { HeroBanner } from "../../components/home/HeroBanner";
import { FeaturedCategories } from "../../components/home/FeaturedCategories";
import { NewArrivals } from "../../components/home/NewArrivals";
import { BestSellers } from "../../components/home/BestSellers";
import { EditorialSection } from "../../components/home/EditorialSection";
import { TrustSignals } from "../../components/home/TrustSignals";

import { apiGet } from "../../lib/serverApi";

export default async function HomePage() {
  const [newArrivalsRes, bestSellersRes] = await Promise.all([
    apiGet("/products/new-arrivals"),
    apiGet("/products/best-sellers"),
  ]);

  const newArrivals = newArrivalsRes?.data ?? [];
  const bestSellers = bestSellersRes?.data ?? [];

  return (
    <div className="flex flex-col">
      <HeroBanner />
      <FeaturedCategories />
      <NewArrivals products={newArrivals} />
      <BestSellers products={bestSellers} />
      <EditorialSection />
      <TrustSignals />

    </div>
  );
}
