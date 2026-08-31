import "dotenv/config";
import path from "path";
import { copyFile, mkdir } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";

const SEED_IMAGES_ROOT = path.join(process.cwd(), "components/home/images");
const UPLOADS_SEED_ROOT = path.join(process.cwd(), "public/uploads/seed");

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Blog.content is now rich-text HTML (matches the admin's TipTap editor
 * output) instead of a plain paragraph array — wrap each seed paragraph in
 * its own <p> so it renders identically to the old plain-text version. */
function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}

/** Copies a source image (from the site's existing bundled artwork) into
 * public/uploads/seed/<category>/ and returns its public path, so seeded
 * content looks identical to the pre-CMS hardcoded site on first run. */
async function seedImage(
  sourceRelPath: string,
  category: string,
  filename: string,
): Promise<string> {
  const destDir = path.join(UPLOADS_SEED_ROOT, category);
  await mkdir(destDir, { recursive: true });
  await copyFile(path.join(SEED_IMAGES_ROOT, sourceRelPath), path.join(destDir, filename));
  return `/uploads/seed/${category}/${filename}`;
}

async function seedAdmin() {
  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env",
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.create({
    data: { name, email, passwordHash },
  });
  console.log(`Created admin user: ${email}`);
}

const SERVICES_SEED = [
  {
    slug: "air-ticketing",
    category: "Air Ticketing",
    title: "Air Ticketing",
    tagline: "Reliable Flight Booking for Every Journey",
    description:
      "Affordable air ticket booking for domestic and international travel with professional assistance. We compare fares across trusted airlines so you get the best price and confirmed itinerary every time.",
    features: [
      "Domestic & international flights",
      "One-way and round-trip bookings",
      "Group booking solutions",
      "Best fare comparison & instant confirmation",
    ],
    sourceImage: "air-ticketing-bg.png",
  },
  {
    slug: "hotel-reservations",
    category: "Hotel",
    title: "Hotel Reservations",
    tagline: "Worldwide Hotel Reservations for Every Budget",
    description:
      "We secure hotel rooms around the world at competitive rates, from budget stays to premium resorts, with instant confirmation and flexible cancellation options.",
    features: [
      "Hotels worldwide at competitive rates",
      "All budget categories covered",
      "Instant booking confirmation",
      "Group & corporate rates",
    ],
    sourceImage: "gallery-4.png",
  },
  {
    slug: "tourist-visa",
    category: "Visa",
    title: "Tourist Visa",
    tagline: "Tourist Visa Processing Done Right",
    description:
      "From document checklists to embassy submission, our team handles your tourist visa application end to end so you can focus on planning the trip, not the paperwork.",
    features: [
      "Document checklist & review",
      "Application form assistance",
      "Appointment scheduling",
      "Processing status updates",
    ],
    sourceImage: "visas/seasonal-visa.png",
  },
  {
    slug: "visa-stamping",
    category: "Visa",
    title: "Visa Stamping",
    tagline: "Visa Stamping Support Without the Hassle",
    description:
      "We assist with visa stamping for multiple destinations, verifying every document and following up with the embassy until your passport is stamped and ready.",
    features: [
      "Visa stamping for multiple destinations",
      "Embassy appointment support",
      "Document verification",
      "Follow-up until approval",
    ],
    sourceImage: "visas/work-visa.png",
  },
  {
    slug: "document-legalization",
    category: "Legal",
    title: "Document Legalization",
    tagline: "Document Legalization Made Simple",
    description:
      "We handle notarization, ministry and embassy legalization of your documents, guiding you through every step so nothing is missing and nothing gets delayed.",
    features: [
      "Notary & ministry legalization",
      "Embassy attestation",
      "Document translation support",
      "End-to-end handling",
    ],
    sourceImage: "visas/family-visa.png",
  },
  {
    slug: "apostille",
    category: "Legal",
    title: "Apostille Services",
    tagline: "Fast Apostille for Hague Convention Countries",
    description:
      "Get your documents apostilled quickly for use in Hague Convention countries, with embassy legalization and courier delivery handled for you.",
    features: [
      "Apostille for Hague Convention countries",
      "Embassy legalization for other destinations",
      "Courier & delivery handling",
      "Status tracking",
    ],
    sourceImage: "gallery-2.png",
  },
];

async function seedServices() {
  const count = await prisma.service.count();
  if (count > 0) {
    console.log(`Services already seeded (${count} rows).`);
    return;
  }

  for (const [index, service] of SERVICES_SEED.entries()) {
    const image = await seedImage(
      service.sourceImage,
      "services",
      `${service.slug}.png`,
    );
    await prisma.service.create({
      data: {
        slug: service.slug,
        category: service.category,
        title: service.title,
        tagline: service.tagline,
        description: service.description,
        features: service.features,
        image,
        order: index,
      },
    });
  }
  console.log(`Seeded ${SERVICES_SEED.length} services.`);
}

