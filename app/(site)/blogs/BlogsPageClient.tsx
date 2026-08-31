"use client";

import { Suspense, useMemo, useState, type SubmitEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";

import Contact from "@/components/Contact";
import type { PublicBlogPost } from "@/lib/data/blogs";
import type {
  ContactInfo,
  ContactFormFieldsSettings,
  BlogsHero,
} from "@/lib/data/settings";
import {
  DARK_HERO_OVERLAY,
  DARK_HERO_SUBTEXT_SHADOW,
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

const PAGE_SIZE = 6;

export default function BlogsPageClient({
  posts,
  hero,
  contactInfo,
  serviceCategories,
  contactFormFields,
  termsEnabled,
  refundEnabled,
}: {
  posts: PublicBlogPost[];
  hero: BlogsHero;
  contactInfo: ContactInfo;
  serviceCategories: string[];
  contactFormFields: ContactFormFieldsSettings;
  termsEnabled: boolean;
  refundEnabled: boolean;
}) {
  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center bg-sky">
      {/* ================= HERO ================= */}
      <section className="relative isolate max-h-9/12 overflow-hidden">
        <Image
          src={hero.image}
          alt="Travelers exploring a coastal city"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{ background: DARK_HERO_OVERLAY }}
        />
        <motion.div
          className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 pb-24 pt-8 text-center"
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          {hero.eyebrow && (
            <motion.p
              variants={heroItem}
              style={DARK_HERO_SUBTEXT_SHADOW}
              className="font-condensed text-base font-medium tracking-wide text-white/90 sm:text-lg"
            >
              {hero.eyebrow}
            </motion.p>
          )}
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
              style={DARK_HERO_SUBTEXT_SHADOW}
              className="font-condensed mt-5 max-w-2xl text-lg font-medium text-white sm:text-xl"
            >
              {hero.subtitle}
            </motion.p>
          )}
        </motion.div>
      </section>

      <Suspense fallback={null}>
        <BlogsSection posts={posts} />
      </Suspense>

      <Contact
        contactInfo={contactInfo}
        serviceCategories={serviceCategories}
        phoneFieldEnabled={contactFormFields.phoneFieldEnabled}
        termsEnabled={termsEnabled}
        refundEnabled={refundEnabled}
      />
    </div>
  );
}

function BlogsSection({ posts }: { posts: PublicBlogPost[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") ?? "",
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [posts]);

  const recentPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        !activeCategory || post.category === activeCategory;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;
  const hasActiveFilters = Boolean(query || activeCategory);

  const syncUrl = (nextQuery: string, nextCategory: string) => {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextCategory) params.set("category", nextCategory);
    router.replace(params.size ? `/blogs?${params.toString()}` : "/blogs", {
      scroll: false,
    });
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    syncUrl(query, activeCategory);
  };

  const handleCategoryClick = (name: string) => {
    const nextCategory = activeCategory === name ? "" : name;
    setActiveCategory(nextCategory);
    setVisibleCount(PAGE_SIZE);
    syncUrl(query, nextCategory);
  };

  const clearFilters = () => {
    setQuery("");
    setActiveCategory("");
    setVisibleCount(PAGE_SIZE);
    router.replace("/blogs", { scroll: false });
  };

  return (
    <section className="bg-sky py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* ================= MAIN: POST GRID ================= */}
          <div className="min-w-0">
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-5 py-3 shadow-card">
                <p className="font-condensed text-sm text-navy-deep/70">
                  {activeCategory && (
                    <>
                      Category: <span className="font-bold text-navy">{activeCategory}</span>
                    </>
                  )}
                  {activeCategory && query && " · "}
                  {query && (
                    <>
                      Search: <span className="font-bold text-navy">&ldquo;{query}&rdquo;</span>
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-body inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
            )}

            {visiblePosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {visiblePosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blogs/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="font-body absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="font-body flex items-center gap-2 text-sm text-navy-deep">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy-deep" />
                        {post.date}
                      </div>
                      <h3 className="font-display mt-3 line-clamp-2 text-xl leading-snug text-navy">
                        {post.title}
                      </h3>
                      <p className="font-condensed mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-navy-deep/70">
                        {post.excerpt}
                      </p>
                      <span className="font-body mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-navy">
                        Read More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-12 text-center shadow-card">
                <p className="font-display text-xl text-navy">
                  No articles found
                </p>
                <p className="font-condensed mt-2 text-sm text-navy-deep/60">
                  Try a different search term or category.
                </p>
              </div>
            )}

            {/* Count + Load More */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="font-condensed text-sm text-navy-deep/60">
                Showing {visiblePosts.length} of {filteredPosts.length}{" "}
                articles
              </p>
              {hasMore && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) =>
                      Math.min(count + PAGE_SIZE, filteredPosts.length),
                    )
                  }
                  className="font-display rounded-full bg-navy px-10 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-navy-hover"
                >
                  Load More
                </button>
              )}
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="space-y-10 lg:pt-1">
            {/* Search */}
            <div>
              <h4 className="font-display border-l-4 border-navy pl-3 text-lg font-bold text-navy">
                Search Here
              </h4>
              <form onSubmit={handleSearchSubmit} className="relative mt-4">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => handleSearchChange(event.target.value)}
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
                  <li key={cat.name}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`flex w-full items-center justify-between py-4 text-left transition-colors first:pt-0 ${
                        activeCategory === cat.name
                          ? "text-navy"
                          : "text-navy-deep/70 hover:text-navy"
                      }`}
                    >
                      <span className="font-condensed text-sm font-bold">
                        {cat.name}
                      </span>
                      <span className="font-condensed text-sm text-navy-deep/50">
                        {String(cat.count).padStart(2, "0")}
                      </span>
                    </button>
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
                {recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="group flex items-center gap-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-display line-clamp-2 text-sm font-bold leading-snug text-navy group-hover:text-gold">
                          {post.title}
                        </p>
                        <p className="font-condensed mt-1 text-xs text-navy-deep/50">
                          {post.date}
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
    </section>
  );
}
