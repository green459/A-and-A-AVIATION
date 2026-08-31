"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import Link from "next/link";
import ContactMap from "./home/ContactMap";
import type { ContactInfo } from "@/lib/data/settings";

// Fallbacks so the form still renders sensibly if a caller forgets to pass
// data fetched from the admin-managed settings.
const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+88 1965 323232",
  whatsapp: "8801965323232",
  email: "info@aaaviation.com",
  address: "Ka 39/1 (3rd Floor), Pragati Sarani, Kuril, Dhaka",
  latitude: 23.8232,
  longitude: 90.4283,
};
const DEFAULT_SERVICE_CATEGORIES = [
  "Air Ticketing",
  "Tourist Visa",
  "Work & Family Visa",
  "Hotel Booking",
  "Document Legalization",
  "Other",
];

function ContactIcon({ type }: { type: "pin" | "phone" | "mail" }) {
  const shared = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "pin") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
        <path
          d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12z"
          {...shared}
        />
        <circle cx="12" cy="9" r="2.5" {...shared} />
      </svg>
    );
  }
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
        <path
          d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
          {...shared}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" {...shared} />
      <path d="M3 7l9 6 9-6" {...shared} />
    </svg>
  );
}

function ServiceCategorySelect({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <input type="hidden" name="serviceCategory" value={value} />
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg border border-navy/15 px-4 py-3.5 text-left transition-colors hover:border-navy/30"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-navy/50"
          aria-hidden="true"
        >
          <path
            d="M4 4h7l9 9-7 7-9-9V4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" />
        </svg>
        <span
          className={`font-condensed flex-1 truncate text-sm ${
            value ? "text-navy-deep" : "text-navy-deep/50"
          }`}
        >
          {value || "Select Services Category"}
        </span>
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 text-navy/50 transition-transform duration-200 ${
            open ? "-rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path
            d="M2 4 L6 8 L10 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 top-full z-20 pt-2 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="max-h-64 overflow-auto rounded-xl border border-navy/10 bg-white p-1.5 shadow-menu">
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                role="option"
                aria-selected={value === category}
                onClick={() => {
                  onChange(category);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors ${
                  value === category
                    ? "bg-sky font-semibold text-navy"
                    : "text-navy-deep/80 hover:bg-sky/60"
                }`}
              >
                {category}
                {value === category && (
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 shrink-0 text-navy"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5l3 3 7-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";
type ContactFieldName = "name" | "email" | "phone" | "message" | "agree";
type FieldErrors = Partial<Record<ContactFieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Same checks the server re-runs (see app/api/inquiries/route.ts) — this
 * just lets the form show them inline, next to the field that's actually
 * wrong, before a request even goes out. */
function validateContactForm(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length > 200) errors.name = "That name is too long.";

  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (!formData.get("agree")) {
    errors.agree = "Please agree to the terms to continue.";
  }

  return errors;
}

export default function Contact({
  contactInfo = DEFAULT_CONTACT_INFO,
  serviceCategories = DEFAULT_SERVICE_CATEGORIES,
  phoneFieldEnabled = true,
  termsEnabled = true,
  refundEnabled = true,
}: {
  contactInfo?: ContactInfo;
  serviceCategories?: string[];
  phoneFieldEnabled?: boolean;
  termsEnabled?: boolean;
  refundEnabled?: boolean;
}) {
  const [serviceCategory, setServiceCategory] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldError = (field: ContactFieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  // Privacy Policy always exists; Terms & Conditions and Refund Policy are
  // each admin-toggleable, so only link to the ones currently live.
  const legalLinks: { label: string; href: string }[] = [
    ...(termsEnabled
      ? [{ label: "Terms & Conditions", href: "/terms-and-conditions" }]
      : []),
    ...(refundEnabled
      ? [{ label: "Refund Policy", href: "/refund-policy" }]
      : []),
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const contactCards: {
    title: string;
    lines: string[];
    icon: "pin" | "phone" | "mail";
  }[] = [
    { title: "Address Line", lines: [contactInfo.address], icon: "pin" },
    { title: "Phone Number", lines: [contactInfo.phone], icon: "phone" },
    { title: "Mail Address", lines: [contactInfo.email], icon: "mail" },
  ];

  const handleContactSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const clientErrors = validateContactForm(formData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setErrorMessage("");

    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Map the server's field-level messages (see
        // app/api/inquiries/route.ts) onto the same inline slots the
        // client-side checks above use, so a validation failure the client
        // didn't catch (e.g. the server trims differently) still shows up
        // next to the right field instead of only in the banner.
        const serverFieldErrors = data?.fieldErrors as
          | Record<string, string[] | undefined>
          | undefined;
        if (serverFieldErrors) {
          const mapped: FieldErrors = {};
          (["name", "email", "phone", "message"] as const).forEach((field) => {
            const message = serverFieldErrors[field]?.[0];
            if (message) mapped[field] = message;
          });
          if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
        }
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }

      setStatus("success");
      form.reset();
      setServiceCategory("");
      setFieldErrors({});
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  };

  return (
    <section className="bg-sky py-20 sm:py-24">
      <div className="mx-auto max-w-340 px-6">
        {/* Info cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {contactCards.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/70 p-8 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center text-navy">
                <ContactIcon type={item.icon} />
              </div>
              <p className="font-display mt-3 text-lg font-bold text-navy">
                {item.title}
              </p>
              {item.lines.map((line) => (
                <p
                  key={line}
                  className="font-condensed text-sm text-navy-deep/70"
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Get in touch + form */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading + map */}
          <div>
            <h2 className="font-display text-4xl font-normal text-navy sm:text-5xl">
              Get in touch
            </h2>
            <p className="font-condensed mt-4 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
              Contact our team today for reliable travel, visa, and flight
              booking support tailored to your needs.
            </p>
            <div className="relative mt-8 h-80 w-full sm:h-96">
              <ContactMap
                latitude={contactInfo.latitude}
                longitude={contactInfo.longitude}
                address={contactInfo.address}
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-3xl bg-white p-8 sm:p-10">
            <h3 className="font-display text-3xl font-normal text-navy">
              Fill Up The Form
            </h3>
            <p className="font-condensed mt-2 text-sm text-navy-deep/70">
              Your email address will not be published. Required fields are
              marked *
            </p>

            <form
              onSubmit={handleContactSubmit}
              noValidate
              className="mt-8 flex flex-col gap-4"
            >
              {/* Honeypot — real visitors never see or fill this in. The
                  `hidden` attribute still lets it submit with the form
                  (unlike `disabled`), so a bot that fills it in trips it. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                hidden
              />

              {status === "success" && (
                <p
                  role="status"
                  className="font-condensed rounded-lg bg-teal/10 px-4 py-3 text-sm text-navy"
                >
                  Thanks — your message has been sent. We&apos;ll get back to
                  you shortly.
                </p>
              )}
              {status === "error" && (
                <p
                  role="alert"
                  className="font-condensed rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              <div>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 ${
                    fieldErrors.name ? "border-red-400" : "border-navy/15"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-navy/50"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M4.5 20c1.5-3.5 4.5-5.5 7.5-5.5s6 2 7.5 5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name*"
                    aria-invalid={!!fieldErrors.name}
                    onChange={() => clearFieldError("name")}
                    className="font-condensed w-full bg-transparent text-sm text-navy-deep placeholder:text-navy-deep/50 focus:outline-none"
                  />
                </div>
                {fieldErrors.name && (
                  <p role="alert" className="font-condensed mt-1.5 text-xs text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 ${
                    fieldErrors.email ? "border-red-400" : "border-navy/15"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-navy/50"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M3 7l9 6 9-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    aria-invalid={!!fieldErrors.email}
                    onChange={() => clearFieldError("email")}
                    className="font-condensed w-full bg-transparent text-sm text-navy-deep placeholder:text-navy-deep/50 focus:outline-none"
                  />
                </div>
                {fieldErrors.email && (
                  <p role="alert" className="font-condensed mt-1.5 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {phoneFieldEnabled && (
                <div>
                  <div
                    className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 ${
                      fieldErrors.phone ? "border-red-400" : "border-navy/15"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 text-navy/50"
                      aria-hidden="true"
                    >
                      <path
                        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone / Mobile Number"
                      aria-invalid={!!fieldErrors.phone}
                      onChange={() => clearFieldError("phone")}
                      className="font-condensed w-full bg-transparent text-sm text-navy-deep placeholder:text-navy-deep/50 focus:outline-none"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p role="alert" className="font-condensed mt-1.5 text-xs text-red-600">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              )}

              <ServiceCategorySelect
                value={serviceCategory}
                onChange={setServiceCategory}
                categories={serviceCategories}
              />

              <div>
                <div
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3.5 ${
                    fieldErrors.message ? "border-red-400" : "border-navy/15"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-navy/50"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Enter Your Message here"
                    aria-invalid={!!fieldErrors.message}
                    onChange={() => clearFieldError("message")}
                    className="font-condensed w-full resize-none bg-transparent text-sm text-navy-deep placeholder:text-navy-deep/50 focus:outline-none"
                  />
                </div>
                {fieldErrors.message && (
                  <p role="alert" className="font-condensed mt-1.5 text-xs text-red-600">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-condensed flex items-start gap-2 text-xs text-navy-deep/70">
                  <input
                    type="checkbox"
                    name="agree"
                    aria-invalid={!!fieldErrors.agree}
                    onChange={() => clearFieldError("agree")}
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded accent-navy ${
                      fieldErrors.agree ? "ring-2 ring-red-400" : ""
                    }`}
                  />
                  <span>
                    I agree to{" "}
                    {legalLinks.map((link, i) => (
                      <span key={link.href}>
                        {i > 0 && (i === legalLinks.length - 1 ? " and " : ", ")}
                        <Link
                          href={link.href}
                          target="_blank"
                          className="font-semibold text-navy underline hover:text-gold"
                        >
                          {link.label}
                        </Link>
                      </span>
                    ))}{" "}
                    of A&amp;A Aviation.
                  </span>
                </label>
                {fieldErrors.agree && (
                  <p role="alert" className="font-condensed mt-1.5 text-xs text-red-600">
                    {fieldErrors.agree}
                  </p>
                )}
              </div>

              {/* Cloudflare Turnstile is currently disabled (no loader
                  script mounted) — honeypot + IP rate limiting above cover
                  spam for now. To re-enable: restore the next/script loader
                  and this widget div, and the server will pick the token up
                  automatically (app/api/inquiries/route.ts verifies it
                  when present, no longer requires it). */}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="font-display mt-2 rounded-lg bg-navy py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
