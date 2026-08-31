"use client";

/**
 * Navbar — shared across every page via app/layout.tsx.
 *
 * Renders a solid (white) bar by default. On routes listed in
 * OVERLAY_ROUTES (pages whose hero is a dark, full-bleed image) it starts
 * transparent with white text and only switches to the solid bar once the
 * user scrolls, so the links stay legible over the hero.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { PublicService } from "@/lib/data/services";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavLink {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const OVERLAY_ROUTES = ["/"];

function ChevronIcon({
  open,
  className = "h-3 w-3",
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`${className} shrink-0 opacity-80 transition-transform duration-200 ${
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
  );
}

export default function Navbar({
  services,
  phone,
}: {
  services: PublicService[];
  phone: string;
}) {
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  const NAV_LINKS: NavLink[] = useMemo(() => {
    const servicesDropdown: DropdownItem[] = services.map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
      description: service.category,
    }));

    return [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services", dropdown: servicesDropdown },
      { label: "About Us", href: "/about" },
      { label: "Destinations", href: "/destinations" },
      { label: "Travel Guide", href: "/blogs" },
      { label: "Contact Us", href: "/contact" },
    ];
  }, [services]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname() ?? "/";
  const overlay = OVERLAY_ROUTES.includes(pathname);
  // Solid (white) bar when scrolled — or on pages without a dark hero.
  const solid = scrolled || !overlay;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every open menu whenever the route changes. Adjusted during
  // render (React's documented pattern for resetting state on a prop
  // change) rather than in an effect, so it takes effect in the same
  // commit instead of triggering an extra cascading render.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
  }

  // Desktop dropdown: close on outside click or Escape.
  useEffect(() => {
    if (!openDropdown) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDropdown(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDropdown]);

  return (
    <header
      ref={headerRef}
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-navy-nav shadow-nav" : "bg-transparent"
      }`}
    >
      <nav
        className="font-body mx-auto flex max-w-1600 items-center justify-between px-6 py-4 sm:px-8 lg:px-16"
        aria-label="Main navigation"
      >
        {/* Logo — white text variant always (works on transparent + navy bg) */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/assets/AAAviation_LOGO_Main.svg"
            alt="AAA Aviation Logo"
            width={148}
            height={56}
            className="h-10 w-auto sm:h-14"
            loading="eager"
          />
        </Link>

        {/* Links (desktop) */}
        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="relative">
              <div
                className="flex items-center gap-1"
                onMouseEnter={() =>
                  link.dropdown && setOpenDropdown(link.label)
                }
                onMouseLeave={() =>
                  link.dropdown &&
                  setOpenDropdown((current) =>
                    current === link.label ? null : current,
                  )
                }
              >
                <Link
                  href={link.href}
                  className="text-[15px] font-medium text-white/90 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown((current) =>
                        current === link.label ? null : link.label,
                      )
                    }
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === link.label}
                    aria-label={`Toggle ${link.label} menu`}
                    className="-m-1.5 rounded-full p-1.5 text-white/70 transition-colors hover:text-gold"
                  >
                    <ChevronIcon open={openDropdown === link.label} />
                  </button>
                )}

                {link.dropdown && (
                  <div
                    role="menu"
                    className={`absolute left-0 top-full z-50 w-72 pt-3 transition-all duration-200 ${
                      openDropdown === link.label
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul className="overflow-hidden rounded-2xl border border-navy/10 bg-white p-2 shadow-menu">
                      {link.dropdown.map((item) => (
                        <li key={item.href} role="none">
                          <Link
                            href={item.href}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="flex flex-col rounded-xl px-4 py-2.5 transition-colors hover:bg-sky"
                          >
                            <span className="font-body text-sm font-semibold text-navy">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="font-condensed text-xs text-navy-deep/60">
                                {item.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                      <li
                        role="none"
                        className="mt-1 border-t border-navy/10 pt-1"
                      >
                        <Link
                          href={link.href}
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-sky"
                        >
                          View All {link.label}
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 8h10M9 4l4 4-4 4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Call Now (desktop) */}
        <a
          href={telHref}
          className="font-display hidden rounded-full bg-gold px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-gold-hover lg:inline-block"
        >
          Call Now
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:border-gold hover:text-gold lg:hidden border-white/20 text-white`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`grid overflow-hidden px-6 transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          menuOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
        }`}
      >
        {/* The grid-rows-[0fr] collapse only zeroes out this wrapper — the
            border/padding below live one level deeper so they don't force a
            minimum row height and leave a bare rounded sliver when closed. */}
        <div className="min-h-0 overflow-hidden">
          <ul
            className={`font-body flex min-h-0 flex-col gap-1 overflow-hidden rounded-2xl border p-3 transition-colors duration-300 ${
              solid
                ? "border-white/10 bg-navy-nav shadow-menu"
                : "border-white/10 bg-ink/95 backdrop-blur"
            }`}
          >
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMobileDropdown((current) =>
                      current === link.label ? null : link.label,
                    )
                  }
                  aria-expanded={openMobileDropdown === link.label}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  {link.label}
                  <ChevronIcon
                    open={openMobileDropdown === link.label}
                    className="h-3.5 w-3.5"
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                    openMobileDropdown === link.label
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <ul className="min-h-0 overflow-hidden pl-3">
                    {link.dropdown.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-lg px-4 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-gold"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-gold"
                      >
                        View All {link.label}
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
          <li className="mt-2">
            <a
              href={telHref}
              className="font-display flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-gold-hover"
            >
              Call Now
            </a>
          </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
