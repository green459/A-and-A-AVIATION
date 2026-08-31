import Link from "next/link";
import { SEO_PAGES, getAllSeoMeta } from "@/lib/data/seo";
import SeoPageForm from "./SeoPageForm";

export const metadata = { title: "SEO" };

export default async function SeoPage() {
  const overrides = await getAllSeoMeta();

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">SEO &amp; metadata</h1>
      <p className="mt-1 text-sm text-gray-500">
        Titles and descriptions used for search results and social sharing.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-display text-lg text-navy">
          Services, blogs &amp; destinations
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Each item has its own optional SEO override — open it and expand
          the &quot;SEO (optional)&quot; section near the bottom of the form.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/controller/services"
            className="text-sm font-medium text-navy hover:underline"
          >
            Manage services →
          </Link>
          <Link
            href="/controller/blogs"
            className="text-sm font-medium text-navy hover:underline"
          >
            Manage blogs →
          </Link>
          <Link
            href="/controller/destinations"
            className="text-sm font-medium text-navy hover:underline"
          >
            Manage destinations →
          </Link>
        </div>
      </div>

      <h2 className="font-display mt-8 text-lg text-navy">Static pages</h2>
      <div className="mt-4 flex max-w-2xl flex-col gap-6">
        {SEO_PAGES.map((page) => {
          const override = overrides.get(page.path);
          const values = override ?? page.fallback;
          return (
            <SeoPageForm
              key={page.path}
              path={page.path}
              label={page.label}
              title={values.title}
              description={values.description}
              noindex={values.noindex}
            />
          );
        })}
      </div>
    </div>
  );
}
