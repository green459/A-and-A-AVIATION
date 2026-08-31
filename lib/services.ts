import type { StaticImageData } from "next/image";

import airTicketingBg from "@/components/home/images/air-ticketing-bg.png";
import gallery2 from "@/components/home/images/gallery-2.png";
import gallery4 from "@/components/home/images/gallery-4.png";
import workVisaImg from "@/components/home/images/visas/work-visa.png";
import familyVisaImg from "@/components/home/images/visas/family-visa.png";
import seasonalVisaImg from "@/components/home/images/visas/seasonal-visa.png";

export interface Service {
  slug: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: StaticImageData;
}

export const SERVICES: Service[] = [
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
    image: airTicketingBg,
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
    image: gallery4,
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
    image: seasonalVisaImg,
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
    image: workVisaImg,
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
    image: familyVisaImg,
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
    image: gallery2,
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
