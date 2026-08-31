"use client";

import { useEffect, useState } from "react";

/** The floating WhatsApp CTA + "scroll to top" button, shared across every
 * public page via app/(site)/layout.tsx — previously only rendered on the
 * homepage since it lived inside components/home/Home.tsx. */
export default function FloatingActions({ whatsapp }: { whatsapp: string }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating WhatsApp CTA */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-4 z-50 block h-16 w-16 transition hover:scale-105 sm:bottom-8 sm:right-6 sm:h-20 sm:w-20"
      >
        {/* Plain <img>, not next/image: the optimizer rejects local SVGs
            unless dangerouslyAllowSVG is set, and a vector needs no
            raster optimization anyway. */}
        <img
          src="/assets/WhatsApp-Logo.wine.svg"
          alt="WhatsApp"
          className="h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
        />
      </a>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll back to top"
        className={`fixed bottom-24 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white shadow-float-sm transition hover:scale-105 hover:bg-navy-hover sm:bottom-32 sm:right-8 sm:h-11 sm:w-11 ${
          showScrollTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
          <path
            d="M8 12.5V3.5M3.5 8L8 3.5 12.5 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