const BLOGS_SEED = [
  {
    slug: "portugal-d6-family-visa-guide",
    category: "Visa Guide",
    title:
      "Portugal D6 Family Visa: Eligibility, Requirements & Application Process",
    excerpt:
      "Everything you need to know before applying for a Portugal D6 family visa, from eligibility rules to the documents embassies actually ask for.",
    publishedAt: "2026-07-14",
    sourceImage: "gallery2/city-river.png",
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
    publishedAt: "2026-07-02",
    sourceImage: "gallery2/backpacker.png",
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
    publishedAt: "2026-06-21",
    sourceImage: "gallery2/hijab-traveler.png",
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
    publishedAt: "2026-06-10",
    sourceImage: "gallery-1.png",
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
    publishedAt: "2026-05-28",
    sourceImage: "gallery-3.png",
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
    publishedAt: "2026-05-16",
    sourceImage: "gallery-4.png",
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
    publishedAt: "2026-05-04",
    sourceImage: "gallery2/edge-canal.png",
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
    publishedAt: "2026-04-22",
    sourceImage: "gallery-2.png",
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
    publishedAt: "2026-04-10",
    sourceImage: "gallery2/edge-traveler.png",
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

async function seedBlogs() {
  const count = await prisma.blog.count();
  if (count > 0) {
    console.log(`Blogs already seeded (${count} rows).`);
    return;
  }

  for (const post of BLOGS_SEED) {
    const filename = `${post.sourceImage.split("/").pop()}`;
    const image = await seedImage(post.sourceImage, "blogs", `${post.slug}-${filename}`);
    await prisma.blog.create({
      data: {
        slug: post.slug,
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        content: paragraphsToHtml(post.content),
        highlights: post.highlights,
        image,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }
  console.log(`Seeded ${BLOGS_SEED.length} blog posts.`);
}

const DESTINATIONS_SEED = [
  {
    slug: "portugal",
    country: "Portugal",
    region: "Europe",
    tagline: "Family reunification, work permits and long-term residency",
    description:
      "A growing hub for South Asian workers and families, with a clear path from work or D6 family visa to long-term residency.",
    popularFor: ["D6 Family Visa", "Work Visa", "Residency"],
    sourceImage: "air-ticketing-bg.png",
  },
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    region: "Europe",
    tagline: "World-class universities and skilled worker routes",
    description:
      "From undergraduate offers to Skilled Worker sponsorship, the UK remains one of the most requested destinations we process.",
    popularFor: ["Student Visa", "Work Visa", "Tourist Visa"],
    sourceImage: "gallery-3.png",
  },
  {
    slug: "canada",
    country: "Canada",
    region: "North America",
    tagline: "Study permits, PR pathways and family sponsorship",
    description:
      "Canada's points-based immigration system rewards strong applications — we help build yours around study, work or family routes.",
    popularFor: ["Student Visa", "PR Pathway", "Family Visa"],
    sourceImage: "gallery-1.png",
  },
  {
    slug: "australia",
    country: "Australia",
    region: "Oceania",
    tagline: "Study, skilled migration and working holiday options",
    description:
      "A consistently popular choice for students and skilled professionals, with well-defined visa subclasses for each pathway.",
    popularFor: ["Student Visa", "Skilled Migration", "Tourist Visa"],
    sourceImage: "gallery2/city-river.png",
  },
  {
    slug: "united-states",
    country: "United States",
    region: "North America",
    tagline: "Tourist, business and student visa support",
    description:
      "We prepare DS-160 applications and interview documentation for B1/B2, F1 and other common US visa categories.",
    popularFor: ["Tourist Visa", "Student Visa", "Business Visa"],
    sourceImage: "gallery-4.png",
  },
  {
    slug: "schengen-europe",
    country: "Schengen Europe",
    region: "Europe",
    tagline: "One visa, 27 countries — tourism and short business trips",
    description:
      "We handle Schengen tourist and business visa applications for Bangladeshi travelers heading across mainland Europe.",
    popularFor: ["Tourist Visa", "Business Visa"],
    sourceImage: "gallery2/edge-canal.png",
  },
  {
    slug: "malaysia",
    country: "Malaysia",
    region: "Asia",
    tagline: "Affordable education and accessible tourist entry",
    description:
      "A cost-effective study destination with strong transfer pathways to Western universities, plus simple tourist visa processing.",
    popularFor: ["Student Visa", "Tourist Visa"],
    sourceImage: "gallery2/backpacker.png",
  },
  {
    slug: "united-arab-emirates",
    country: "United Arab Emirates",
    region: "Middle East",
    tagline: "Employment visas and fast-turnaround tourist entry",
    description:
      "From work permit attestation to short tourist stays, the UAE is one of our fastest-processing destinations.",
    popularFor: ["Work Visa", "Tourist Visa", "Document Legalization"],
    sourceImage: "gallery2/hijab-traveler.png",
  },
  {
    slug: "saudi-arabia",
    country: "Saudi Arabia",
    region: "Middle East",
    tagline: "Work visas, Umrah and Hajj travel support",
    description:
      "We support employment visa processing alongside Umrah and Hajj travel arrangements, including document legalization.",
    popularFor: ["Work Visa", "Umrah & Hajj", "Document Legalization"],
    sourceImage: "gallery2/edge-traveler.png",
  },
];

async function seedDestinations() {
  const count = await prisma.destination.count();
  if (count > 0) {
    console.log(`Destinations already seeded (${count} rows).`);
    return;
  }

  for (const [index, destination] of DESTINATIONS_SEED.entries()) {
    const filename = `${destination.sourceImage.split("/").pop()}`;
    const image = await seedImage(
      destination.sourceImage,
      "destinations",
      `${destination.slug}-${filename}`,
    );
    await prisma.destination.create({
      data: {
        slug: destination.slug,
        country: destination.country,
        region: destination.region,
        tagline: destination.tagline,
        description: destination.description,
        popularFor: destination.popularFor,
        image,
        order: index,
      },
    });
  }
  console.log(`Seeded ${DESTINATIONS_SEED.length} destinations.`);
}

async function upsertSetting(key: string, value: unknown) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: value as never },
    update: {},
  });
}

