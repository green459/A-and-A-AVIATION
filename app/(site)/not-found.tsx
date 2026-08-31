import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center bg-sky px-6 py-24 text-center sm:py-32">
      <span className="font-display text-[clamp(4rem,18vw,10rem)] font-bold leading-none text-navy/10">
        404
      </span>
      <h1 className="font-display -mt-6 text-3xl font-normal text-navy sm:text-4xl">
        Page Not Found
      </h1>
      <p className="font-condensed mt-4 max-w-md text-sm leading-relaxed text-navy-deep/70 sm:text-base">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="font-display rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-navy transition hover:bg-gold-hover"
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="font-display rounded-full border border-navy/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-navy transition hover:border-navy/40"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
