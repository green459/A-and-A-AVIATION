import { prisma } from "@/lib/prisma";
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  type SocialPlatform,
  type SocialLink,
} from "@/lib/data/social-platforms";

// Re-exported so existing server-side consumers can keep importing these
// from here. Client components must import from lib/data/social-platforms
// directly (see that file for why).
export { SOCIAL_PLATFORMS, SOCIAL_PLATFORM_LABELS };
export type { SocialPlatform, SocialLink };

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  /** Office location shown on the contact map — was a hardcoded constant
   * in components/home/LeafletMap.tsx, now set here instead. */
  latitude: number;
  longitude: number;
}

export interface HomeHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

// Extends Record<string, string> (rather than a plain interface) so these
// shapes can be passed straight into RepeatingFieldsField's generic
// defaultValues prop without a structural-typing mismatch.
export interface HomeStat extends Record<string, string> {
  value: string;
  label: string;
}

export interface HomeTestimonial extends Record<string, string> {
  quote: string;
  name: string;
  role: string;
  caption: string;
}

export interface HomePartner {
  name: string;
  image: string;
}

export interface HomeGalleryImage {
  image: string;
  alt: string;
}

/** The "Beyond Our Services" photo strip in the site footer — shown above
 * the footer's link columns on every page, not just Home. */
export interface FooterGalleryImage {
  image: string;
  alt: string;
}

export interface HomeVisaCard {
  tag: string;
  title: string;
  image: string;
}

export interface HomeTicketCard {
  title: string;
  description: string;
  image: string;
}

export interface HomeServiceCard {
  category: string;
  title: string;
  image: string;
}

export interface HomePeopleGalleryImage {
  image: string;
  alt: string;
  tall: boolean;
}

export interface AboutHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  /** Hex color applied to the eyebrow/title/subtitle. */
  titleColor: string;
  /** Hex color the title's soft drop-shadow/glow is mixed from. */
  shadowColor: string;
}

export interface DestinationsHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  titleColor: string;
  shadowColor: string;
}

export interface BlogsHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  titleColor: string;
  shadowColor: string;
}

export interface ContactPageHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  titleColor: string;
  shadowColor: string;
}

export interface ServicesHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  titleColor: string;
  shadowColor: string;
}

/** The individual service detail pages (/services/[service]) reuse each
 * service's own image/title (managed on the Services page) — this only
 * covers the hero's text color and shadow, applied uniformly across every
 * service's page. */
export interface ServiceDetailHero {
  titleColor: string;
  shadowColor: string;
}

