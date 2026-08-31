"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import Contact from "@/components/Contact";
import DreamBanner from "@/components/home/DreamBanner";
import AnimatedStatValue from "@/components/AnimatedStatValue";
import { getAboutValueIcon } from "@/lib/data/icons";
import {
  DARK_HERO_OVERLAY,
  DARK_HERO_SUBTEXT_SHADOW,
  heroTitleStyle,
} from "@/components/home/hero-effects";
import type {
  HomeStat,
  HomePartner,
  ContactInfo,
  AboutHero,
  AboutStory,
  AboutValues,
  AboutProcess,
} from "@/lib/data/settings";
import iataBadge from "@/components/home/images/partners/iata-badge.png";

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

export default function AboutPageClient({
  stats,
  partners,
  contactInfo,
  serviceCategories,
  hero,
  story,
  values,
  process,
}: {
  stats: HomeStat[];
  partners: HomePartner[];
  contactInfo: ContactInfo;
  serviceCategories: string[];
  hero: AboutHero;
  story: AboutStory;
  values: AboutValues;
  process: AboutProcess;
}) {
  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center bg-sky">
      {/* ================= HERO ================= */}
      <section className="relative isolate max-h-9/12 overflow-hidden">
        <Image
          src={hero.image}
          alt="Hillside town overlooking the coast"
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
          <motion.p
            variants={heroItem}
            style={DARK_HERO_SUBTEXT_SHADOW}
            className="font-condensed text-base font-medium tracking-wide text-white/90 sm:text-lg"
          >
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            variants={heroTitle}
            style={heroTitleStyle(hero.titleColor, hero.shadowColor)}
            className="font-display mt-4 text-[clamp(2rem,11vw,9rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] sm:tracking-[0.04em]"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            variants={heroItem}
            style={DARK_HERO_SUBTEXT_SHADOW}
            className="font-condensed mt-5 max-w-2xl text-lg font-medium text-white sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="bg-sky py-20 sm:py-24">
        <div className="mx-auto grid max-w-340 grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-condensed text-base font-medium text-teal sm:text-lg">
              {story.label}
            </p>
            <h2 className="font-display mt-3 text-4xl font-normal leading-tight text-navy sm:text-5xl">
              {story.title}
            </h2>
            <p className="font-condensed mt-5 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
              {story.paragraph1}
            </p>
            <p className="font-condensed mt-4 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
              {story.paragraph2}
            </p>
            <Link
              href={story.ctaHref}
              className="font-display group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-navy transition hover:bg-gold-hover"
            >
              {story.ctaLabel}
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

          <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-card-xl sm:h-96 lg:h-112">
            <Image
              src={story.image}
              alt="Riverside city skyline"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-navy-section py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 px-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display block text-5xl font-bold text-gold sm:text-6xl">
                <AnimatedStatValue value={stat.value} />
              </span>
              <span className="font-body mt-2 block text-sm font-semibold text-white/80 sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-sky py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-condensed text-base font-medium text-teal sm:text-lg">
            {values.sectionLabel}
          </p>
          <h2 className="font-display mt-3 text-4xl font-normal text-navy sm:text-5xl lg:text-6xl">
            {values.sectionTitle}
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-340 grid-cols-1 gap-6 px-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {values.items.map((value) => {
            const ValueIcon = getAboutValueIcon(value.icon);
            return (
              <div
                key={value.title}
                className="rounded-2xl bg-white p-8 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky text-navy">
                  <ValueIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display mt-5 text-xl text-navy">
                  {value.title}
                </h3>
                <p className="font-condensed mt-2 text-sm leading-relaxed text-navy-deep/70">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW WE WORK ================= */}
      <section className="bg-navy-section py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-condensed text-base font-medium text-white/80 sm:text-lg">
            {process.sectionLabel}
          </p>
          <h2 className="font-display mt-3 text-4xl font-normal text-white sm:text-5xl lg:text-6xl">
            {process.sectionTitle}
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-340 grid-cols-1 gap-6 px-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {process.items.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10"
            >
              <span className="font-display text-4xl font-bold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-xl text-white">
                {item.title}
              </h3>
              <p className="font-condensed mt-2 text-sm leading-relaxed text-white/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRUSTED PARTNERS ================= */}
      <section className="bg-sky py-20 sm:py-24">
        <div className="mx-auto grid max-w-340 grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
          <div className="max-w-sm">
            <p className="font-condensed text-base font-medium text-navy sm:text-lg">
              Our Partners
            </p>
            <h2 className="font-display mt-3 text-4xl font-normal leading-tight text-navy sm:text-5xl">
              Working With Names You Trust
            </h2>
            <p className="font-condensed mt-5 text-sm leading-relaxed text-navy-deep/80">
              Direct partnerships with global airlines and hotel groups mean
              better fares, faster confirmations and reliable service for
              every booking we make.
            </p>
            <div className="relative mt-8 h-8 w-52">
              <Image
                src={iataBadge}
                alt="IATA Accredited Agent"
                fill
                sizes="208px"
                className="object-contain object-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {partners.map((logo) => (
              <div
                key={logo.name}
                className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-white p-6 shadow-card sm:h-36 sm:w-36"
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  fill
                  sizes="144px"
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact contactInfo={contactInfo} serviceCategories={serviceCategories} />
      <DreamBanner />
    </div>
  );
}
