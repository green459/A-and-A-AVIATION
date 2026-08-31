"use client";

/**
 * Footer — shared across every page via app/(site)/layout.tsx.
 *
 * The "Beyond Our Services" photo strip is admin-managed (Settings →
 * General → Footer photo strip) rather than hardcoded, so its images live
 * in the `gallery` prop instead of local imports.
 */

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ContactInfo, SocialLink, FooterGalleryImage } from "@/lib/data/settings";

type SubscribeStatus = "idle" | "submitting" | "success" | "error";

function NewsletterForm() {
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 rounded-lg border border-navy/15 bg-white px-4 py-3"
      >
        {/* Honeypot — real visitors never see or fill this in. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          hidden
        />
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-navy/50"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="email"
          name="email"
          required
          placeholder="Email..."
          disabled={status === "submitting"}
          className="font-condensed w-full bg-transparent text-sm text-navy-deep placeholder:text-navy-deep/50 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="font-body shrink-0 text-xs font-bold uppercase tracking-wide text-navy hover:text-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "…" : "Join"}
        </button>
      </form>
      {status === "success" && (
        <p role="status" className="font-condensed mt-2 text-xs text-teal">
          Thanks — you&apos;re subscribed.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="font-condensed mt-2 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </>
  );
}

const FOOTER_ACCOUNT_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Destinations", href: "/destinations" },
  { label: "Travel Guide", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

const FOOTER_SERVICE_LINKS = [
  { label: "Air Ticketing", href: "/services/air-ticketing" },
  { label: "Hotel Reservations", href: "/services/hotel-reservations" },
  { label: "Tourist Visa", href: "/services/tourist-visa" },
  { label: "Visa Stamping", href: "/services/visa-stamping" },
  { label: "Document Legalization", href: "/services/document-legalization" },
];

const FOOTER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Destinations", href: "/destinations" },
  { label: "Blog", href: "/blogs" },
];

function SocialIcon({ link }: { link: SocialLink }) {
  const type = link.platform;

  if (type === "other" && link.icon) {
    return (
      <span className="relative block h-4 w-4 overflow-hidden rounded-full">
        <Image src={link.icon} alt="" fill sizes="16px" className="object-cover" />
      </span>
    );
  }
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M14.5 8.5H16.5V5.6H14.3C12.2 5.6 10.6 7.2 10.6 9.3V11H8.5V13.9H10.6V20.4H13.5V13.9H15.6L16 11H13.5V9.5C13.5 8.9 14 8.5 14.5 8.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (type === "twitter") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M20.5 7.1c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.4-1.8-.6.4-1.4.7-2.1.9a3.3 3.3 0 0 0-5.7 3c-2.7-.1-5.2-1.5-6.8-3.5-.3.5-.4 1-.4 1.6 0 1.1.6 2.1 1.4 2.6-.5 0-1-.2-1.4-.4v.1c0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.3a6.6 6.6 0 0 1-4.9 1.4c1.4.9 3.1 1.4 4.9 1.4 5.9 0 9.1-4.9 9.1-9.1v-.4c.6-.5 1.2-1.1 1.6-1.8z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (type === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.7" />
        <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "pinterest") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 3.5a8.5 8.5 0 0 0-3.1 16.4c0-.6-.1-1.6.1-2.3l1.3-5.5s-.3-.6-.3-1.5c0-1.5.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1 .5 1.9 1.5 1.9 1.9 0 3.2-2.4 3.2-5.2 0-2.2-1.5-3.8-4.1-3.8-3 0-4.8 2.2-4.8 4.5 0 .8.3 1.4.7 1.8.1.2.2.3.1.5l-.2.9c-.1.2-.2.3-.4.2-1.2-.5-1.8-1.9-1.8-3.4 0-2.5 2.1-5.5 6.3-5.5 3.4 0 5.6 2.4 5.6 5.1 0 3.5-1.9 6.1-4.7 6.1-.9 0-1.8-.5-2.1-1.1l-.6 2.2c-.2.8-.7 1.8-1.1 2.4A8.5 8.5 0 1 0 12 3.5z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 4a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 4ZM20.44 20h-3.37v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.67V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M21.6 7.2s-.21-1.49-.87-2.15c-.83-.87-1.76-.87-2.19-.92C15.44 4 12 4 12 4h-.01s-3.44 0-6.54.13c-.43.05-1.36.05-2.19.92C2.6 5.71 2.4 7.2 2.4 7.2S2.2 8.94 2.2 10.68v1.63c0 1.74.2 3.48.2 3.48s.21 1.49.86 2.15c.83.87 1.92.84 2.41.94C7.4 19.03 12 19.06 12 19.06s3.44-.01 6.54-.14c.43-.05 1.36-.05 2.19-.92.66-.66.87-2.15.87-2.15s.2-1.74.2-3.48v-1.63c0-1.74-.2-3.48-.2-3.48ZM9.99 13.99v-5l4.99 2.51-4.99 2.49Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
        <path
          d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.663 4.523 1.812 6.383L4 29l7.83-1.766A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7a9.66 9.66 0 0 1-4.928-1.352l-.354-.21-4.646 1.048 1.02-4.53-.232-.37A9.65 9.65 0 0 1 5.3 15c0-5.906 4.8-10.7 10.704-10.7 5.905 0 10.7 4.794 10.7 10.7 0 5.906-4.795 10.7-10.7 10.7Zm5.86-8.014c-.32-.16-1.9-.938-2.194-1.045-.294-.108-.508-.16-.722.16-.213.32-.827 1.045-1.014 1.26-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.896-1.779-2.216-.187-.32-.02-.494.14-.653.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.722-1.744-.99-2.388-.26-.626-.526-.54-.722-.55-.187-.008-.4-.01-.614-.01-.213 0-.56.08-.853.4-.293.32-1.12 1.095-1.12 2.668 0 1.573 1.147 3.093 1.307 3.306.16.213 2.257 3.445 5.468 4.83.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.9-.777 2.167-1.526.267-.75.267-1.393.187-1.527-.08-.133-.293-.213-.613-.373Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M9 15 15 9M10 7l1-1a4 4 0 1 1 6 6l-1 1M14 17l-1 1a4 4 0 1 1-6-6l1-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer({
  contact,
  social,
  gallery,
  legal,
}: {
  contact: ContactInfo;
  social: SocialLink[];
  gallery: FooterGalleryImage[];
  legal: { termsEnabled: boolean; refundEnabled: boolean };
}) {
  return (
    <footer className="relative bg-sky">
      {/* Footer content */}
      <div className="mx-auto max-w-340 px-6 pb-10 pt-16 sm:pt-20">
        <h3 className="font-display text-center text-xl text-navy sm:text-2xl">
          Beyond Our Services
        </h3>

        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {gallery.map((img, i) => (
            <div
              key={`${img.alt}-${i}`}
              className="relative aspect-square overflow-hidden rounded-xl shadow-thumb"
            >
              <Image
                src={img.image}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-navy/10" />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Office Address */}
          <div>
            <h4 className="font-display text-lg text-navy">Office Address</h4>
            <p className="font-condensed mt-4 text-sm leading-relaxed text-navy-deep/70">
              {contact.address}
            </p>
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="font-condensed mt-3 block text-sm font-semibold text-navy hover:text-gold"
            >
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="font-condensed block text-sm font-semibold text-navy hover:text-gold"
            >
              {contact.email}
            </a>
          </div>

          {/* Subscribe newsletter */}
          <div>
            <h4 className="font-display text-lg text-navy">Subscribe newsletter</h4>
            <NewsletterForm />
            <p className="font-condensed mt-3 text-xs text-navy-deep/60">
              By subscribing, you agree to our{" "}
              <Link href="/privacy-policy" className="text-navy underline hover:text-gold">
                Privacy Policy
              </Link>
              .
            </p>
            {social.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {social.map((link, i) => (
                  <a
                    key={`${link.platform}-${i}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition hover:bg-gold"
                  >
                    <SocialIcon link={link} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* My account */}
          <div>
            <h4 className="font-display text-lg text-navy">My account</h4>
            <ul className="font-condensed mt-4 flex flex-col gap-3 text-sm text-navy-deep/70">
              {FOOTER_ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-navy">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-display text-lg text-navy">Service</h4>
            <ul className="font-condensed mt-4 flex flex-col gap-3 text-sm text-navy-deep/70">
              {FOOTER_SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-navy">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-navy/10" />

        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/assets/AAAviation_LOGO_Main_OB.svg"
              alt="AAA Aviation Logo"
              width={132}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
          <div className="text-center">
            <p className="font-condensed text-xs text-navy-deep/60">
              Copyright &copy; {new Date().getFullYear()} A&amp;A Aviation. All rights reserved.
            </p>
            <div className="font-condensed mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-navy-deep/50">
              <Link href="/privacy-policy" className="hover:text-navy hover:underline">
                Privacy Policy
              </Link>
              {legal.termsEnabled && (
                <Link href="/terms-and-conditions" className="hover:text-navy hover:underline">
                  Terms &amp; Conditions
                </Link>
              )}
              {legal.refundEnabled && (
                <Link href="/refund-policy" className="hover:text-navy hover:underline">
                  Refund Policy
                </Link>
              )}
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-condensed text-xs font-bold uppercase tracking-widest text-navy transition hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
