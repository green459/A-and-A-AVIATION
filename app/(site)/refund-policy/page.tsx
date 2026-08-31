import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";
import { getRefundPolicy, getContactInfo } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await getRefundPolicy();
  if (!policy.enabled) return {};

  const seo = await getSeoMeta("/refund-policy", getSeoFallback("/refund-policy"));
  return toMetadata(seo);
}

/** Renders admin-entered plain text as paragraphs — every line becomes its
 * own <p>, so this never needs to treat the text as trusted HTML. */
function TextParagraphs({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <>
      {lines.map((line, i) => (
        <p key={i} className={i > 0 ? "mt-3" : undefined}>
          {line}
        </p>
      ))}
    </>
  );
}

export default async function RefundPolicyPage() {
  const [policy, contactInfo] = await Promise.all([
    getRefundPolicy(),
    getContactInfo(),
  ]);

  if (!policy.enabled) notFound();

  return (
    <div className="w-full flex-1 bg-sky py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-condensed text-base font-medium text-teal sm:text-lg">
          Legal
        </p>
        <h1 className="font-display mt-3 text-4xl font-normal text-navy sm:text-5xl">
          Refund Policy
        </h1>
        <p className="font-condensed mt-4 text-sm text-navy-deep/60">
          Last updated: {policy.lastUpdated}
        </p>

        <p className="font-condensed mt-8 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
          {policy.intro}
        </p>

        <div className="mt-12 space-y-10">
          {policy.sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-2xl font-bold text-navy">
                {section.title}
              </h2>
              <div className="font-condensed mt-3 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
                <TextParagraphs text={section.body} />
              </div>
            </div>
          ))}

          <div>
            <h2 className="font-display text-2xl font-bold text-navy">
              Contact Us
            </h2>
            <p className="font-condensed mt-3 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
              For any refund request or question, email us at{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="font-semibold text-navy underline hover:text-gold"
              >
                {contactInfo.email}
              </a>{" "}
              or visit our{" "}
              <Link
                href="/contact"
                className="font-semibold text-navy underline hover:text-gold"
              >
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
