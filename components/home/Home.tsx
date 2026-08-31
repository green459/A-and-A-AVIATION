"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedStatValue from "@/components/AnimatedStatValue";
import {
  easeInOut,
  easeOut,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
const MotionLink = motion.create(Link);

/* Hero entrance — plays on mount. */
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

import heroBg from "./images/hero-bg.png";
import airTicketingBg from "./images/air-ticketing-bg.png";
import airTicketingShape from "./images/air-ticketing-shape.png";
import servicesShape from "./images/services-mountain-navy.png";
import iataBadge from "./images/partners/iata-badge.png";
import snowyMountains from "./images/snowy-mountains.png";
import Contact from "../Contact";
import DreamBanner from "./DreamBanner";
import type { PublicBlogPost } from "@/lib/data/blogs";
import type {
  ContactInfo,
  HomeHero,
  HomeStat,
  HomeTestimonial,
  HomePartner,
  HomeGalleryImage,
  HomeVisaCard,
  HomeTicketCard,
  HomeServiceCard,
  HomePeopleGalleryImage,
  ContactFormFieldsSettings,
} from "@/lib/data/settings";

/* ---------------- Fonts ----------------
   Brand fonts (Philosopher, DM Sans, Sofia) are loaded once in
   app/layout.tsx and exposed here as font-display / font-body /
   font-condensed utilities. */

const FLIGHT_PATH_D = "M0 285C240 120 710 -90 948 90C1200 290 1660 70 1920 10";
const FLIGHT_PATH_VIEWBOX = { width: 1920, height: 286 };
const PLANE_PATH_D =
  "M7.33396 4.17636C7.45426 4.13704 12.818 6.69533 17.0989 8.75261C17.3917 8.60072 17.6359 8.47453 17.6359 8.47453L17.7515 7.86583L19.9746 6.71269L20.8557 8.41136L18.7064 9.52594C19.5174 9.91648 20.2442 10.2668 20.8323 10.5506C23.2388 9.39148 27.8894 7.16513 28.7167 6.88043C29.8415 6.49314 31.6232 6.35225 31.7687 6.70829C31.9142 7.06433 30.7987 8.46494 30.0771 9.11408C29.5306 9.60549 24.4693 12.3263 22.009 13.6359C21.9044 14.363 21.7798 15.2196 21.6429 16.153L24.1868 14.833L25.0679 16.5316L22.8448 17.6847L22.2809 17.4285C22.2809 17.4285 21.8052 17.6756 21.3862 17.8922C20.6341 22.949 19.6766 29.0734 19.4371 29.1505C19.0289 29.2826 17.6936 28.7031 17.6936 28.7031L17.2951 23.9982C16.8905 24.1746 16.5683 24.2462 16.5217 24.157C16.469 24.056 16.7898 23.7839 17.2545 23.5253L17.0546 21.1647C16.7379 21.2859 16.5016 21.3247 16.4623 21.2498C16.4171 21.1624 16.6517 20.9458 17.017 20.7216L16.6223 16.0593L11.0076 18.5738L9.95864 24.525L8.51257 24.957L7.7488 20.299L8.82018 19.2301C8.82018 19.2301 7.42778 19.9138 7.27917 19.549C7.13055 19.1841 8.27467 18.3694 8.27467 18.3694L7.03592 18.6142L3.52838 15.6082L5.02064 14.031L10.3113 16.8719L15.44 13.6094L12.282 11.0553C11.7864 11.2991 11.3597 11.412 11.3056 11.3083C11.2583 11.2173 11.5141 10.9866 11.9068 10.7524L10.0688 9.26554C10.059 9.27017 10.0499 9.27573 10.04 9.28036C9.5029 9.55925 9.02103 9.69543 8.96284 9.58449C8.91094 9.48361 9.22638 9.21427 9.68663 8.95754L6.25868 6.18463C6.25868 6.18463 7.13212 4.24145 7.33396 4.17636Z";
// The artwork's own nose points ~22° above its local +X axis. That's the
// offset a naive rotation lines up against.
const PLANE_NOSE_OFFSET_DEG = -22;

/* Dashed flight path + plane, used above the card marquees and across the
   "Booking Today" banner. Full width (0 to 1920, matching the viewBox).
   The container's height varies per usage (h-20 to h-36) and the SVG uses
   preserveAspectRatio="none" to stretch to fill it — which means the path
   is scaled non-uniformly (scaleX != scaleY). SMIL's `rotate="auto"`
   computes its angle in the *pre-stretch* viewBox space, so it doesn't
   account for that non-uniform scale, and the plane's nose visibly drifts
   off the dashed line's actual on-screen direction (worse the more
   elongated the container is). So position/rotation are driven by a rAF
   loop instead: it samples the real path's tangent at the plane's current
   point, corrects that tangent for the container's actual measured
   scaleX/scaleY (via ResizeObserver), and sets rotation from the result —
   keeping the nose genuinely tangent to the visible line at any aspect
   ratio. */
export function FlightPathDivider({
  positionClassName = "top-0 h-20 sm:h-28",
  lineColor = "var(--color-line)",
  planeColor = "var(--color-navy)",
  duration = "9s",
}: {
  positionClassName?: string;
  lineColor?: string;
  planeColor?: string;
  duration?: string;
}) {
  const pathId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!svg || !path || !plane) return;

    const durationMs = parseFloat(duration) * 1000;
    const totalLength = path.getTotalLength();
    const SAMPLE_DELTA = Math.max(1, totalLength * 0.002);

    let scaleX = 1;
    let scaleY = 1;
    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0) scaleX = rect.width / FLIGHT_PATH_VIEWBOX.width;
      if (rect.height > 0) scaleY = rect.height / FLIGHT_PATH_VIEWBOX.height;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);

    let raf = 0;
    let startTime: number | null = null;
    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const t = ((now - startTime) % durationMs) / durationMs;
      const len = t * totalLength;
      const behind = path.getPointAtLength(Math.max(0, len - SAMPLE_DELTA));
      const ahead = path.getPointAtLength(
        Math.min(totalLength, len + SAMPLE_DELTA),
      );
      const here = path.getPointAtLength(len);
      // Correct the tangent for the container's actual non-uniform stretch
      // before taking its angle, so it matches the visible dashed line.
      const dx = (ahead.x - behind.x) * scaleX;
      const dy = (ahead.y - behind.y) * scaleY;
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      plane.setAttribute(
        "transform",
        `translate(${here.x} ${here.y}) rotate(${angleDeg - PLANE_NOSE_OFFSET_DEG})`,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [duration]);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${positionClassName}`}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${FLIGHT_PATH_VIEWBOX.width} ${FLIGHT_PATH_VIEWBOX.height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          ref={pathRef}
          id={pathId}
          d={FLIGHT_PATH_D}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
        />
        <g ref={planeRef}>
          <g transform="translate(-19,-16.5)">
            <path d={PLANE_PATH_D} fill={planeColor} />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* One gallery tile — the 5 photos right below the hero. Positioned by
   scroll progress through the section (0 = closed/fanned like a stack of
   photos, matching the reference: rotated outward and dropped down the
   further a tile is from the center one; 1 = open, sitting in its normal
   grid spot). `progress` is shared across every tile so the whole row
   reads as one fan opening from the middle outward, and folds shut again
   on the way back up since it tracks scroll position rather than firing
   once. */
function GalleryTile({
  img,
  index,
  total,
  progress,
}: {
  img: HomeGalleryImage;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const galleryCenter = (total - 1) / 2;
  const delta = galleryCenter - index;
  const x = useTransform(progress, [0, 1], [delta * 170, 0]);
  const y = useTransform(progress, [0, 1], [Math.abs(delta) * 26, 0]);
  const rotate = useTransform(progress, [0, 1], [delta * -14, 0]);
  const scale = useTransform(progress, [0, 1], [1 - Math.abs(delta) * 0.06, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, zIndex: 10 - Math.abs(delta) }}
      className={`relative h-56 overflow-hidden rounded-sm sm:h-64 lg:h-80 ${
        index === total - 1 ? "col-span-2 sm:col-span-1" : ""
      }`}
    >
      <Image
        src={img.image}
        alt={img.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
    </motion.div>
  );
}

/* Travel Insights cards — the sticky stack itself (see section markup) has
   no easing, and the covering motion is easy to miss while scrolling fast.
   So each card is driven by two scroll windows on the same element:
   `approach` runs from when the card enters the viewport until its top
   reaches the sticky lock position — the card gently zooms in (0.94 → 1)
   as it travels up, with the zoom fully reset exactly when it locks at
   the top. `cover` runs from the lock until it scrolls away — the card
   eases itself down (scale + fade) as the next card covers it. Both are
   direct, eased functions of scroll position, so the motion is visible at
   any scroll speed and settles smoothly at normal speeds. */
function InsightCard({
  post,
  index,
  total,
}: {
  post: PublicBlogPost;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stickyTop = 96 + index * 44;
  const isLast = index === total - 1;

  const { scrollYProgress: approach } = useScroll({
    target: ref,
    offset: ["start end", `start ${stickyTop}px`],
  });
  const { scrollYProgress: cover } = useScroll({
    target: ref,
    offset: [`start ${stickyTop}px`, "end end"],
  });

  // Zoom in as the card climbs toward its lock point; the eased cover
  // squash then takes over while the next card slides over it.
  const scale = useTransform([approach, cover], ([a, c]) => {
    const zoom = 0.94 + 0.06 * easeOut(a as number);
    const coverDown = isLast ? 1 : 1 - 0.07 * easeInOut(c as number);
    return zoom * coverDown;
  });
  const opacity = useTransform(cover, [0, 0.5, 1], [1, 1, isLast ? 1 : 0.85], {
    ease: easeInOut,
  });

  return (
    <div
      ref={ref}
      className="sticky mb-6 last:mb-0 sm:mb-8"
      style={{ top: `${stickyTop}px`, zIndex: index + 1 }}
    >
      <motion.div style={{ scale, opacity }}>
        <article className="grid rounded-3xl bg-white shadow-card-xl lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <div
              className={`font-body flex items-center gap-2 text-sm text-navy-deep`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy-deep" />
              {post.date}
            </div>
            <h3
              className={`font-display mt-4 text-2xl leading-snug text-navy sm:text-3xl`}
            >
              {post.title}
            </h3>
            <Link
              href={`/blogs/${post.slug}`}
              className={`font-body group mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-navy`}
            >
              Read More
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
            </Link>
          </div>

          <div className="relative h-64 p-4 sm:h-80 sm:p-6 lg:h-auto lg:min-h-70 lg:py-6 lg:pl-0 lg:pr-6">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
}

export default function HomePage({
  recentBlogs,
  hero,
  stats,
  testimonials,
  partners,
  gallery,
  visaCards,
  ticketCards,
  serviceCards,
  peopleGallery,
  contact,
  serviceCategories,
  contactFormFields,
  termsEnabled,
  refundEnabled,
}: {
  recentBlogs: PublicBlogPost[];
  hero: HomeHero;
  stats: HomeStat[];
  testimonials: HomeTestimonial[];
  partners: HomePartner[];
  gallery: HomeGalleryImage[];
  visaCards: HomeVisaCard[];
  ticketCards: HomeTicketCard[];
  serviceCards: HomeServiceCard[];
  peopleGallery: HomePeopleGalleryImage[];
  contact: ContactInfo;
  serviceCategories: string[];
  contactFormFields: ContactFormFieldsSettings;
  termsEnabled: boolean;
  refundEnabled: boolean;
}) {
  const [activeReview, setActiveReview] = useState(0);
  // 1 review per slide below Tailwind's sm breakpoint, 2 at sm and up —
  // keeps the transform step in sync with the card width class below.
  // Defaults to 1 (mobile-first) so the initial translateX(0) render never
  // mismatches the CSS-driven card width before this effect runs.
  const [reviewsPerView, setReviewsPerView] = useState(1);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const onChange = () => setReviewsPerView(query.matches ? 2 : 1);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Gallery tiles (the 5 photos right below the hero) fan open/closed
  // continuously with scroll position through their section — 0 while
  // it's still below the viewport (closed/fanned), 1 once it's scrolled up
  // to sit in the upper half (fully open). Scrolling back up reverses it
  // the same way, since this tracks position, not a one-shot enter/exit
  // trigger.
  const gallerySectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: galleryProgress } = useScroll({
    target: gallerySectionRef,
    offset: ["start 0.9", "start 0.35"],
  });

  return (
    <main className="flex w-full flex-1 flex-col overflow-x-clip bg-ink text-white">
      {/* ================= HERO ================= */}
      <section className="relative isolate min-h-screen overflow-hidden">
        {/* --- Background: airplane-window shot --- */}
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />

        {/* --- Window-frame vignette (dark edges like the mockup) --- */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(120% 90% at 50% 55%, transparent 45%, color-mix(in srgb, var(--color-ink) 55%, transparent) 78%, color-mix(in srgb, var(--color-ink) 95%, transparent) 100%),
              linear-gradient(to right, color-mix(in srgb, var(--color-ink) 95%, transparent) 0%, transparent 22%, transparent 78%, color-mix(in srgb, var(--color-ink) 90%, transparent) 100%),
              linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 85%, transparent) 0%, transparent 30%)
            `,
          }}
        />

        {/* ================= HERO CONTENT ================= */}
        <motion.div
          className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-8 text-center"
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          {/* Eyebrow */}
          <motion.p
            variants={heroItem}
            className={`font-condensed text-base font-medium tracking-wide text-white/90 sm:text-lg`}
          >
            {hero.eyebrow}
          </motion.p>

          {/* Title */}
          <motion.h1
            variants={heroTitle}
            className={`font-display mt-4 text-[clamp(2rem,11vw,9rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] text-gold drop-shadow-title sm:tracking-[0.04em]`}
          >
            {hero.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroItem}
            className={`font-condensed mt-5 text-lg font-medium text-white sm:text-xl`}
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA */}
          <MotionLink
            href={hero.ctaHref}
            variants={heroItem}
            className={`font-display group mt-12 inline-flex items-center gap-3 rounded-full bg-gold px-10 py-4 text-base font-semibold text-ink shadow-gold transition hover:bg-gold-hover sm:px-16`}
          >
            {hero.ctaLabel}
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
          </MotionLink>
        </motion.div>
      </section>

      {/* ================= TRUSTED TRAVEL & VISA SOLUTIONS ================= */}
      <section
        ref={gallerySectionRef}
        className="bg-sky py-16 sm:py-20 lg:py-24"
      >
        {/* Photo gallery strip — fans open/closed with scroll (see GalleryTile) */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6 lg:px-16">
          {gallery.map((img, i) => (
            <GalleryTile
              key={`${img.alt}-${i}`}
              img={img}
              index={i}
              total={gallery.length}
              progress={galleryProgress}
            />
          ))}
        </div>

        {/* Heading + copy */}
        <div className="mx-auto mt-16 max-w-3xl px-6 text-center sm:mt-20 lg:mt-28">
          <h2
            className={`font-display text-4xl font-normal text-navy sm:text-5xl lg:text-6xl`}
          >
            Trusted Travel &amp; Visa Solutions
          </h2>
          <p
            className={`font-condensed mt-8 text-lg leading-relaxed text-navy-deep sm:text-xl`}
          >
            Whether you&apos;re planning a holiday, business trip, or relocating
            abroad, A&amp;A Aviation offers professional travel and visa
            services tailored to your needs. We combine industry expertise,
            transparent guidance &amp; personalized support to help you travel
            with confidence.
          </p>
        </div>
      </section>

      {/* ================= VISA CARDS MARQUEE ================= */}
      <section className="relative overflow-hidden bg-sky pb-20 pt-4 sm:pb-24">
        <FlightPathDivider positionClassName="top-20 h-32 sm:top-24 sm:h-36" />

        {/* Marquee — pauses when a card is hovered */}
        <div className="visa-marquee group/marquee mt-20 flex overflow-hidden sm:mt-24">
          {/* Track rendered twice for a seamless loop */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="visa-track flex shrink-0 items-stretch gap-6 pr-6"
            >
              {visaCards.map((card, cardIndex) => (
                <article
                  key={`${copy}-${card.tag}-${cardIndex}`}
                  className="group flex w-70 shrink-0 items-center gap-5 rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover sm:w-[320px]"
                >
                  <div className="relative h-24 w-24 shrink-0 -rotate-12 overflow-hidden rounded-xl border-4 border-white shadow-md transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="96px"
                      className="-rotate-12 scale-150 object-cover transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className={`font-body text-xs text-muted`}>{card.tag}</p>
                    <h3 className={`font-display mt-1 text-2xl text-navy`}>
                      {card.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= AIR TICKETING ================= */}
      <section className="bg-sky!">
        {/* Photo with a torn-paper edge bleeding into the section below */}
        <div className="relative">
          <div className="relative aspect-1920/737 w-full overflow-hidden">
            <Image
              src={airTicketingBg}
              alt="Aerial view of a coastal Lisbon neighborhood"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-[-4.5%] aspect-1926/301 w-full">
            <Image
              src={airTicketingShape}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Heading + copy */}
        <div className="mx-auto max-w-2xl px-6 pb-20 text-center sm:pb-24 lg:pb-28">
          <p
            className={`font-condensed text-base font-medium text-navy-deep sm:text-lg`}
          >
            Air Ticketing
          </p>
          <h2
            className={`font-display mt-3 text-4xl font-normal text-navy sm:text-5xl lg:text-6xl`}
          >
            Reliable Flight Booking for Every Journey
          </h2>
          <p className={`font-condensed mt-5 text-sm text-muted sm:text-base`}>
            Affordable air ticket booking for domestic and international travel
            with professional assistance.
          </p>
        </div>
      </section>

      {/* ================= TICKET TYPES MARQUEE ================= */}
      <section className="relative overflow-hidden bg-sky pb-20 pt-4 sm:pb-24">
        <FlightPathDivider positionClassName="top-36 h-36 sm:top-44 sm:h-40" />

        {/* Marquee — slow crawl, pauses when a card is hovered */}
        <div className="tickets-marquee group/marquee mt-20 flex overflow-hidden sm:mt-24">
          {/* Track rendered twice for a seamless loop */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="tickets-track flex shrink-0 items-stretch gap-6 pr-6"
            >
              {ticketCards.map((card, cardIndex) => (
                <article
                  key={`${copy}-${card.title}-${cardIndex}`}
                  className="w-65 shrink-0 rounded-2xl bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover sm:w-75"
                >
                  <div className="relative h-36 w-full overflow-hidden rounded-xl sm:h-40">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className={`font-display mt-4 text-xl text-navy`}>
                    {card.title}
                  </h3>
                  <p
                    className={`font-condensed mt-2 text-sm leading-relaxed text-muted`}
                  >
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= MORE SERVICES ================= */}
      <section className="relative bg-navy-section">
        {/* Mountain-ridge shape, flush against the section above (no
            negative-margin overlap) — the wrapper's background carries
            that section's own light-blue color so the shape's transparent
            "sky" area lines up with it exactly, with no gap or bleed at
            the top. services-mountain-navy.png's bottom edge is itself
            irregular (not a straight cut) and turns transparent below it,
            expecting whatever sits behind to be the section's own color —
            checked the actual pixel alpha: the opaque body's shortest
            column ends at 85.4% of the image height (right at the very
            left edge, x=0), so anywhere past that, in a straight strip
            across the full width, is meant to show navy, not sky. The
            gradient's stop is set below that (with a safety margin) so
            the whole irregular boundary sits on navy at every x position —
            a stop nearer the top than the shortest column would leave a
            gap at whichever x is shortest, which is what happened at 92%
            (it only cleared columns down to that point, not the 85.4%
            worst case). Rendered unoptimized so the browser gets the exact
            PNG bytes (alpha channel included) instead of a re-encoded
            variant from the image optimizer. */}
        <div
          className="relative aspect-1920/199 w-full"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-sky) 0%, var(--color-sky) 83%, var(--color-navy-section) 83%, var(--color-navy-section) 100%)",
          }}
        >
          <Image
            src={servicesShape}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Heading + copy */}
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p
            className={`font-condensed text-base font-medium text-white/80 sm:text-lg`}
          >
            More Services
          </p>
          <h2
            className={`font-display mt-3 text-4xl font-normal text-white sm:text-5xl lg:text-6xl`}
          >
            Complete Travel Support Beyond Flights &amp; Visas
          </h2>
          <p
            className={`font-condensed mt-5 text-sm text-white/70 sm:text-base`}
          >
            Everything You Need for a Hassle-Free International Journey
          </p>
        </div>

        {/* Service cards */}
        <div className="mx-auto mt-16 flex max-w-340 flex-wrap justify-center gap-6 px-6 pb-20 sm:mt-20 sm:pb-24 lg:pb-28">
          {serviceCards.map((card, cardIndex) => (
            <article
              key={`${card.title}-${cardIndex}`}
              className="group flex w-full max-w-105 shrink-0 items-center gap-5 rounded-2xl bg-white p-5 shadow-card-dark transition-shadow hover:shadow-card-dark-hover"
            >
              <div className="relative h-24 w-24 shrink-0 -rotate-12 overflow-hidden rounded-xl border-4 border-white shadow-md transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="-rotate-12 scale-150 object-cover transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110"
                />
              </div>
              <div>
                <p className={`font-body text-xs text-muted`}>
                  {card.category}
                </p>
                <h3 className={`font-display mt-1 text-2xl text-navy`}>
                  {card.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= GLOBAL OPPORTUNITIES ================= */}
      <section className="bg-sky pb-20 pt-20 sm:pb-24 sm:pt-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2
            className={`font-display text-3xl font-normal leading-snug text-navy sm:text-4xl lg:text-5xl`}
          >
            Connecting People With{" "}
            <span className="font-bold">Global Opportunities</span> Through
            Dependable Travel, Visa And{" "}
            <span className="font-bold">Immigration Support</span>.
          </h2>
        </div>

        {/* Marquee — slow crawl, pauses when a card is hovered */}
        <div className="people-marquee group/marquee mt-14 flex items-end overflow-hidden sm:mt-16">
          {/* Track rendered twice for a seamless loop */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="people-track flex shrink-0 items-end gap-4 pr-4 sm:gap-6 sm:pr-6"
            >
              {peopleGallery.map((img, i) => (
                <div
                  key={`${copy}-${i}`}
                  className={`relative shrink-0 overflow-hidden rounded-2xl ${
                    img.tall ? "h-64 sm:h-80 lg:h-96" : "h-52 sm:h-64 lg:h-72"
                  }`}
                  style={{ aspectRatio: img.tall ? "458 / 512" : "214 / 396" }}
                >
                  <Image
                    src={img.image}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 45vw, 300px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-14 px-6 sm:mt-24 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="relative text-center">
              <span
                className={`font-display block text-6xl font-bold leading-none text-navy/15 sm:text-7xl lg:text-8xl`}
              >
                <AnimatedStatValue value={stat.value} />
              </span>
              <span
                className={`font-body absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-bold text-navy sm:text-base`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= OUR PARTNERS ================= */}
      <section className="bg-sky py-20 sm:py-24">
        <div className="mx-auto grid max-w-340 grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
          {/* Left: heading + copy */}
          <div className="max-w-sm">
            <p
              className={`font-condensed text-base font-medium text-navy sm:text-lg`}
            >
              Our Partners
            </p>
            <h2
              className={`font-display mt-3 text-4xl font-normal leading-tight text-navy sm:text-5xl`}
            >
              Building Strong Partnerships for Better Travel
            </h2>
            <p
              className={`font-condensed mt-5 text-sm leading-relaxed text-navy-deep/80`}
            >
              Together with trusted global travel partners, we deliver seamless
              journeys, competitive pricing, and outstanding customer service.
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

          {/* Right: logo grid */}
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

      {/* ================= CLIENT REVIEWS ================= */}
      <section className="relative overflow-hidden bg-sky pt-20 sm:pt-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p
            className={`font-condensed text-base font-medium text-navy sm:text-lg`}
          >
            Client Reviews
          </p>
          <h2
            className={`font-display mt-3 text-4xl font-normal text-navy sm:text-5xl lg:text-6xl`}
          >
            Trusted by Clients Across Bangladesh
          </h2>
          <p className={`font-condensed mt-5 text-sm text-muted sm:text-base`}>
            See what our clients say about their experience with A&amp;A
            Aviation&apos;s professional travel and visa services.
          </p>
        </div>

        {/* Slider — 1 review at a time below sm, 2 at sm and up; the list
            is doubled so the last dot can still slide in a full card
            instead of leaving a gap at the 2-per-view breakpoint. */}
        <div className="mx-auto mt-14 max-w-305 px-6 sm:mt-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeReview * (100 / reviewsPerView)}%)`,
              }}
            >
              {[...testimonials, ...testimonials].map((review, i) => (
                <div
                  key={`${review.name}-${i}`}
                  className="w-full shrink-0 px-3 sm:w-1/2"
                >
                  {/* One fused card: colored quote half + white caption half,
                      sharing a single rounded outline instead of two boxes. */}
                  <div className="flex h-72 overflow-hidden rounded-3xl sm:h-80">
                    <div
                      className={`flex flex-1 flex-col justify-between p-8 ${
                        i % 2 === 0 ? "bg-gold" : "bg-navy"
                      }`}
                    >
                      <p
                        className={`font-condensed text-sm leading-relaxed sm:text-base ${
                          i % 2 === 0 ? "text-navy" : "text-white"
                        }`}
                      >
                        {review.quote}
                      </p>
                      <div>
                        <div
                          className={`mb-5 mt-6 border-t ${
                            i % 2 === 0 ? "border-navy/20" : "border-white/20"
                          }`}
                        />
                        <p
                          className={`font-display text-lg ${
                            i % 2 === 0 ? "text-navy" : "text-white"
                          }`}
                        >
                          {review.name}
                        </p>
                        <p
                          className={`font-condensed text-xs ${
                            i % 2 === 0 ? "text-navy/70" : "text-white/70"
                          }`}
                        >
                          {review.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-36 shrink-0 flex-col items-center bg-white p-4 pt-10 text-center sm:w-44 sm:pt-12">
                      <svg
                        width="85"
                        height="85"
                        viewBox="0 0 85 85"
                        fill="none"
                        className="h-9 w-9 sm:h-10 sm:w-10"
                        aria-hidden="true"
                      >
                        <path
                          d="M17.5263 51.1089C15.7818 55.5109 13.0244 59.8688 9.33188 64.0633C8.15681 65.3979 8.00764 67.3032 8.96094 68.8038C9.69505 69.9582 10.9298 70.6158 12.2372 70.6158C12.6055 70.6158 12.9804 70.5639 13.35 70.4562C21.1761 68.1696 39.4313 60.0478 39.9216 34.0871C40.1109 24.0626 32.779 15.4506 23.2318 14.4804C17.9699 13.9538 12.7054 15.6633 8.80401 19.1898C4.89746 22.7202 2.65625 27.7604 2.65625 33.0197C2.65625 41.7939 8.88441 49.4669 17.5263 51.1089ZM12.3656 23.1314C14.8467 20.8889 17.9699 19.6943 21.2811 19.6943C21.7494 19.6943 22.2214 19.7177 22.6949 19.7669C29.5132 20.4582 34.7466 26.7046 34.6091 33.9859C34.2706 51.9494 24.5444 60.0361 16.49 63.6535C19.0386 60.206 21.0412 56.6601 22.4653 53.0661C23.0204 51.6666 22.9283 50.1024 22.2137 48.7743C21.4653 47.3813 20.1307 46.393 18.5548 46.0623C12.42 44.7796 7.96875 39.2933 7.96875 33.0197C7.96875 29.261 9.57182 25.6567 12.3656 23.1314Z"
                          fill="var(--color-navy-quote)"
                        />
                        <path
                          d="M51.3812 68.8035C52.1153 69.9578 53.35 70.6154 54.6574 70.6154C55.0257 70.6154 55.3993 70.5635 55.7702 70.4559C63.5963 68.1693 81.8502 60.0475 82.3405 34.0868C82.5272 24.0623 75.1966 15.4502 65.6481 14.4801C60.3797 13.9444 55.1243 15.6616 51.2229 19.1895C47.3164 22.7199 45.0752 27.76 45.0752 33.0193C45.0752 41.7935 51.3034 49.4665 59.944 51.1086C58.1982 55.5145 55.4408 59.8724 51.7495 64.0643C50.5744 65.4002 50.4266 67.3042 51.3812 68.8035ZM64.8829 53.0683C65.438 51.6688 65.3472 50.1047 64.6338 48.7766C63.8842 47.3823 62.5509 46.394 60.9737 46.062C54.8389 44.7792 50.3876 39.2929 50.3876 33.0193C50.3876 29.2593 51.9907 25.6563 54.7844 23.131C57.2643 20.8885 60.3875 19.694 63.7 19.694C64.1669 19.694 64.6391 19.7173 65.1138 19.7666C71.9308 20.4579 77.1654 26.7042 77.028 33.9856C76.6907 51.9503 66.9633 60.0358 58.9089 63.6531C61.4562 60.2083 63.4562 56.6623 64.8829 53.0683Z"
                          fill="var(--color-navy-quote)"
                        />
                      </svg>
                      <p
                        className={`font-display mt-4 text-sm text-navy sm:text-base`}
                      >
                        {review.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {testimonials.map((review, i) => (
              <button
                key={review.name + i}
                type="button"
                onClick={() => setActiveReview(i)}
                aria-label={`Show review from ${review.name}`}
                aria-current={activeReview === i}
                className="flex h-4 w-4 items-center justify-center"
              >
                {activeReview === i ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-teal">
                    <span className="h-2 w-2 rounded-full bg-teal" />
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-navy transition-colors hover:bg-navy/70" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Snowy mountains divider */}
        <div className="relative mt-16 aspect-1920/186 w-full">
          <Image
            src={snowyMountains}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom"
          />
        </div>
      </section>

      {/* ================= TRAVEL INSIGHTS ================= */}
      <section className="bg-sky py-20 sm:py-24">
        <div className="mx-auto max-w-340 px-6">
          {/* Heading + CTA */}
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p
                className={`font-condensed text-base font-medium text-teal sm:text-lg`}
              >
                Travel Insights
              </p>
              <h2
                className={`font-display mt-2 text-5xl font-normal leading-none text-navy sm:text-6xl lg:text-7xl`}
              >
                Latest Travel &amp; Visa Updates
              </h2>
              <p
                className={`font-condensed mt-5 text-sm leading-relaxed text-navy-deep/70 sm:text-base`}
              >
                Explore expert travel tips, visa guides, and the latest updates
                to make every journey smooth and stress-free.
              </p>
            </div>
            <Link
              href="/blogs"
              className={`font-display group inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-navy transition hover:bg-gold-hover`}
            >
              Explore More
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

          {/* Post list — all three cards are plain, fully visible content
              up front, exactly like a normal list (nothing hidden off-
              stage). The scroll effect only kicks in as you scroll through
              them: each card is `position: sticky` at a slightly larger
              `top` than the one before (plus a higher z-index), so once it
              reaches the top it locks there while the next one scrolls up
              over it, leaving a strip of it peeking out above. They all
              share ONE containing block instead of one each — sticky only
              releases once *its own* containing block's bottom scrolls
              past, so splitting them into separate per-card wrappers made
              each one let go long before the next was ready to cover it,
              leaving a stretch of plain scrolling with nothing stacked in
              between. One shared block means none of them let go until
              the padding at the very end is reached, and then it all
              continues scrolling normally into Contact. */}
          <div
            className="relative mt-14 sm:mt-16"
            style={{ paddingBottom: "10vh" }}
          >
            {recentBlogs.map((post, i) => (
              <InsightCard
                key={post.slug}
                post={post}
                index={i}
                total={recentBlogs.length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <Contact
        contactInfo={contact}
        serviceCategories={serviceCategories}
        phoneFieldEnabled={contactFormFields.phoneFieldEnabled}
        termsEnabled={termsEnabled}
        refundEnabled={refundEnabled}
      />

      {/* ================= DREAMS BANNER ================= */}
      <DreamBanner />
    </main>
  );
}
