import Image from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Bast n9ne",
  description: "Discover the story behind Bast n9ne, redefining modern luxury streetwear.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-brand-ivory">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-overline text-brand-sage uppercase tracking-widest mb-4">
            Our Story
          </p>
          <h1 className="text-display-lg font-display text-brand-black mb-6">
            BORN FROM THE STREETS.<br /> CRAFTED FOR LUXURY.
          </h1>
          <p className="text-body-lg text-brand-charcoal">
            Bast n9ne was founded with a singular vision: to bridge the gap between everyday comfort and high-end fashion. We believe that streetwear is not just a style, but a culture that demands the finest materials and meticulous craftsmanship.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-section bg-brand-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-[4/5] bg-brand-ivory-light">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550614000-4b95d4662dcd?q=80&w=1000&auto=format&fit=crop")' }}
              />
            </div>
            <div className="flex flex-col justify-center max-w-lg">
              <h2 className="text-display-md font-display text-brand-black mb-6">
                THE DESIGN PHILOSOPHY
              </h2>
              <div className="space-y-6 text-body-md text-brand-charcoal">
                <p>
                  Every piece in the Bast n9ne collection is a testament to our dedication to quality. We source only the finest fabrics, focusing on durability, breathability, and weight.
                </p>
                <p>
                  Our silhouettes are designed to empower. Whether you're navigating the city streets or attending a gallery opening, our garments provide the perfect foundation for self-expression.
                </p>
                <p>
                  We don't follow trends; we refine the basics until they become timeless staples in your wardrobe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-section-lg bg-brand-black text-brand-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-display-md font-display mb-16">OUR CORE VALUES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h3 className="text-heading-sm font-heading mb-4 uppercase tracking-widest text-brand-sage">Authenticity</h3>
              <p className="text-brand-muted text-sm leading-relaxed">Staying true to our roots while constantly evolving our aesthetic and techniques.</p>
            </div>
            <div>
              <h3 className="text-heading-sm font-heading mb-4 uppercase tracking-widest text-brand-sage">Quality</h3>
              <p className="text-brand-muted text-sm leading-relaxed">No compromises. From the stitching to the packaging, every detail matters.</p>
            </div>
            <div>
              <h3 className="text-heading-sm font-heading mb-4 uppercase tracking-widest text-brand-sage">Sustainability</h3>
              <p className="text-brand-muted text-sm leading-relaxed">Creating pieces that last a lifetime, reducing the need for fast fashion.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
