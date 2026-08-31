"use client";
import { useState } from "react";
import Contact from "@/components/Contact";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { PublicService } from "@/lib/data/services";
import type {
  ContactInfo,
  ContactFormFieldsSettings,
  ServiceDetailHero,
} from "@/lib/data/settings";
import { LIGHT_HERO_OVERLAY, heroTitleStyle } from "@/components/home/hero-effects";
import {
  ArrowRight,
  CircleCheck,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";

import marriott from "@/components/home/images/partners/marriott.png";
import sheraton from "@/components/home/images/partners/sheraton.png";
import holidayInn from "@/components/home/images/partners/holiday-inn.png";
import radisson from "@/components/home/images/partners/radisson.png";
import accor from "@/components/home/images/partners/accor.png";
import hilton from "@/components/home/images/partners/hilton.png";
import singaporeAirlines from "@/components/home/images/partners/singapore-airlines.png";
import DreamBanner from "@/components/home/DreamBanner";

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
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

// --- Trusted partners (shared with the home page) ---
const PARTNERS: { name: string; image: typeof marriott }[] = [
  { name: "Singapore Airlines", image: singaporeAirlines },
  { name: "Marriott", image: marriott },
  { name: "Sheraton", image: sheraton },
  { name: "Accor", image: accor },
  { name: "Holiday Inn", image: holidayInn },
  { name: "Radisson", image: radisson },
  { name: "Hilton", image: hilton },
];

// --- Generic steps — every service follows the same pipeline ---
const workingProcess = [
  {
    step: "01",
    title: "Requirements Check",
    desc: "Share your requirements — our experts guide you through the best options and what you need.",
  },
  {
    step: "02",
    title: "Documentation & Payment",
    desc: "We prepare and verify every document, then confirm your booking with transparent payment.",
  },
  {
    step: "03",
    title: "Processing",
    desc: "We handle submissions, appointments and follow-ups with our trusted partners on your behalf.",
  },
  {
    step: "04",
    title: "Confirmation",
    desc: "Receive your confirmed booking or approved documents with status updates along the way.",
  },
];

// --- Generic FAQs that apply to every service ---
const faqs = [
  {
    question: "How do I get started?",
    answer:
      "Send us an enquiry or call us directly — our team will explain the process, requirements and pricing before you commit to anything.",
  },
  {
    question: "How long does the process take?",
    answer:
      "It depends on the service and destination, but we work for the fastest possible turnaround and keep you updated at every stage.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No. The price we quote is the final price including all standard fees and taxes — no surprises later.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, bKash and card payments. Our team will confirm the best option for you when you book.",
  },
  {
    question: "What if I need help after my booking?",
    answer:
      "Our support team is available around the clock to help with changes, questions and any emergencies that come up.",
  },
];

const reviews = [
  {
    name: "Nusrat Jahan",
    role: "Business Owner",
    text: "A&A Aviation found an excellent hotel near my conference venue at a great price. The booking process was fast and hassle-free.",
    rating: 5,
  },
  {
    name: "Farhan Chowdhury",
    role: "Software Engineer",
    text: "Fast, professional and reliable. Everything was handled for me without any hassle — highly recommended.",
    rating: 5,
  },
  {
    name: "Sadia Rahman",
    role: "University Student",
    text: "Very responsive support team. They answered all my questions and made the entire process feel easy.",
    rating: 5,
  },
  {
    name: "Rafiq Ahmed",
    role: "Frequent Traveler",
    text: "Great value and genuine advice. I always come back to A&A Aviation for my travel and visa needs.",
    rating: 4,
  },
];

const satisfactionStats = [
  { label: "Service Quality", val: "97%" },
  { label: "Response Time", val: "95%" },
  { label: "Value for Money", val: "94%" },
  { label: "Overall Experience", val: "95%" },
];

export default function ServiceDetailClient({
  service,
  relatedServices,
  hero,
  contactInfo,
  serviceCategories,
  contactFormFields,
  termsEnabled,
  refundEnabled,
}: {
  service: PublicService;
  relatedServices: PublicService[];
  hero: ServiceDetailHero;
  contactInfo: ContactInfo;
  serviceCategories: string[];
  contactFormFields: ContactFormFieldsSettings;
  termsEnabled: boolean;
  refundEnabled: boolean;
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center bg-[#EAF5FF]">
      {/* ================= HERO ================= */}
      <section className="relative isolate max-h-9/12 overflow-hidden bg-white">
        <Image
          src={service.image}
          alt={`${service.title} Image`}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {/* --- Window-frame vignette (light edges) — this hero's title is
            navy, so a light vignette keeps it readable, unlike the dark one
            used where the text is white/gold. Previously missing here
            entirely, which is why the title could disappear into a busy
            photo. --- */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{ background: LIGHT_HERO_OVERLAY }}
        />
        <motion.div
          className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 pb-24 pt-8 text-center"
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          <motion.h1
            variants={heroTitle}
            style={heroTitleStyle(hero.titleColor, hero.shadowColor)}
            className="font-display mt-4 text-[clamp(2rem,11vw,9rem)] font-bold uppercase leading-[0.95] tracking-[0.02em] sm:tracking-[0.04em]"
          >
            {service.title}
          </motion.h1>
        </motion.div>
      </section>

      <div className="mx-auto w-full max-w-340 px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16 space-y-16 lg:space-y-20">
        {/* ================= ENQUIRY INFO ================= */}
        <section>
          <div className="flex flex-col justify-between items-start sm:flex-row sm:items-baseline">
            <div>
              <span className="bg-[#FFA726] text-white text-xs font-bold rounded-md px-3 py-1 uppercase tracking-wide">
                Featured
              </span>
              <h3 className="font-display mt-3 text-2xl font-bold text-navy sm:text-3xl">
                For {service.title} Enquiry
              </h3>
            </div>
            <div className="mt-4 text-sm font-medium text-navy-deep/60 sm:mt-0 sm:text-right">
              <p>
                Consultation:{" "}
                <span className="font-semibold text-ink">Free</span>
              </p>
              <p>
                Processing:{" "}
                <span className="font-semibold text-ink">Manually</span>
              </p>
            </div>
          </div>
        </section>

        {/* ================= GET IN TOUCH (CONTACT) ================= */}
        <Contact
          contactInfo={contactInfo}
          serviceCategories={serviceCategories}
          phoneFieldEnabled={contactFormFields.phoneFieldEnabled}
          termsEnabled={termsEnabled}
          refundEnabled={refundEnabled}
        />

        {/* ================= OUR TRUSTED PARTNERS ================= */}
        <section>
          <span className="bg-[#FFA726] text-white text-xs font-bold rounded-md px-3 py-1 uppercase tracking-wide">
            Associates
          </span>
          <h3 className="font-display mt-3 mb-8 text-2xl font-bold text-[#172B47]">
            Our Trusted Partners
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex h-48 items-center justify-center rounded-2xl "
              >
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="h-auto max-h-fit w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= DESCRIPTION & WHY CHOOSE US ================= */}
        <section className="space-y-10">
          <div>
            <h4 className="font-display mb-3 text-xl font-bold text-[#172B47]">
              Description
            </h4>
            <p className="max-w-4xl text-sm leading-relaxed text-navy-deep/80 sm:text-base">
              {service.description}
            </p>
          </div>

          <div>
            <h4 className="font-display mb-4 text-xl font-bold text-[#172B47]">
              Why Choose A&amp;A Aviation for {service.title}?
            </h4>
            <ul className="grid gap-3 sm:grid-cols-1">
              {service.features.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-1 text-navy-deep/80"
                >
                  <CircleCheck className="size-6 text-white" fill="#22AC39" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ================= RELATED SERVICES (FULL WIDTH) ================= */}
      <section className="w-full py-16 lg:py-20">
        <div className="mx-auto mb-6 flex w-full max-w-340 items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <span className="bg-[#FFA726] text-white text-xs font-bold rounded-md px-3 py-1 uppercase tracking-wide">
              Explore
            </span>
            <h3 className="font-display mt-3 text-2xl font-bold text-[#172B47]">
              Related Services
            </h3>
          </div>
          <Link
            href="/services"
            className="font-body group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold sm:inline-flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {/* Auto-scrolling marquee — pauses when a card is hovered */}
        <div className="related-marquee group/marquee mt-10 flex w-full overflow-hidden">
          {/* Track rendered twice for a seamless loop */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="related-track flex shrink-0 items-stretch gap-6 pr-6"
            >
              {relatedServices.map((related) => (
                <Link
                  key={`${copy}-${related.slug}`}
                  href={`/services/${related.slug}`}
                  className="group flex w-80 shrink-0 items-center gap-5 rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="relative h-24 w-24 shrink-0 -rotate-12 overflow-hidden rounded-xl border-4 border-white shadow-md transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      sizes="96px"
                      className="-rotate-12 scale-150 object-cover transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted">
                      {related.category}
                    </p>
                    <h4 className="font-display mt-1 text-2xl text-navy">
                      {related.title}
                    </h4>
                    <p className="font-condensed mt-1 line-clamp-2 text-xs text-navy-deep/60">
                      {related.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-340 px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16 space-y-16 lg:space-y-20">
        {/* ================= WORKING PROCESS ================= */}
        <section>
          <h3 className="font-display mb-8 text-2xl font-bold text-[#172B47]">
            Booking Process
          </h3>
          <div className="flex flex-col gap-6">
            {workingProcess.map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded bg-[#172B47] font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[#172B47]">
                    {item.title}
                  </h4>
                  <p className="font-condensed text-sm leading-relaxed text-navy-deep/70">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
        <section>
          <h3 className="font-display mb-6 text-2xl font-bold text-[#172B47]">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white border border-blue-100 transition-all"
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  aria-expanded={openFaqIndex === index}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold text-[#172B47] hover:bg-blue-50/50 sm:p-5"
                >
                  <span className="font-condensed">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="font-condensed p-4 pt-0 text-sm text-gray-600 sm:p-5 sm:pt-0">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ================= CUSTOMER SATISFACTION ================= */}
        <section>
          <h3 className="font-display mb-8 text-2xl font-bold text-[#172B47]">
            Customer Satisfaction
          </h3>
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14 md:p-10">
            {/* Circle Chart */}
            <div className="relative h-36 w-36 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#172B47]"
                  strokeDasharray="97, 100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#172B47]">97%</span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="w-full flex-1 space-y-6">
              {satisfactionStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between items-baseline">
                    <div className="mb-1 flex flex-col text-sm font-semibold text-[#172B47]">
                      <span>{stat.label}</span>
                      <span>{stat.val}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex justify-between items-center">
                        <Star className="h-5 w-5 text-[#172B47]" />
                        <Star className="h-5 w-5 text-[#172B47]" />
                        <Star className="h-5 w-5 text-[#172B47]" />
                        <Star className="h-5 w-5 text-[#172B47]" />
                        <Star className="h-5 w-5 text-[#172B47]" />
                      </div>
                      <div className="text-sm font-semibold text-[#172B47]">
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#172B47]"
                      style={{ width: stat.val }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CLIENT REVIEWS ================= */}
        <section>
          <div className="mb-8 flex items-center justify-between gap-4">
            <h3 className="font-display text-2xl font-bold text-[#172B47]">
              Client Reviews
            </h3>
            <div className="flex items-center gap-4">
              <p className="font-body shrink-0 text-sm font-semibold text-blue-600">
                4 Reviews
              </p>
              <div className="flex justify-between items-center">
                <Star className="h-5 w-5 text-[#172B47]" />
                <Star className="h-5 w-5 text-[#172B47]" />
                <Star className="h-5 w-5 text-[#172B47]" />
                <Star className="h-5 w-5 text-[#172B47]" />
                <Star className="h-5 w-5 text-[#172B47]" />
              </div>
              <p className="font-body shrink-0 text-sm font-semibold text-blue-600">
                (5 out 5)
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            {reviews.map((review, idx) => (
              <div key={review.name} className="flex gap-4 border-b py-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                    idx % 3 === 1
                      ? "bg-gold text-navy"
                      : idx % 3 === 2
                        ? "bg-teal text-white"
                        : "bg-navy text-white"
                  }`}
                >
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display font-bold text-[#172B47]">
                      {review.name}
                    </h4>
                  </div>

                  <p className="font-condensed mt-1 text-sm text-gray-600">
                    {review.text}
                  </p>
                  <div className="my-6 flex items-center text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                    <p className="ms-2 font-body text-sm font-semibold text-blue-600">
                      {" "}
                      5.0
                    </p>
                  </div>
                  <div className="">
                    <p className="font-body text-sm font-semibold uppercase text-[#949392]">
                      {new Date().toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= DREAM BANNER (FULL WIDTH) ================= */}
      <DreamBanner />
    </div>
  );
}
