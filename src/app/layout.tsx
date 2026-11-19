import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

/*
 * The ROOT LAYOUT wraps every page. Anything here (header, footer, fonts)
 * appears site-wide and does not re-render when navigating between pages.
 *
 * next/font downloads the fonts at build time and serves them from our own
 * domain, which is faster and avoids layout shift while fonts load.
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });

export const metadata: Metadata = {
  title: {
    default: "Northstar Health: Find a doctor and book care",
    template: "%s | Northstar Health",
  },
  description:
    "Find Northstar Health doctors, compare specialties and locations, and book an appointment online. A fictional healthcare portfolio project.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        {/* Skip link: lets keyboard and screen reader users jump past the navigation */}
        <a
          href="#main"
          className="sr-only z-50 rounded-control bg-brand-900 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