export interface AboutStory {
  label: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

export interface AboutValueItem extends Record<string, string> {
  icon: string;
  title: string;
  description: string;
}

export interface AboutValues {
  sectionLabel: string;
  sectionTitle: string;
  items: AboutValueItem[];
}

export interface AboutProcessStep extends Record<string, string> {
  title: string;
  description: string;
}

export interface AboutProcess {
  sectionLabel: string;
  sectionTitle: string;
  items: AboutProcessStep[];
}

export interface PrivacyPolicySection extends Record<string, string> {
  title: string;
  body: string;
}

export interface PrivacyPolicyContent {
  intro: string;
  lastUpdated: string;
  sections: PrivacyPolicySection[];
}

/** Shared shape for the two toggleable legal pages — Terms & Conditions and
 * Refund Policy. `enabled: false` means the route 404s and every mention of
 * the page elsewhere on the site (e.g. the contact form's agreement text)
 * is hidden, without needing to touch anything but this flag. */
export interface LegalPageContent {
  enabled: boolean;
  intro: string;
  lastUpdated: string;
  sections: PrivacyPolicySection[];
}

export type TermsConditionsContent = LegalPageContent;
export type RefundPolicyContent = LegalPageContent;

export interface ContactFormFieldsSettings {
  phoneFieldEnabled: boolean;
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+88 1965 323232",
  whatsapp: "8801965323232",
  email: "info@aaaviation.com",
  address: "Ka 39/1 (3rd Floor), Pragati Sarani, Kuril, Dhaka",
  // The office's actual previous hardcoded map position — kept as the
  // fallback so nothing moves until an admin sets their own coordinates.
  latitude: 23.8232,
  longitude: 90.4283,
};

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [];

const DEFAULT_HOME_HERO: HomeHero = {
  eyebrow: "Global Travel & Visa Solutions",
  title: "Global Travel",
  subtitle: "& Visa Solutions",
  ctaLabel: "See All Services",
  ctaHref: "/services",
};

const DEFAULT_HOME_STATS: HomeStat[] = [];
const DEFAULT_HOME_TESTIMONIALS: HomeTestimonial[] = [];
const DEFAULT_HOME_PARTNERS: HomePartner[] = [];
const DEFAULT_HOME_GALLERY: HomeGalleryImage[] = [];
const DEFAULT_FOOTER_GALLERY: FooterGalleryImage[] = [];
const DEFAULT_HOME_VISA_CARDS: HomeVisaCard[] = [];
const DEFAULT_HOME_TICKET_CARDS: HomeTicketCard[] = [];
const DEFAULT_HOME_SERVICE_CARDS: HomeServiceCard[] = [];
const DEFAULT_HOME_PEOPLE_GALLERY: HomePeopleGalleryImage[] = [];

// Dark-vignette heroes (light title over a darkened photo) all share the
// same sensible default title/shadow colors — gold accent title, ink glow —
// matching the site's existing brand palette (see app/globals.css).
const DEFAULT_DARK_HERO_TITLE_COLOR = "#f0ac27";
const DEFAULT_DARK_HERO_SHADOW_COLOR = "#05050d";

// Light-vignette heroes (navy title over a lightened photo) default to the
// same navy the site already used for these titles, with a white glow
// instead of a dark one so it still reads as a soft halo, not a smudge.
const DEFAULT_LIGHT_HERO_TITLE_COLOR = "#172B47";
const DEFAULT_LIGHT_HERO_SHADOW_COLOR = "#ffffff";

const DEFAULT_ABOUT_HERO: AboutHero = {
  eyebrow: "About Us",
  title: "Who We Are",
  subtitle:
    "A Dhaka-based travel and visa agency helping people fly, study, work and reunite with family abroad — with less paperwork stress.",
  image: "/assets/about/hero.png",
  titleColor: DEFAULT_DARK_HERO_TITLE_COLOR,
  shadowColor: DEFAULT_DARK_HERO_SHADOW_COLOR,
};

const DEFAULT_DESTINATIONS_HERO: DestinationsHero = {
  eyebrow: "Global Network",
  title: "Destinations",
  subtitle:
    "Visa and travel support across the destinations our clients ask for most — pick yours to see what we handle there.",
  image: "/assets/destinations/hero.png",
  titleColor: DEFAULT_DARK_HERO_TITLE_COLOR,
  shadowColor: DEFAULT_DARK_HERO_SHADOW_COLOR,
};

const DEFAULT_BLOGS_HERO: BlogsHero = {
  eyebrow: "Travel Insights",
  title: "Travel Guide",
  subtitle:
    "Visa guides, booking tips, and travel know-how from the A&A Aviation team.",
  image: "/assets/blogs/hero.png",
  titleColor: DEFAULT_DARK_HERO_TITLE_COLOR,
  shadowColor: DEFAULT_DARK_HERO_SHADOW_COLOR,
};

const DEFAULT_CONTACT_HERO: ContactPageHero = {
  eyebrow: "",
  title: "Contact",
  subtitle: "",
  image: "/assets/contact/contact.png",
  titleColor: DEFAULT_LIGHT_HERO_TITLE_COLOR,
  shadowColor: DEFAULT_LIGHT_HERO_SHADOW_COLOR,
};

const DEFAULT_SERVICES_HERO: ServicesHero = {
  eyebrow: "Our Services",
  title: "Services",
  subtitle:
    "Flights, hotels, visas and document services — everything you need for a hassle-free international journey.",
  image: "/assets/contact/contact.png",
  titleColor: DEFAULT_DARK_HERO_TITLE_COLOR,
  shadowColor: DEFAULT_DARK_HERO_SHADOW_COLOR,
};

const DEFAULT_SERVICE_DETAIL_HERO: ServiceDetailHero = {
  titleColor: DEFAULT_LIGHT_HERO_TITLE_COLOR,
  shadowColor: DEFAULT_LIGHT_HERO_SHADOW_COLOR,
};

const DEFAULT_ABOUT_STORY: AboutStory = {
  label: "Our Story",
  title: "Built Around Every Traveler's Journey",
  paragraph1:
    "A&A Aviation started with a simple observation: travel and visa processes are more confusing than they need to be. Between conflicting embassy requirements, shifting airline fares and legalization steps that have to happen in the right order, most people just need someone who has done it before.",
  paragraph2:
    "Today our team handles air ticketing, visa processing, hotel reservations and document legalization for clients across Bangladesh — combining IATA-accredited booking access with hands-on guidance for every visa category we support.",
  ctaLabel: "Explore Our Services",
  ctaHref: "/services",
  image: "/assets/about/story.png",
};

const DEFAULT_ABOUT_VALUES: AboutValues = {
  sectionLabel: "Why Choose Us",
  sectionTitle: "What Sets A&A Aviation Apart",
  items: [
    {
      icon: "shield-check",
      title: "Transparent Pricing",
      description:
        "The price we quote is the final price — no hidden fees or surprise charges after you've committed.",
    },
    {
      icon: "clock",
      title: "Fast Turnaround",
      description:
        "We work every case for the fastest realistic timeline and keep you updated at every stage of processing.",
    },
    {
      icon: "users",
      title: "Personalized Guidance",
      description:
        "Every traveler gets a plan built around their own documents, timeline and destination — not a generic checklist.",
    },
    {
      icon: "globe",
      title: "Global Network",
      description:
        "Partnerships with major airlines and hotel groups worldwide mean better fares and reliable bookings.",
    },
    {
      icon: "heart-handshake",
      title: "End-to-End Support",
      description:
        "From your first enquiry to landing at your destination, one team handles the whole journey — not just a booking.",
    },
    {
      icon: "award",
      title: "IATA Accredited",
      description:
        "Licensed and accredited air ticketing, giving you direct access to fares without a middleman markup.",
    },
  ],
};

const DEFAULT_ABOUT_PROCESS: AboutProcess = {
  sectionLabel: "How We Work",
  sectionTitle: "A Simple, Four-Step Process",
  items: [
    {
      title: "Free Consultation",
      description:
        "Share your travel or visa goal — our team explains the realistic options, timeline and documents you'll need.",
    },
    {
      title: "Documentation",
      description:
        "We prepare, verify and, where needed, legalize every document before anything is submitted on your behalf.",
    },
    {
      title: "Processing",
      description:
        "We handle embassy submissions, appointments and airline or hotel bookings, following up until it's resolved.",
    },
    {
      title: "Confirmation & Support",
      description:
        "You get your confirmed booking or approved visa, plus ongoing support before and during your trip.",
    },
  ],
};

const DEFAULT_PRIVACY_POLICY: PrivacyPolicyContent = {
  intro:
    'A&A Aviation ("we", "us") respects your privacy. This page explains what information we collect through this website, why we collect it, and how you can reach us about it.',
  lastUpdated: "11 August 2026",
  sections: [
    {
      title: "Information We Collect",
      body: "We only collect information you choose to give us directly: contact form submissions (your name, email address, phone number if provided, selected service category, and message), newsletter sign-ups (your email address), and any documents or details you share with us directly by phone, email or in person while we process a booking or visa application.",
    },
    {
      title: "How We Use Your Information",
      body: "We use the information you share to respond to your enquiry, prepare and process visa, ticketing or hotel bookings on your behalf, and — if you've subscribed — to send occasional travel and visa updates. We do not sell your information to third parties.",
    },
    {
      title: "Third-Party Services",
      body: "Our office location is displayed using an embedded OpenStreetMap / Leaflet map, which may load resources from its map tile provider when you view that page. Where a booking or visa application requires it, we share the minimum necessary information with the relevant airline, hotel, embassy or government authority to process your request.",
    },
    {
      title: "Data Retention",
      body: "We keep enquiry and booking information for as long as needed to provide our services and to meet our own legal, accounting or recordkeeping obligations, after which it is deleted or anonymized.",
    },
    {
      title: "Your Choices",
      body: "You can ask us to access, correct or delete the personal information we hold about you, or unsubscribe from newsletter emails at any time, by contacting us using the details below.",
    },
    {
      title: "Changes to This Policy",
      body: 'We may update this policy from time to time as our services change. The "Last updated" date below reflects the most recent revision.',
    },
  ],
};

const DEFAULT_TERMS_CONDITIONS: TermsConditionsContent = {
  enabled: true,
  intro:
    'These Terms & Conditions govern your use of the A&A Aviation website and the travel, visa, and related services we provide. By using this site or engaging our services, you agree to the terms below.',
  lastUpdated: "11 August 2026",
  sections: [
    {
      title: "Our Services",
      body: "A&A Aviation arranges air ticketing, visa processing, hotel reservations, and document legalization on your behalf. We act as an intermediary between you and airlines, embassies, hotels, and other third-party providers, who set their own rules, fares, and approval decisions.",
    },
    {
      title: "Bookings & Payments",
      body: "Fares, visa fees, and service charges are confirmed at the time of booking and may change until full payment is received. Full or partial payment may be required in advance depending on the airline, embassy, or hotel's own policy.",
    },
    {
      title: "Your Responsibilities",
      body: "You're responsible for providing accurate personal details and genuine documents, meeting application deadlines, and checking passport validity, visa, and entry requirements for your destination before travel.",
    },
    {
      title: "Visa & Booking Outcomes",
      body: "Visa approval is at the sole discretion of the relevant embassy or immigration authority. We prepare and submit applications carefully, but we cannot guarantee approval, processing times, or that a booking remains available until it's confirmed and paid for.",
    },
    {
      title: "Limitation of Liability",
      body: "A&A Aviation is not liable for losses caused by airline schedule changes, embassy delays or refusals, incomplete information provided by you, or events beyond our reasonable control.",
    },
    {
      title: "Changes to These Terms",
      body: 'We may update these Terms & Conditions from time to time as our services change. The "Last updated" date below reflects the most recent revision.',
    },
  ],
};

const DEFAULT_REFUND_POLICY: RefundPolicyContent = {
  enabled: true,
  intro:
    "This Refund Policy explains how cancellations and refunds are handled for air tickets, visa processing, hotel reservations, and other services booked through A&A Aviation.",
  lastUpdated: "11 August 2026",
  sections: [
    {
      title: "Airline Tickets",
      body: "Refunds for air tickets follow the fare rules and cancellation policy of the issuing airline, not A&A Aviation. Airline cancellation fees, fare differences, and non-refundable ticket restrictions apply as set by the airline.",
    },
    {
      title: "Visa Processing Fees",
      body: "Our service fee for preparing and submitting a visa application is non-refundable once the application has been submitted to the embassy or immigration authority, regardless of the outcome. Embassy or government fees are refunded only if and as the embassy itself allows.",
    },
    {
      title: "Hotel Reservations",
      body: "Refunds for hotel bookings depend on the rate type and cancellation policy selected at the time of booking. Non-refundable rates cannot be refunded; flexible rates are refunded according to the hotel's stated cancellation window.",
    },
    {
      title: "How to Request a Refund",
      body: "Send a refund request to our team with your booking or application reference. We'll confirm what's refundable with the relevant airline, embassy, or hotel and process any eligible refund to your original payment method.",
    },
    {
      title: "Processing Time",
      body: "Eligible refunds are typically processed within 7–21 business days, depending on how quickly the airline, embassy, or hotel releases the funds to us.",
    },
    {
      title: "Changes to This Policy",
      body: 'We may update this Refund Policy from time to time as our services change. The "Last updated" date below reflects the most recent revision.',
    },
  ],
};

const DEFAULT_CONTACT_FORM_FIELDS: ContactFormFieldsSettings = {
  phoneFieldEnabled: true,
};

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return fallback;
  return row.value as T;
}

