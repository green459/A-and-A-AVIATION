"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

import Contact from "@/components/Contact";
import type { PublicDestination } from "@/lib/data/destinations";
import type {
  ContactInfo,
  ContactFormFieldsSettings,
  DestinationsHero,
} from "@/lib/data/settings";
import {
  DARK_HERO_OVERLAY,
  DARK_HERO_SUBTEXT_SHADOW,
  heroTitleStyle,
} from "@/components/home/hero-effects";

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};
const heroTitle: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function DestinationsPageClient({
  destinations,
  hero,
  contactInfo,
  serviceCategories,
  contactFormFields,
  termsEnabled,
  refundEnabled,
}: {
  destinations: PublicDestination[];
  hero: DestinationsHero;
  contactInfo: ContactInfo;
  serviceCategories: string[];
  contactFormFields: ContactFormFieldsSettings;
  termsEnabled: boolean;
  refundEnabled: boolean;
}) {
  const [activeRegion, setActiveRegion] = useState("All");

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(destinations.map((d) => d.region)))],
    [destinations],
  );

  const filteredDestinations = useMemo(
    () =>
      activeRegion === "All"
        ? destinations
        : destinations.filter((d) => d.region === activeRegion),
    [destinations, activeRegion],
  );

  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center bg-sky">
      {/* ================= HERO ================= */}
      <section className="relative isolate max-h-9/12 overflow-hidden">
        <Image
          src={hero.image}
          alt="Traveler looking out over a mountain landscape"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{ background: DARK_HERO_OVERLAY }}
        />
        <motion.div
          className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 pb-24 pt-8 text-center"
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          {hero.eyebrow && (
            <motion.p
              variants={heroItem}
              style={DARK_HERO_SUBTEXT_SHADOW}
              className="font-condensed text-base font-medium tracking-wide text-white/90 sm:text-lg"
            >
              {hero.eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={heroTitle}
            style={heroTitleStyle(hero.titleColor, hero.shadowColor)}
            className="font-display mt-4 text-[clamp(2rem,11vw,9rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] sm:tracking-[0.04em]"
          >
            {hero.title}
          </motion.h1>
          {hero.subtitle && (
            <motion.p
              variants={heroItem}
              style={DARK_HERO_SUBTEXT_SHADOW}
              className="font-condensed mt-5 max-w-2xl text-lg font-medium text-white sm:text-xl"
            >
              {hero.subtitle}
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* ================= DESTINATIONS GRID ================= */}
      <section className="bg-sky py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8">
          {/* Region filter */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setActiveRegion(region)}
                className={`font-body rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  activeRegion === region
                    ? "bg-navy text-white"
                    : "bg-white text-navy-deep/70 hover:text-navy"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <p className="font-condensed mt-6 text-center text-sm text-navy-deep/60">
            Showing {filteredDestinations.length} of {destinations.length}{" "}
            destinations
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.slug}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.country}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="font-body absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {destination.region}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl text-navy">
                    {destination.country}
                  </h3>
                  <p className="font-condensed mt-1 text-sm font-semibold text-navy-deep/70">
                    {destination.tagline}
                  </p>
                  <p className="font-condensed mt-3 flex-1 text-sm leading-relaxed text-navy-deep/70">
                    {destination.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {destination.popularFor.map((tag) => (
                      <span
                        key={tag}
                        className="font-body rounded-full bg-sky px-3 py-1 text-xs font-semibold text-navy"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="font-body group/link mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-navy"
                  >
                    Get Visa Support
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact
        contactInfo={contactInfo}
        serviceCategories={serviceCategories}
        phoneFieldEnabled={contactFormFields.phoneFieldEnabled}
        termsEnabled={termsEnabled}
        refundEnabled={refundEnabled}
      />
    </div>
  );
}