async function seedSiteSettings() {
  await upsertSetting("contact_info", {
    phone: "+88 1965 323232",
    whatsapp: "8801965323232",
    email: "info@aaaviation.com",
    address: "Ka 39/1 (3rd Floor), Pragati Sarani, Kuril, Dhaka",
  });

  await upsertSetting("social_links", []);

  await upsertSetting("home_hero", {
    eyebrow: "Global Travel & Visa Solutions",
    title: "Global Travel",
    subtitle: "& Visa Solutions",
    ctaLabel: "See All Services",
    ctaHref: "/services",
  });

  await upsertSetting("home_stats", [
    { value: "50+", label: "Successful Visa Applications" },
    { value: "200+", label: "Air Tickets Booked" },
    { value: "20", label: "Countries Served" },
    { value: "97%", label: "Client Satisfaction" },
  ]);

  await upsertSetting("home_testimonials", [
    {
      quote:
        "I booked my international flight through A&A Aviation and received excellent support from start to finish. The entire booking process was smooth and hassle-free.",
      name: "Nusrat Jahan",
      role: "Business Owner",
      caption: "great experience",
    },
    {
      quote:
        "Our family's tourist visa was approved without a single hiccup. The team explained every document we needed and kept us updated the whole way through.",
      name: "Farhan Chowdhury",
      role: "Software Engineer",
      caption: "smooth process",
    },
    {
      quote:
        "From hotel bookings to the return ticket, A&A Aviation handled everything for our study-abroad trip. Professional, responsive, and genuinely helpful.",
      name: "Sadia Rahman",
      role: "University Student",
      caption: "highly recommend",
    },
  ]);

  const existingPartners = await prisma.siteSetting.findUnique({
    where: { key: "home_partners" },
  });
  if (!existingPartners) {
    const partnerSources: { name: string; source: string }[] = [
      { name: "Singapore Airlines", source: "partners/singapore-airlines.png" },
      { name: "Marriott", source: "partners/marriott.png" },
      { name: "Sheraton", source: "partners/sheraton.png" },
      { name: "Accor", source: "partners/accor.png" },
      { name: "Holiday Inn", source: "partners/holiday-inn.png" },
      { name: "Radisson Hotels & Resorts", source: "partners/radisson.png" },
      { name: "Hilton", source: "partners/hilton.png" },
    ];
    const partners = [];
    for (const p of partnerSources) {
      const filename = p.source.split("/").pop()!;
      const image = await seedImage(p.source, "partners", filename);
      partners.push({ name: p.name, image });
    }
    await upsertSetting("home_partners", partners);
  }

  const existingGallery = await prisma.siteSetting.findUnique({
    where: { key: "home_gallery" },
  });
  if (!existingGallery) {
    const gallerySources: { alt: string; source: string }[] = [
      { alt: "Football fans with Portugal flags", source: "gallery-1.png" },
      { alt: "Hillside town view", source: "gallery-2.png" },
      { alt: "Colorful boats on a canal", source: "gallery-3.png" },
      { alt: "Couple at a terrace cafe", source: "gallery-4.png" },
      { alt: "Coastal city and river", source: "gallery-5.png" },
    ];
    const gallery = [];
    for (const g of gallerySources) {
      const image = await seedImage(g.source, "gallery", g.source);
      gallery.push({ alt: g.alt, image });
    }
    await upsertSetting("home_gallery", gallery);
  }

  const existingFooterGallery = await prisma.siteSetting.findUnique({
    where: { key: "footer_gallery" },
  });
  if (!existingFooterGallery) {
    const footerGallerySources: { alt: string; source: string }[] = [
      { alt: "Football fans with Portugal flags", source: "gallery-1.png" },
      { alt: "Hillside town view", source: "gallery-2.png" },
      { alt: "Colorful boats on a canal", source: "gallery-3.png" },
      { alt: "Couple at a terrace cafe", source: "gallery-4.png" },
      { alt: "Coastal city and river", source: "gallery-5.png" },
      {
        alt: "Traveler smiling on a mountain overlook",
        source: "gallery2/hijab-traveler.png",
      },
    ];
    const footerGallery = [];
    for (const g of footerGallerySources) {
      const filename = g.source.split("/").pop()!;
      const image = await seedImage(g.source, "footer-gallery", filename);
      footerGallery.push({ alt: g.alt, image });
    }
    await upsertSetting("footer_gallery", footerGallery);
  }

  const existingVisaCards = await prisma.siteSetting.findUnique({
    where: { key: "home_visa_cards" },
  });
  if (!existingVisaCards) {
    const visaSources: { tag: string; title: string; source: string }[] = [
      { tag: "Portugal Visa-01", title: "Work Visa", source: "visas/work-visa.png" },
      { tag: "Portugal Visa-02", title: "Family Visa", source: "visas/family-visa.png" },
      { tag: "Portugal Visa-03", title: "Seasonal Visa", source: "visas/seasonal-visa.png" },
      { tag: "Portugal Visa-04", title: "Student Visa", source: "visas/work-visa.png" },
      { tag: "Portugal Visa-05", title: "Tourist Visa", source: "visas/seasonal-visa.png" },
    ];
    const visaCards = [];
    for (const [index, v] of visaSources.entries()) {
      const filename = `${index}-${v.source.split("/").pop()!}`;
      const image = await seedImage(v.source, "visa-cards", filename);
      visaCards.push({ tag: v.tag, title: v.title, image });
    }
    await upsertSetting("home_visa_cards", visaCards);
  }

  const existingTicketCards = await prisma.siteSetting.findUnique({
    where: { key: "home_ticket_cards" },
  });
  if (!existingTicketCards) {
    const ticketSources: { title: string; description: string }[] = [
      {
        title: "Domestic Air Tickets",
        description:
          "Travel across Bangladesh with affordable fares and flexible flight schedules.",
      },
      {
        title: "International Air Tickets",
        description:
          "Fly worldwide with trusted airlines and competitive international ticket prices.",
      },
      {
        title: "One-Way Booking",
        description:
          "Ideal for business, study, relocation or flexible travel plans.",
      },
      {
        title: "Round Trip Booking",
        description:
          "Book departure and return flights together for convenience and savings.",
      },
      {
        title: "Group Booking Solutions",
        description:
          "Affordable fares and flexible flight schedules for teams and families.",
      },
    ];
    const ticketCards = [];
    for (const [index, t] of ticketSources.entries()) {
      const image = await seedImage(
        "ticket-thumb.png",
        "ticket-cards",
        `${index}-ticket-thumb.png`,
      );
      ticketCards.push({ title: t.title, description: t.description, image });
    }
    await upsertSetting("home_ticket_cards", ticketCards);
  }

  const existingServiceCards = await prisma.siteSetting.findUnique({
    where: { key: "home_service_cards" },
  });
  if (!existingServiceCards) {
    const serviceSources: { category: string; title: string; source: string }[] = [
      { category: "Hotel", title: "Worldwide Hotel Reservations", source: "visas/family-visa.png" },
      { category: "Visa", title: "Tourist Visa Processing", source: "visas/seasonal-visa.png" },
      { category: "Visa", title: "Visa Stamping Support", source: "visas/work-visa.png" },
      { category: "Legal", title: "Document Legalization", source: "visas/family-visa.png" },
      { category: "Legal", title: "Apostille Services", source: "visas/seasonal-visa.png" },
    ];
    const serviceCards = [];
    for (const [index, s] of serviceSources.entries()) {
      const filename = `${index}-${s.source.split("/").pop()!}`;
      const image = await seedImage(s.source, "service-cards", filename);
      serviceCards.push({ category: s.category, title: s.title, image });
    }
    await upsertSetting("home_service_cards", serviceCards);
  }

  const existingPeopleGallery = await prisma.siteSetting.findUnique({
    where: { key: "home_people_gallery" },
  });
  if (!existingPeopleGallery) {
    const peopleSources: { alt: string; source: string; tall?: boolean }[] = [
      { alt: "Traveler reaching up toward the treeline", source: "gallery2/edge-traveler.png" },
      {
        alt: "Traveler smiling on a mountain overlook",
        source: "gallery2/hijab-traveler.png",
        tall: true,
      },
      { alt: "Traveler with a backpack at a busy market", source: "gallery2/backpacker.png" },
      { alt: "Riverside city skyline", source: "gallery2/city-river.png", tall: true },
      { alt: "Canal lined with colorful boats", source: "gallery2/edge-canal.png" },
    ];
    const peopleGallery = [];
    for (const p of peopleSources) {
      const filename = p.source.split("/").pop()!;
      const image = await seedImage(p.source, "people-gallery", filename);
      peopleGallery.push({ image, alt: p.alt, tall: !!p.tall });
    }
    await upsertSetting("home_people_gallery", peopleGallery);
  }

  console.log("Seeded site settings.");
}