export async function getContactInfo(): Promise<ContactInfo> {
  // Merge with defaults rather than returning the saved row as-is: rows
  // saved before latitude/longitude existed on this type would otherwise
  // come back with those fields undefined.
  const value = await getSetting<Partial<ContactInfo>>(
    "contact_info",
    DEFAULT_CONTACT_INFO,
  );
  return { ...DEFAULT_CONTACT_INFO, ...value };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const value = await getSetting<unknown>("social_links", DEFAULT_SOCIAL_LINKS);
  // Older builds stored this setting as a fixed {facebook, twitter, ...}
  // object instead of a list — treat any non-array leftover as empty rather
  // than crashing every page that renders the footer.
  return Array.isArray(value) ? (value as SocialLink[]) : DEFAULT_SOCIAL_LINKS;
}

export const getHomeHero = () =>
  getSetting<HomeHero>("home_hero", DEFAULT_HOME_HERO);

export const getHomeStats = () =>
  getSetting<HomeStat[]>("home_stats", DEFAULT_HOME_STATS);

export const getHomeTestimonials = () =>
  getSetting<HomeTestimonial[]>("home_testimonials", DEFAULT_HOME_TESTIMONIALS);

export const getHomePartners = () =>
  getSetting<HomePartner[]>("home_partners", DEFAULT_HOME_PARTNERS);

