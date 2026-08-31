import Link from "next/link";
import { Inbox, Briefcase, Newspaper, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus } from "@/lib/generated/prisma/enums";
import { formatCompactNumber } from "@/lib/format-number";
import StatusBadge from "./inquiries/StatusBadge";
import InquiryStatusPieChart from "./InquiryStatusPieChart";
import NewsletterPieChart from "./NewsletterPieChart";

export const metadata = { title: "Dashboard" };

const EMPTY_STATUS_COUNTS: Record<InquiryStatus, number> = {
  NEW: 0,
  IN_PROGRESS: 0,
  RESOLVED: 0,
  ARCHIVED: 0,
};

/** Every count here comes from either a single `GROUP BY` (inquiry status,
 * newsletter active/inactive) or a plain `COUNT(*)` — never a `findMany` the
 * app then counts in JS. Grouping by status/isActive replaces what would
 * otherwise be 4 (and 2) separate round trips with one each, so this page
 * runs a fixed 6 queries total regardless of how much data exists, rather
 * than one that grows with the number of statuses tracked. */
async function getStats() {
  const [
    inquiryStatusGroups,
    services,
    blogs,
    destinations,
    newsletterGroups,
    recentInquiries,
  ] = await Promise.all([
    prisma.inquiry.groupBy({ by: ["status"], _count: true }),
    prisma.service.count(),
    prisma.blog.count(),
    prisma.destination.count(),
    prisma.newsletterSubscriber.groupBy({ by: ["isActive"], _count: true }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const statusCounts = { ...EMPTY_STATUS_COUNTS };
  for (const group of inquiryStatusGroups) {
    statusCounts[group.status] = group._count;
  }
  const totalInquiries = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  let activeSubscribers = 0;
  let totalSubscribers = 0;
  for (const group of newsletterGroups) {
    totalSubscribers += group._count;
    if (group.isActive) activeSubscribers = group._count;
  }

  return {
    newInquiries: statusCounts.NEW,
    totalInquiries,
    services,
    blogs,
    destinations,
    statusCounts,
    activeSubscribers,
    totalSubscribers,
    recentInquiries,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "New inquiries",
      value: stats.newInquiries,
      sub: `${formatCompactNumber(stats.totalInquiries)} total`,
      href: "/controller/inquiries",
      icon: Inbox,
    },
    {
      label: "Services",
      value: stats.services,
      sub: "published & drafts",
      href: "/controller/services",
      icon: Briefcase,
    },
    {
      label: "Blog posts",
      value: stats.blogs,
      sub: "published & drafts",
      href: "/controller/blogs",
      icon: Newspaper,
    },
    {
      label: "Destinations",
      value: stats.destinations,
      sub: "published & drafts",
      href: "/controller/destinations",
      icon: MapPin,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        A quick overview of the site&apos;s content and activity.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <Icon className="h-5 w-5 text-navy/60" />
              </div>
              <p className="mt-2 text-3xl font-bold text-navy">
                {formatCompactNumber(card.value)}
              </p>
              <p className="mt-1 text-xs text-gray-400">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg text-navy">
              Inquiries by status
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Where every submitted inquiry currently stands.
            </p>
            <div className="mt-1">
              <InquiryStatusPieChart counts={stats.statusCounts} />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg text-navy">
              Newsletter signups
            </h2>
            <div className="mt-1">
              {stats.totalSubscribers === 0 ? (
                <p className="py-4 text-sm text-gray-400">No signups yet.</p>
              ) : (
                <NewsletterPieChart
                  active={stats.activeSubscribers}
                  total={stats.totalSubscribers}
                />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg text-navy">
                Recent inquiries
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                The latest messages from the contact form.
              </p>
            </div>
            <Link
              href="/controller/inquiries"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5">
            {stats.recentInquiries.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                No inquiries yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {stats.recentInquiries.map((inquiry) => (
                  <li key={inquiry.id}>
                    <Link
                      href={`/controller/inquiries/${inquiry.id}`}
                      className="flex items-center justify-between gap-4 py-3 transition hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-navy">
                          {inquiry.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {inquiry.serviceCategory || "General inquiry"} ·{" "}
                          {inquiry.email}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="hidden text-xs text-gray-400 sm:inline">
                          {inquiry.createdAt.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <StatusBadge status={inquiry.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