const MORE_BLOGS_SEED = [
  {
    slug: "schengen-visa-appointments-explained",
    category: "Visa Guide",
    title: "Everything You Need to Know About Schengen Visa Appointments",
    excerpt:
      "Appointment slots fill up fast at peak season. Here's how to actually get one, and what to bring on the day.",
    publishedAt: "2026-08-05",
    sourceImage: "gallery-3.png",
    content: [
      "Schengen visa appointment slots at busy consulates can book out weeks in advance during summer and December travel seasons, so checking availability the moment you have your documents ready matters more than most applicants expect.",
      "Arrive with printed copies of everything even when the portal says digital upload is enough — a missing printout is still one of the most common reasons for a same-day rejection at the counter.",
    ],
    highlights: [
      "Book your slot as soon as your travel dates are fixed",
      "Bring printed copies even if you uploaded everything online",
      "Arrive 15 minutes early, not more — most centres don't allow early entry",
    ],
  },
  {
    slug: "round-trip-vs-one-way-tickets",
    category: "Travel Guide",
    title: "Round-Trip vs One-Way Tickets: Which Should You Book?",
    excerpt:
      "The cheaper option on paper isn't always the cheaper option in practice. Here's how to actually decide.",
    publishedAt: "2026-07-28",
    sourceImage: "gallery-4.png",
    content: [
      "Round-trip fares are often discounted compared to two one-way tickets on the same route, but that discount disappears fast if your return date is even slightly uncertain and you end up paying a change fee.",
      "For open-ended trips — relocation, long study stays, uncertain return dates — one-way tickets usually work out cheaper overall once you account for the flexibility.",
    ],
    highlights: [
      "Round-trip is usually cheaper only when your return date is fixed",
      "Factor in change fees before assuming round-trip saves money",
      "One-way makes more sense for open-ended or relocation travel",
    ],
  },
  {
    slug: "hotel-booking-mistakes-bangladeshi-travelers",
    category: "Hotel Guide",
    title: "Top 5 Mistakes Bangladeshi Travelers Make When Booking Hotels",
    excerpt:
      "Small oversights at booking time turn into big headaches at check-in. Here's what to double-check first.",
    publishedAt: "2026-07-19",
    sourceImage: "gallery2/backpacker.png",
    content: [
      "Booking a hotel without confirming visa-country-specific requirements — like proof of accommodation letters some embassies ask for — is one of the most avoidable mistakes we see, and it's easy to fix by asking before you book.",
      "Skipping the cancellation policy is the second most common issue; a slightly higher refundable rate is almost always worth it while a visa decision is still pending.",
    ],
    highlights: [
      "Confirm if your destination embassy needs a specific accommodation letter format",
      "Prefer refundable rates until your visa is actually approved",
      "Double-check the check-in age policy for solo younger travelers",
    ],
  },
  {
    slug: "uae-work-visa-processing-time",
    category: "Visa Guide",
    title: "How Long Does UAE Work Visa Processing Actually Take?",
    excerpt:
      "Timelines vary a lot by employer and emirate. Here's a realistic breakdown of what to expect at each stage.",
    publishedAt: "2026-07-10",
    sourceImage: "gallery2/city-river.png",
    content: [
      "A UAE work visa typically moves through offer letter, entry permit, medical test, Emirates ID registration and visa stamping — each stage has its own timeline, and delays usually happen at the medical test or ID registration step.",
      "Free zone employers often move faster than mainland ones simply because they process fewer external approvals, which is worth asking about before you accept an offer if timing matters to you.",
    ],
    highlights: [
      "Full process usually takes 2-4 weeks once documents are complete",
      "Free zone employers are typically faster than mainland companies",
      "Medical test and Emirates ID registration are the most common delay points",
    ],
  },
  {
    slug: "winter-europe-packing-checklist",
    category: "Travel Guide",
    title: "Packing for a Winter Trip to Europe: A Practical Checklist",
    excerpt:
      "Layering matters more than any single heavy item. Here's what actually earns a spot in your suitcase.",
    publishedAt: "2026-06-30",
    sourceImage: "gallery2/edge-canal.png",
    content: [
      "A good thermal base layer under normal clothes outperforms one bulky coat in almost every European winter city, and it packs down to a fraction of the space.",
      "Waterproof, not just warm, footwear is the one item first-time winter travelers most often get wrong — slush and rain are more common than deep snow in most Western European cities.",
    ],
    highlights: [
      "Thermal base layers beat one heavy coat for both warmth and packing space",
      "Prioritize waterproof shoes over just warm ones",
      "Pack a compact travel umbrella — winter rain is more common than snow in most cities",
    ],
  },
  {
    slug: "what-is-document-attestation",
    category: "General Discussion",
    title: "What Is Document Attestation and Why Does It Matter?",
    excerpt:
      "Attestation confirms a document is genuine to a foreign authority. Here's when you actually need it.",
    publishedAt: "2026-06-21",
    sourceImage: "gallery2/edge-traveler.png",
    content: [
      "Attestation is a chain of verification — a notary, then a relevant ministry, then sometimes an embassy — that confirms a document's signatures and seals are genuine, not the content itself.",
      "Employment visas, family sponsorship and university admissions are the three situations where attestation gets requested most often, so it's worth checking your destination's specific requirement early rather than at the last step.",
    ],
    highlights: [
      "Attestation verifies signatures and seals, not the document's content",
      "Most commonly required for work visas, family sponsorship, and university admissions",
      "Requirements vary by destination country — check early, not at the last step",
    ],
  },
  {
    slug: "saudi-umrah-visa-requirements",
    category: "Visa Guide",
    title: "Saudi Arabia Umrah Visa: Requirements Explained",
    excerpt:
      "Umrah visa rules have simplified in recent years, but a few requirements still trip up first-time applicants.",
    publishedAt: "2026-06-12",
    sourceImage: "gallery2/hijab-traveler.png",
    content: [
      "Passport validity of at least six months from your travel date and a recent passport-style photo are the two most basic requirements applicants still occasionally get wrong.",
      "Vaccination requirements have changed several times in recent years, so it's worth confirming the current list close to your travel date rather than relying on what a friend needed last year.",
    ],
    highlights: [
      "Passport must be valid at least 6 months from travel date",
      "Vaccination requirements change periodically — confirm close to travel date",
      "Processing is usually quick once documents are complete",
    ],
  },
  {
    slug: "business-class-vs-economy-upgrade",
    category: "Travel Guide",
    title: "Business Class vs Economy: Is the Upgrade Worth It?",
    excerpt:
      "The honest answer depends entirely on flight length and what you value. Here's how to think about it.",
    publishedAt: "2026-06-03",
    sourceImage: "gallery-1.png",
    content: [
      "On flights under four hours, the practical difference between business and economy is smaller than the price gap usually justifies — better to save the upgrade for long-haul routes.",
      "If arriving well-rested for a business meeting or event matters more than the ticket price, the upgrade earns its cost back in a way that's hard to quantify but easy to notice.",
    ],
    highlights: [
      "Save the upgrade budget for long-haul flights, not short hops",
      "Consider it when arrival condition matters more than ticket price",
      "Check if a partial upgrade (premium economy) meets the same need for less",
    ],
  },
  {
    slug: "travel-agent-vs-booking-direct",
    category: "General Discussion",
    title: "How to Choose Between a Travel Agent and Booking Direct",
    excerpt:
      "Both have real advantages. The right choice depends on how complex your trip actually is.",
    publishedAt: "2026-05-25",
    sourceImage: "gallery-3.png",
    content: [
      "Simple, single-destination trips with flexible dates are usually fine to book directly — there's little an agent adds when there's nothing complicated to coordinate.",
      "Multi-country itineraries, visa-dependent trips, or anything with a tight deadline benefit the most from an agent who can catch problems before they become expensive last-minute fixes.",
    ],
    highlights: [
      "Simple, flexible trips are fine to book direct",
      "Multi-country or visa-dependent trips benefit most from an agent",
      "An agent's real value is catching problems before they get expensive",
    ],
  },
  {
    slug: "family-visa-sponsorship-explained",
    category: "Visa Guide",
    title: "Family Visa Sponsorship: Who Qualifies and How to Apply",
    excerpt:
      "Sponsorship rules differ a lot by country and relationship. Here's the general shape of how it works.",
    publishedAt: "2026-05-16",
    sourceImage: "gallery-4.png",
    content: [
      "Most family sponsorship routes require the sponsor to prove both a genuine relationship and a minimum income or savings threshold, and applications are judged on both together, not either alone.",
      "Civil documents — marriage or birth certificates — almost always need translation and legalization, which is the step that adds the most time to an otherwise straightforward application.",
    ],
    highlights: [
      "Sponsors typically need to prove both relationship and financial capacity",
      "Civil document translation and legalization is the most time-consuming step",
      "Start gathering civil documents as early as possible",
    ],
  },
  {
    slug: "signs-untrustworthy-hotel-booking-site",
    category: "Hotel Guide",
    title: "5 Signs Your Hotel Booking Site Isn't Trustworthy",
    excerpt:
      "Not every booking site that shows up in search results is reliable. Here's what to check before you pay.",
    publishedAt: "2026-05-07",
    sourceImage: "gallery2/backpacker.png",
    content: [
      "A price that's dramatically lower than every other site for the same room is the clearest warning sign — legitimate sites rarely differ from each other by more than a small margin.",
      "No clear cancellation policy, no verified reviews, and payment pages that don't show a secure padlock are three more signs worth checking before entering card details.",
    ],
    highlights: [
      "Be suspicious of prices dramatically lower than every other site",
      "Check for a clear, specific cancellation policy before booking",
      "Confirm the payment page is secure before entering card details",
    ],
  },
  {
    slug: "layover-survival-guide",
    category: "Travel Guide",
    title: "Layover Survival Guide: Making the Most of a Long Stopover",
    excerpt:
      "A long layover doesn't have to be dead time. Here's how to plan around one properly.",
    publishedAt: "2026-04-28",
    sourceImage: "gallery2/city-river.png",
    content: [
      "Check whether your layover airport or airline offers a free transit visa or day pass before assuming you're stuck in the terminal — several major hubs make this easier than travelers expect.",
      "Pack a change of clothes and a portable charger in your carry-on specifically for long layovers — small comforts make a bigger difference than they sound like they would.",
    ],
    highlights: [
      "Check for free transit visas or day passes at your layover airport",
      "Pack a change of clothes and charger in your carry-on for long layovers",
      "Confirm minimum connection time before booking a tight layover",
    ],
  },
  {
    slug: "notarization-vs-apostille",
    category: "General Discussion",
    title: "Notarization vs Apostille: What's Actually the Difference",
    excerpt:
      "These two terms get mixed up constantly. Here's a clear breakdown of what each one actually does.",
    publishedAt: "2026-04-19",
    sourceImage: "gallery2/edge-canal.png",
    content: [
      "Notarization confirms a signature was made in front of a notary — it's usually the first step in a longer chain, not a standalone form of international recognition.",
      "An apostille is a specific certificate that makes a document valid in any other Hague Convention country without further legalization — but it only works between member countries.",
    ],
    highlights: [
      "Notarization is usually just the first step, not the final one",
      "Apostille only works between Hague Convention member countries",
      "Non-member countries still require full embassy legalization",
    ],
  },
  {
    slug: "canada-study-permit-rejection-reasons",
    category: "Visa Guide",
    title: "Canada Study Permit: Common Rejection Reasons",
    excerpt:
      "Most rejections come down to a small handful of recurring issues. Here's what to watch for.",
    publishedAt: "2026-04-10",
    sourceImage: "gallery2/edge-traveler.png",
    content: [
      "Insufficient proof of funds is the single most common reason study permit applications get refused — officers want to see funds available for a sustained period, not just a lump sum deposited recently.",
      "A weak or generic study plan letter is the second most common issue; officers are specifically looking for a clear link between your chosen program and your career goals back home.",
    ],
    highlights: [
      "Show sustained proof of funds, not a recent lump-sum deposit",
      "Write a specific study plan tying your program to your career goals",
      "Keep all financial documents consistent with your bank statements",
    ],
  },
  {
    slug: "off-season-travel-worth-it",
    category: "Travel Guide",
    title: "Off-Season Travel: When It's Actually Worth Booking",
    excerpt:
      "Cheaper isn't always better. Here's how to tell if an off-season trip fits what you actually want.",
    publishedAt: "2026-04-01",
    sourceImage: "gallery2/hijab-traveler.png",
    content: [
      "Off-season pricing can cut costs by 30-50% on both flights and hotels, but it's worth checking what actually closes during that season at your destination before booking purely on price.",
      "Beach destinations tend to lose the most during off-season, while city-break destinations — museums, restaurants, walking tours — usually hold up just as well with far smaller crowds.",
    ],
    highlights: [
      "Off-season pricing can cut costs by 30-50%",
      "Check what attractions actually close during the off-season first",
      "City-break destinations hold up better off-season than beach destinations",
    ],
  },
];

