import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin — A&A Aviation",
  },
  robots: { index: false, follow: false },
};

// Independent root layout for /controller — a second root layout alongside
// app/(site)/layout.tsx (see Next's route-groups docs on "multiple root
// layouts"). Deliberately has no Navbar/Footer: the admin panel is its own
// application, not another page of the marketing site.
export default function ControllerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
