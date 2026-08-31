"use client";

import Image from "next/image";
import Link from "next/link";
import { FlightPathDivider } from "./Home";
import dreamsShape from "./images/dreams-shape.png";
import dreamsBg from "./images/dreams-bg.png";

export default function DreamBanner() {
  return (
    <section className="relative bg-sky">
      {/* Banner photo, with the mountain-ridge shape overlapping its
                    bottom edge (same torn-edge technique as Air Ticketing). The
                    shared Footer (components/Footer.tsx) continues the same
                    bg-sky background below it. */}
      <div className="relative aspect-1920/730 w-full overflow-hidden">
        <Image
          src={dreamsBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <FlightPathDivider
          positionClassName="top-[54%] h-20 sm:top-[52%] sm:h-28"
          lineColor="var(--color-gold)"
          planeColor="var(--color-gold)"
          duration="11s"
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 pb-16 text-center">
          <h2
            className={`font-display text-[clamp(2.2rem,7vw,6rem)] font-normal leading-[0.95]`}
          >
            <span className="text-navy">Let&apos;s Turn Dreams</span>
            <br />
            <span className="text-ink">Into Destinations</span>
          </h2>
          <div className="mt-6 flex items-center justify-center sm:mt-10">
            <Link
              href="/services"
              className={`font-display group inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-navy shadow-gold-sm transition hover:bg-gold-hover sm:px-8 sm:py-4`}
            >
              Booking Today
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  d="M4 12 L12 4 M6 4h6v6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Mountain-ridge shape overlapping the bottom of the banner photo */}
      <div className="relative -mt-[5.9%] aspect-1920/199 w-full">
        <Image
          src={dreamsShape}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    </section>
  );
}
