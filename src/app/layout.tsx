import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { CartMenu } from "@/modules/cart";
import { CatalogHeaderLink } from "@/modules/catalog";
import { site } from "@/shared/config/site";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { WebVitals } from "@/shared/ui/web-vitals";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  robots: site.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    siteName: site.name,
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${fraunces.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <ThemeProvider>
          <SiteHeader cart={<CartMenu />} catalog={<CatalogHeaderLink />} />
          <Toaster
            position="bottom-center"
            closeButton
            toastOptions={{ closeButtonAriaLabel: "Cerrar" }}
          />
        </ThemeProvider>
        <main id="contenido" className="flex-1">
          {children}
          {modal}
        </main>
        <SiteFooter />
        <WebVitals />
      </body>
    </html>
  );
}
