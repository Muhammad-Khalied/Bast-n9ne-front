// @ts-ignore: allow side-effect CSS import without type declarations
import "../styles/globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "../features/auth/AuthProvider";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Bast n9ne",
  description: "Bast n9ne - Premium Fashion Brand",
  icons: {
    icon: "/bast_n9ne_icon.svg",
  },
  openGraph: {
    title: "Bast n9ne",
    description: "Premium Fashion Brand",
    images: ["/bast_n9ne_icon.svg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-ivory text-brand-charcoal font-body overflow-x-hidden max-w-[100vw]">
        <NextTopLoader 
          color="#7c8c6c"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #7c8c6c,0 0 5px #7c8c6c"
          zIndex={1600}
          showAtBottom={false}
        />
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
