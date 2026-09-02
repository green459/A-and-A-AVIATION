import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Philosopher,
  DM_Sans,
  Sofia_Sans_Semi_Condensed,
} from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getServices } from "@/lib/data/services";
import {
  getContactInfo,
  getSocialLinks,
  getFooterGallery,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Brand fonts — loaded once here, exposed to every page/component through
   the font-display / font-body / font-condensed utilities (see globals.css). */
const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sofiaSans = Sofia_Sans_Semi_Condensed({
  variable: "--font-sofia",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Set NEXT_PUBLIC_SITE_URL in production to the real deployed domain —
// this is only a placeholder fallback for absolute URLs (OG images, sitemap).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaaviation.com";
const siteDescription =
  "Professional travel and visa services — air ticketing, visa processing, hotel reservations and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "A&A Aviation — Global Travel & Visa Solutions",
    template: "%s | A&A Aviation",
  },
  description: siteDescription,
  openGraph: {
    title: "A&A Aviation — Global Travel & Visa Solutions",
    description: siteDescription,
    siteName: "A&A Aviation",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [services, contact, social, footerGallery, terms, refund] = await Promise.all([
    getServices(),
    getContactInfo(),
    getSocialLinks(),
    getFooterGallery(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${philosopher.variable} ${dmSans.variable} ${sofiaSans.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar services={services} phone={contact.phone} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer
          contact={contact}
          social={social}
          gallery={footerGallery}
          legal={{ termsEnabled: terms.enabled, refundEnabled: refund.enabled }}
        />
        <FloatingActions whatsapp={contact.whatsapp} />
      </body>
    </html>
  );
}