export const getHomeGallery = () =>
  getSetting<HomeGalleryImage[]>("home_gallery", DEFAULT_HOME_GALLERY);

export const getFooterGallery = () =>
  getSetting<FooterGalleryImage[]>("footer_gallery", DEFAULT_FOOTER_GALLERY);

export const getHomeVisaCards = () =>
  getSetting<HomeVisaCard[]>("home_visa_cards", DEFAULT_HOME_VISA_CARDS);

export const getHomeTicketCards = () =>
  getSetting<HomeTicketCard[]>("home_ticket_cards", DEFAULT_HOME_TICKET_CARDS);

export const getHomeServiceCards = () =>
  getSetting<HomeServiceCard[]>("home_service_cards", DEFAULT_HOME_SERVICE_CARDS);

export const getHomePeopleGallery = () =>
  getSetting<HomePeopleGalleryImage[]>(
    "home_people_gallery",
    DEFAULT_HOME_PEOPLE_GALLERY,
  );

export const getAboutHero = () =>
  getSetting<AboutHero>("about_hero", DEFAULT_ABOUT_HERO);

export const getDestinationsHero = () =>
  getSetting<DestinationsHero>("destinations_hero", DEFAULT_DESTINATIONS_HERO);

export const getBlogsHero = () =>
  getSetting<BlogsHero>("blogs_hero", DEFAULT_BLOGS_HERO);

