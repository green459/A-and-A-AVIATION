"use client";
import Contact from "@/components/Contact";
import Image from "next/image";
import Link from "next/link";

import { motion, type Variants } from "framer-motion";
import type { PublicService } from "@/lib/data/services";
import type {
  ContactInfo,
  ContactFormFieldsSettings,
  ServicesHero,
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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

export default function ServicesPageClient({
  services,
  hero,
  contactInfo,
  serviceCategories,
  contactFormFields,
  termsEnabled,
  refundEnabled,
}: {
  services: PublicService[];
  hero: ServicesHero;
  contactInfo: ContactInfo;
  serviceCategories: string[];
  contactFormFields: ContactFormFieldsSettings;
  termsEnabled: boolean;
  refundEnabled: boolean;
}) {
  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center bg-sky">
      {/* ================= HERO ================= */}
      <section className="relative isolate max-h-9/12 overflow-hidden">
        {/* --- Background: airplane-window shot --- */}
        <Image
          src={hero.image}
          alt="Our Services Image"
          fill
          priority
          sizes="50vw"
          className="-z-20 object-cover"
        />

        {/* --- Window-frame vignette (dark edges like the mockup) --- */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{ background: DARK_HERO_OVERLAY }}
        />

        {/* ================= HERO CONTENT ================= */}
        <motion.div
          className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 pb-24 pt-8 text-center"
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          {/* Eyebrow */}
          <motion.p
            variants={heroItem}
            style={DARK_HERO_SUBTEXT_SHADOW}
            className="font-condensed text-base font-medium tracking-wide text-white/90 sm:text-lg"
          >
            {hero.eyebrow}
          </motion.p>

          {/* Title */}
          <motion.h1
            variants={heroTitle}
            style={heroTitleStyle(hero.titleColor, hero.shadowColor)}
            className="font-display mt-4 text-[clamp(2rem,11vw,9rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] sm:tracking-[0.04em]"
          >
            {hero.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroItem}
            style={DARK_HERO_SUBTEXT_SHADOW}
            className="font-condensed mt-5 max-w-2xl text-lg font-medium text-white sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="bg-sky py-20 sm:py-24">
        <div className="mx-auto grid max-w-340 grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-body text-xs text-muted">{service.category}</p>
                <h3 className="font-display mt-2 text-2xl text-navy">{service.title}</h3>
                <p className="font-condensed mt-2 flex-1 text-sm leading-relaxed text-navy-deep/70">
                  {service.tagline}
                </p>
                <span className="font-body group mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-navy">
                  Learn More
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
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
