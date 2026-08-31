"use client";

import { useState, type SubmitEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react";

import Contact from "@/components/Contact";
import type { PublicBlogPost } from "@/lib/data/blogs";

export default function BlogDetailClient({
  post,
  recentPosts,
  relatedPosts,
  categories,
}: {
  post: PublicBlogPost;
  recentPosts: PublicBlogPost[];
  relatedPosts: PublicBlogPost[];
  categories: { name: string; count: number }[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    router.push(query ? `/blogs?q=${encodeURIComponent(query)}` : "/blogs");
  };

  return (
    <div className="bg-sky">
      <div className="mx-auto w-full max-w-340 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* ================= MAIN CONTENT ================= */}
          <div className="min-w-0 space-y-10">
            <Link
              href="/blogs"
              className="font-body inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              All Articles
            </Link>

            {/* Title */}
            <div>
              <span className="font-body inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                {post.category}
              </span>
              <h1 className="font-display mt-4 text-3xl font-bold text-navy sm:text-4xl">
                {post.title}
              </h1>
              <div className="font-body mt-3 flex items-center gap-2 text-sm text-navy-deep">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy-deep" />
                {post.date}
              </div>
              <p className="font-condensed mt-4 text-sm leading-relaxed text-navy-deep/70 sm:text-base">
                {post.excerpt}
              </p>
            </div>

            {/* Cover image */}
            <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-96">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Body */}
            <div
              className="prose prose-sm sm:prose-base max-w-none font-condensed text-navy-deep/70 prose-headings:font-display prose-headings:text-navy prose-p:leading-relaxed prose-a:text-navy prose-a:underline prose-strong:text-navy prose-blockquote:border-navy prose-blockquote:text-navy-deep/60 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Key Takeaways */}
            <div>
              <h3 className="font-display mb-4 text-2xl font-bold text-navy">
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {post.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span className="font-condensed text-sm font-bold text-ink sm:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* More from the same category */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="font-display mb-6 text-2xl font-bold text-navy">
                  More in {post.category}
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blogs/${related.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-display line-clamp-2 text-sm font-bold leading-snug text-navy group-hover:text-gold">
                          {related.title}
                        </p>
                        <p className="font-condensed mt-1 text-xs text-navy-deep/50">
                          {related.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="space-y-10 lg:pt-1">
            {/* Search — routes to the blog list, pre-filtered by query */}
            <div>
              <h4 className="font-display border-l-4 border-navy pl-3 text-lg font-bold text-navy">
                Search Here
              </h4>
              <form onSubmit={handleSearchSubmit} className="relative mt-4">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search here..."
                  className="font-condensed w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm text-ink placeholder:text-navy-deep/40 focus:border-navy focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-navy hover:bg-blue-50"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-display border-l-4 border-navy pl-3 text-lg font-bold text-navy">
                Categories
              </h4>
              <ul className="mt-4 divide-y divide-gray-100">
                {categories.map((cat) => (
                  <li
                    key={cat.name}
                    className="flex items-center justify-between py-4 first:pt-0"
                  >
                    <Link
                      href={`/blogs?category=${encodeURIComponent(cat.name)}`}
                      className="font-condensed text-sm text-navy-deep/70 hover:text-navy"
                    >
                      {cat.name}
                    </Link>
                    <span className="font-condensed text-sm text-navy-deep/50">
                      {String(cat.count).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent News */}
            <div>
              <h4 className="font-display border-l-4 border-navy pl-3 text-lg font-bold text-navy">
                Recent News
              </h4>
              <ul className="mt-4 space-y-4">
                {recentPosts.map((news) => (
                  <li key={news.slug}>
                    <Link
                      href={`/blogs/${news.slug}`}
                      className="group flex items-center gap-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={news.image}
                          alt={news.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-display line-clamp-2 text-sm font-bold leading-snug text-navy group-hover:text-gold">
                          {news.title}
                        </p>
                        <p className="font-condensed mt-1 text-xs text-navy-deep/50">
                          {news.date}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Consultancy CTA */}
            <div className="rounded-2xl bg-navy p-8">
              <h4 className="font-display text-xl font-bold text-white">
                Free Consultancy
              </h4>
              <Link
                href="/contact"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-white"
              >
                Call Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Contact />
    </div>
  );
}