export const getContactHero = () =>
  getSetting<ContactPageHero>("contact_hero", DEFAULT_CONTACT_HERO);

export const getServicesHero = () =>
  getSetting<ServicesHero>("services_hero", DEFAULT_SERVICES_HERO);

export const getServiceDetailHero = () =>
  getSetting<ServiceDetailHero>("service_detail_hero", DEFAULT_SERVICE_DETAIL_HERO);

export const getAboutStory = () =>
  getSetting<AboutStory>("about_story", DEFAULT_ABOUT_STORY);

export const getAboutValues = () =>
  getSetting<AboutValues>("about_values", DEFAULT_ABOUT_VALUES);

export const getAboutProcess = () =>
  getSetting<AboutProcess>("about_process", DEFAULT_ABOUT_PROCESS);

export const getPrivacyPolicy = () =>
  getSetting<PrivacyPolicyContent>("privacy_policy", DEFAULT_PRIVACY_POLICY);

export const getTermsConditions = () =>
  getSetting<TermsConditionsContent>("terms_conditions", DEFAULT_TERMS_CONDITIONS);

export const getRefundPolicy = () =>
  getSetting<RefundPolicyContent>("refund_policy", DEFAULT_REFUND_POLICY);

export const getContactFormFields = () =>
  getSetting<ContactFormFieldsSettings>(
    "contact_form_fields",
    DEFAULT_CONTACT_FORM_FIELDS,
  );

export async function setSetting(key: string, value: unknown): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: value as never },
    update: { value: value as never },
  });
}