async function seedMoreBlogs() {
  const marker = await prisma.blog.findUnique({
    where: { slug: MORE_BLOGS_SEED[MORE_BLOGS_SEED.length - 1].slug },
  });
  if (marker) {
    console.log("Extra blog posts already seeded.");
    return;
  }

  for (const post of MORE_BLOGS_SEED) {
    const filename = `${post.sourceImage.split("/").pop()}`;
    const image = await seedImage(post.sourceImage, "blogs", `${post.slug}-${filename}`);
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        content: paragraphsToHtml(post.content),
        highlights: post.highlights,
        image,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }
  console.log(`Seeded ${MORE_BLOGS_SEED.length} additional blog posts.`);
}

const INQUIRIES_SEED: {
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  message: string;
  daysAgo: number;
}[] = [
  {
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    phone: "+8801711223344",
    serviceCategory: "Air Ticketing",
    status: "NEW",
    message: "Looking for the cheapest round-trip fare to Dubai in October for 2 people.",
    daysAgo: 0,
  },
  {
    name: "Sumaiya Islam",
    email: "sumaiya.islam@example.com",
    phone: "+8801812345678",
    serviceCategory: "Tourist Visa",
    status: "NEW",
    message: "What documents do I need for a Schengen tourist visa as a first-time applicant?",
    daysAgo: 1,
  },
  {
    name: "Rezaul Karim",
    email: "rezaul.karim@example.com",
    phone: "+8801911998877",
    serviceCategory: "Work & Family Visa",
    status: "NEW",
    message: "My employer in Qatar sent an offer letter. What's the next step for the work visa?",
    daysAgo: 1,
  },
  {
    name: "Nusrat Jahan Mim",
    email: "nusrat.mim@example.com",
    phone: "+8801622334455",
    serviceCategory: "Hotel Booking",
    status: "IN_PROGRESS",
    message: "Need a family room for 4 nights in Kuala Lumpur, budget around 15000 BDT per night.",
    daysAgo: 2,
  },
  {
    name: "Shahriar Kabir",
    email: "shahriar.kabir@example.com",
    phone: "+8801755667788",
    serviceCategory: "Document Legalization",
    status: "IN_PROGRESS",
    message: "I need my university transcripts attested for a UK application. How long does it take?",
    daysAgo: 3,
  },
  {
    name: "Farhana Yesmin",
    email: "farhana.yesmin@example.com",
    phone: "+8801944556677",
    serviceCategory: "Tourist Visa",
    status: "IN_PROGRESS",
    message: "Applied for a UK visitor visa 3 weeks ago through your team, wanted a status update.",
    daysAgo: 4,
  },
  {
    name: "Imran Hossain",
    email: "imran.hossain@example.com",
    phone: "+8801611223344",
    serviceCategory: "Air Ticketing",
    status: "IN_PROGRESS",
    message: "Need to change the return date on my Dhaka-Singapore booking. Ref sent by email.",
    daysAgo: 5,
  },
  {
    name: "Afsana Mimi",
    email: "afsana.mimi@example.com",
    phone: "+8801733221100",
    serviceCategory: "Other",
    status: "NEW",
    message: "Do you help with travel insurance too, or only flights and visas?",
    daysAgo: 6,
  },
  {
    name: "Mahmudul Hasan",
    email: "mahmudul.hasan@example.com",
    phone: "+8801855443322",
    serviceCategory: "Work & Family Visa",
    status: "RESOLVED",
    message: "Thanks for the help with my Portugal D6 visa application, it was approved last week.",
    daysAgo: 8,
  },
  {
    name: "Ruma Akter",
    email: "ruma.akter@example.com",
    phone: "+8801977889900",
    serviceCategory: "Hotel Booking",
    status: "RESOLVED",
    message: "Booking confirmed for the Bangkok trip, thank you for the quick turnaround.",
    daysAgo: 9,
  },
  {
    name: "Zahid Hassan",
    email: "zahid.hassan@example.com",
    phone: "+8801699887766",
    serviceCategory: "Document Legalization",
    status: "RESOLVED",
    message: "Received my apostilled documents, everything looks correct. Appreciate the help.",
    daysAgo: 11,
  },
  {
    name: "Taslima Begum",
    email: "taslima.begum@example.com",
    phone: "+8801544332211",
    serviceCategory: "Tourist Visa",
    status: "RESOLVED",
    message: "Visa approved for our family trip to Thailand, thanks for handling the paperwork.",
    daysAgo: 13,
  },
  {
    name: "Kamrul Islam",
    email: "kamrul.islam@example.com",
    phone: "+8801766554433",
    serviceCategory: "Air Ticketing",
    status: "RESOLVED",
    message: "Group booking for 6 people to Jeddah confirmed, thank you for the discount.",
    daysAgo: 15,
  },
  {
    name: "Sharmin Sultana",
    email: "sharmin.sultana@example.com",
    phone: "+8801888776655",
    serviceCategory: "Work & Family Visa",
    status: "NEW",
    message: "My husband is on a work visa in Canada, want to check the family sponsorship process.",
    daysAgo: 2,
  },
  {
    name: "Asif Iqbal",
    email: "asif.iqbal@example.com",
    phone: "+8801622998877",
    serviceCategory: "Other",
    status: "NEW",
    message: "Do you assist with student visa applications for Australia as well?",
    daysAgo: 3,
  },
  {
    name: "Nadia Chowdhury",
    email: "nadia.chowdhury@example.com",
    phone: "+8801911223300",
    serviceCategory: "Hotel Booking",
    status: "IN_PROGRESS",
    message: "Looking for a hotel near the conference center in Singapore for a business trip.",
    daysAgo: 4,
  },
  {
    name: "Habibur Rahman",
    email: "habibur.rahman@example.com",
    phone: "+8801755112233",
    serviceCategory: "Document Legalization",
    status: "ARCHIVED",
    message: "Query resolved outside the system, marking closed.",
    daysAgo: 25,
  },
  {
    name: "Lamia Ferdous",
    email: "lamia.ferdous@example.com",
    phone: "+8801633445566",
    serviceCategory: "Tourist Visa",
    status: "ARCHIVED",
    message: "Decided to postpone the trip, will reach out again when new dates are fixed.",
    daysAgo: 30,
  },
  {
    name: "Golam Mostafa",
    email: "golam.mostafa@example.com",
    phone: "+8801799001122",
    serviceCategory: "Air Ticketing",
    status: "ARCHIVED",
    message: "Booked directly with the airline in the end, thanks for the quotes though.",
    daysAgo: 34,
  },
  {
    name: "Rowshan Ara",
    email: "rowshan.ara@example.com",
    phone: "+8801511223344",
    serviceCategory: "Work & Family Visa",
    status: "ARCHIVED",
    message: "Application withdrawn due to a change in job offer, closing this request.",
    daysAgo: 40,
  },
  {
    name: "Delwar Hossain",
    email: "delwar.hossain@example.com",
    phone: "+8801822334411",
    serviceCategory: "Tourist Visa",
    status: "NEW",
    message: "Planning a Europe trip for 3 people in December, need Schengen visa help.",
    daysAgo: 0,
  },
  {
    name: "Jannatul Ferdous",
    email: "jannatul.ferdous@example.com",
    phone: "+8801933221144",
    serviceCategory: "Hotel Booking",
    status: "NEW",
    message: "Need a hotel recommendation near Istanbul airport for a short layover stay.",
    daysAgo: 1,
  },
  {
    name: "Mizanur Rahman",
    email: "mizanur.rahman@example.com",
    phone: "+8801644556677",
    serviceCategory: "Other",
    status: "IN_PROGRESS",
    message: "Following up on the apostille request submitted last week for my marriage certificate.",
    daysAgo: 6,
  },
  {
    name: "Ayesha Siddika",
    email: "ayesha.siddika@example.com",
    phone: "+8801766778899",
    serviceCategory: "Air Ticketing",
    status: "RESOLVED",
    message: "Ticket issued for the Dhaka-London route, thank you for matching the best fare.",
    daysAgo: 18,
  },
];

async function seedInquiries() {
  const count = await prisma.inquiry.count();
  if (count > 0) {
    console.log(`Inquiries already seeded (${count} rows).`);
    return;
  }

  const now = Date.now();
  for (const inquiry of INQUIRIES_SEED) {
    const createdAt = new Date(now - inquiry.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.inquiry.create({
      data: {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        serviceCategory: inquiry.serviceCategory,
        message: inquiry.message,
        status: inquiry.status,
        source: "contact_page",
        createdAt,
        updatedAt: createdAt,
      },
    });
  }
  console.log(`Seeded ${INQUIRIES_SEED.length} inquiries.`);
}

async function main() {
  await seedAdmin();
  await seedServices();
  await seedBlogs();
  await seedMoreBlogs();
  await seedDestinations();
  await seedSiteSettings();
  await seedInquiries();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
