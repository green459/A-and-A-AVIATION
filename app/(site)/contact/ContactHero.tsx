"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { ContactPageHero } from "@/lib/data/settings";
import {
  LIGHT_HERO_OVERLAY,
  LIGHT_HERO_SUBTEXT_SHADOW,
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

export default function ContactHero({ hero }: { hero: ContactPageHero }) {
  return (
    <section className="relative isolate max-h-9/12 overflow-hidden">
      {/* --- Background: airplane-window shot --- */}
      <Image
        src={hero.image}
        alt="Contact us Image"
        fill
        priority
        sizes="50vw"
        className="-z-20 object-cover"
      />

      {/* --- Window-frame vignette (light edges — this hero's text is
          navy, so lightening the photo keeps it readable instead of the
          dark vignette used on white/gold-text heroes) --- */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{ background: LIGHT_HERO_OVERLAY }}
      />

      {/* ================= HERO CONTENT ================= */}
      <motion.div
        className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 pb-24 pt-8 text-center"
        initial="hidden"
        animate="visible"
        variants={heroContainer}
      >
        {hero.eyebrow && (
          <motion.p
            variants={heroItem}
            style={{ color: hero.titleColor, ...LIGHT_HERO_SUBTEXT_SHADOW }}
            className="font-condensed text-base font-medium tracking-wide opacity-90 sm:text-lg"
          >
            {hero.eyebrow}
          </motion.p>
        )}
        {/* Title */}
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
            style={{ color: hero.titleColor, ...LIGHT_HERO_SUBTEXT_SHADOW }}
            className="font-condensed mt-5 max-w-2xl text-lg font-medium opacity-90 sm:text-xl"
          >
            {hero.subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
