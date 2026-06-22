import { Metadata } from 'next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
}

export function generateSEO({
  title = 'Bast n9ne',
  description = 'Premium streetwear and fashion. Discover curated collections of modern clothing.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  noindex = false,
}: SEOHeadProps = {}): Metadata {
  const fullTitle = title === 'Bast n9ne' ? title : `${title} | Bast n9ne`;

  return {
    title: fullTitle,
    description,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      type: type === 'product' ? 'website' : type,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
      ...(url && { url }),
      siteName: 'Bast n9ne',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
  };
}

// Client-side SEO component for dynamic pages
export default function SEOHead(_props: SEOHeadProps) {
  // In Next.js App Router, SEO is handled via generateMetadata/generateSEO above.
  // This component exists for compatibility — use generateSEO() in page-level generateMetadata.
  return null;
}
