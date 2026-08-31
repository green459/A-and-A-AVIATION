import type { StaticImageData } from "next/image";

import gallery1 from "@/components/home/images/gallery-1.png";
import gallery2 from "@/components/home/images/gallery-2.png";
import gallery3 from "@/components/home/images/gallery-3.png";
import gallery4 from "@/components/home/images/gallery-4.png";
import edgeTraveler from "@/components/home/images/gallery2/edge-traveler.png";
import hijabTraveler from "@/components/home/images/gallery2/hijab-traveler.png";
import backpacker from "@/components/home/images/gallery2/backpacker.png";
import cityRiver from "@/components/home/images/gallery2/city-river.png";
import edgeCanal from "@/components/home/images/gallery2/edge-canal.png";

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: StaticImageData;
  content: string[];
  highlights: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "portugal-d6-family-visa-guide",
    category: "Visa Guide",
    title:
      "Portugal D6 Family Visa: Eligibility, Requirements & Application Process",
    excerpt:
      "Everything you need to know before applying for a Portugal D6 family visa, from eligibility rules to the documents embassies actually ask for.",
    date: "14 July 2026",
    image: cityRiver,
    content: [
      "The Portugal D6 family reunification visa lets close relatives of a Portuguese resident join them in the country, but embassies are strict about proof of relationship and financial support. Most rejections come down to incomplete paperwork rather than eligibility itself.",
      "Processing usually takes 60-90 days once the file is complete, so it pays to start gathering civil documents, translations, and proof of accommodation well ahead of your target travel date.",
    ],
    highlights: [
      "Sponsor must hold a valid Portuguese residence permit",
      "Civil documents need apostille or embassy legalization",
      "Proof of stable accommodation and income is mandatory",
      "Apply through the Portuguese consulate in your home country",
    ],
  },
  {
    slug: "student-visa-101-guide",
    category: "Visa Guide",
    title: "Student Visa 101: A Step-by-Step Guide for First-Time Applicants",
    excerpt:
      "A first-timer's walkthrough of the student visa process — from choosing the right documents to preparing for your embassy interview.",
    date: "02 July 2026",
    image: backpacker,
    content: [
      "A student visa application is judged as much on how it's presented as on the underlying facts. Admission letters, tuition payment proof, and a clear financial sponsorship trail are the three pillars every embassy officer checks first.",
      "First-time applicants often underestimate the interview. Being able to explain your course choice, university, and post-study plans in your own words matters more than memorized answers.",
    ],
    highlights: [
      "Secure your admission letter before booking a visa appointment",
      "Show at least one full academic year of funds",
      "Keep translations and originals together in one file",
      "Practice explaining your study plan in plain language",
    ],
  },
  {
    slug: "5-common-visa-interview-mistakes",
    category: "Visa Guide",
    title: "5 Common Visa Interview Mistakes & How to Avoid Them",
    excerpt:
      "Simple mistakes derail otherwise strong visa applications every day. Here's what to watch for before you walk into the interview room.",
    date: "21 June 2026",
    image: hijabTraveler,
    content: [
      "Most visa refusals aren't about the applicant's intentions — they're about inconsistent answers, missing supporting documents, or a mismatch between the file and what's said in the interview.",
      "A calm, well-prepared applicant with a thin but honest file usually does better than a nervous one carrying a thick, disorganized folder. Preparation beats paperwork volume.",
    ],
    highlights: [
      "Know every figure and date in your own application",
      "Bring originals, not just photocopies, to the interview",
      "Answer only what's asked — don't over-explain",
      "Dress and speak consistently with your stated travel purpose",
    ],
  },
  {
    slug: "first-time-flyer-checklist",
    category: "Travel Guide",
    title: "First-Time Flyer? Here's Your Complete Pre-Flight Checklist",
    excerpt:
      "From packing to check-in, a practical checklist that takes the guesswork out of your first international flight.",
    date: "10 June 2026",
    image: gallery1,
    content: [
      "The gap between a smooth first flight and a stressful one usually comes down to preparation done the night before, not at the airport. Passport validity, baggage limits, and online check-in are the three things most first-time flyers forget.",
      "Arriving with your documents organized and your phone charged solves most of the small problems that otherwise snowball at a busy check-in counter.",
    ],
    highlights: [
      "Check passport validity is at least 6 months from travel date",
      "Confirm baggage allowance before you start packing",
      "Complete online check-in 24-48 hours before departure",
      "Arrive at the airport at least 3 hours early for international flights",
    ],
  },
  {
    slug: "best-time-to-book-international-flights",
    category: "Travel Guide",
    title: "When to Book: Finding the Cheapest International Flight Fares",
    excerpt:
      "Airfares swing more than most travelers realize. Here's how timing your booking can save you real money on international routes.",
    date: "28 May 2026",
    image: gallery3,
    content: [
      "Airfares are dynamic pricing at its most visible — the same seat can cost twice as much depending on demand, day of week, and how far ahead you book. International routes typically bottom out 6-10 weeks before departure.",
      "Booking too early or too late both cost you. Tracking a route for a couple of weeks before committing usually beats booking on impulse.",
    ],
    highlights: [
      "Book 6-10 weeks ahead for most international routes",
      "Midweek departures are usually cheaper than weekends",
      "Fares often dip on Tuesday and Wednesday evenings",
      "Set fare alerts instead of checking prices manually",
    ],
  },
  {
    slug: "how-to-choose-the-right-hotel",
    category: "Hotel Guide",
    title: "How to Choose the Right Hotel for Business or Leisure Travel",
    excerpt:
      "Location, amenities, and cancellation flexibility all matter differently depending on why you're traveling. Here's how to weigh them.",
    date: "16 May 2026",
    image: gallery4,
    content: [
      "A hotel that's perfect for a leisure trip can be a poor fit for business travel, and vice versa. Business travelers should weight proximity to meetings and reliable wifi far above pool or spa facilities.",
      "For leisure trips, location relative to what you actually plan to do each day matters more than star rating — a well-placed 3-star can beat a 5-star in the wrong neighborhood.",
    ],
    highlights: [
      "Match hotel location to your actual daily itinerary",
      "Business trips: prioritize wifi, desk space, and transit access",
      "Check cancellation policy before booking non-refundable rates",
      "Read recent reviews, not just the overall rating",
    ],
  },
  {
    slug: "hotel-booking-mistakes-to-avoid",
    category: "Hotel Guide",
    title: "7 Hotel Booking Mistakes That Could Cost You More",
    excerpt:
      "Avoidable errors — from ignoring reviews to skipping the fine print — that quietly inflate the cost of a hotel stay.",
    date: "04 May 2026",
    image: edgeCanal,
    content: [
      "The advertised room rate is rarely the full story. City taxes, resort fees, and mandatory breakfast add-ons can push the real cost 15-30% higher than the number you first see.",
      "Booking directly or through a trusted travel agent instead of an unfamiliar third-party site also makes it far easier to resolve disputes if something goes wrong at check-in.",
    ],
    highlights: [
      "Always check for city tax and resort fees before booking",
      "Confirm what's actually included in the quoted rate",
      "Avoid non-refundable rates unless your plans are certain",
      "Keep your booking confirmation accessible offline",
    ],
  },
  {
    slug: "document-legalization-explained",
    category: "General Discussion",
    title: "Document Legalization Explained: Notary, Ministry & Embassy Steps",
    excerpt:
      "A plain-language breakdown of how document legalization actually works, and why the order of steps matters.",
    date: "22 April 2026",
    image: gallery2,
    content: [
      "Document legalization is a chain: notary, then ministry of foreign affairs, then destination-country embassy. Skipping or reordering a step means starting over, which is the single most common delay we see.",
      "Each link in the chain verifies the signature and seal of the one before it, so a mistake early on invalidates everything that follows.",
    ],
    highlights: [
      "Legalization must follow notary → ministry → embassy order",
      "Each authority verifies the previous seal, not the document itself",
      "Processing times vary widely by destination country",
      "Keep certified copies — originals can take weeks to return",
    ],
  },
  {
    slug: "apostille-vs-embassy-attestation",
    category: "General Discussion",
    title: "Apostille vs Embassy Attestation: What's the Difference?",
    excerpt:
      "Not every country accepts an apostille. Here's how to tell which legalization route your documents actually need.",
    date: "10 April 2026",
    image: edgeTraveler,
    content: [
      "An apostille works only between countries that are both members of the Hague Convention — it replaces the need for embassy attestation entirely. Outside that group, full embassy attestation is still required.",
      "Checking your destination country's Hague status before starting the process saves both time and unnecessary attestation fees.",
    ],
    highlights: [
      "Apostille only applies between Hague Convention member countries",
      "Non-member countries require full embassy attestation",
      "Check your destination country's Hague status first",
      "Apostilled documents are accepted without further legalization",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogCategoryCounts(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of BLOG_POSTS) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }));
}
