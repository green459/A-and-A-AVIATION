import type { StaticImageData } from "next/image";

import airTicketingBg from "@/components/home/images/air-ticketing-bg.png";
import gallery1 from "@/components/home/images/gallery-1.png";
import gallery3 from "@/components/home/images/gallery-3.png";
import gallery4 from "@/components/home/images/gallery-4.png";
import backpacker from "@/components/home/images/gallery2/backpacker.png";
import cityRiver from "@/components/home/images/gallery2/city-river.png";
import edgeCanal from "@/components/home/images/gallery2/edge-canal.png";
import edgeTraveler from "@/components/home/images/gallery2/edge-traveler.png";
import hijabTraveler from "@/components/home/images/gallery2/hijab-traveler.png";

export interface Destination {
  slug: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  popularFor: string[];
  image: StaticImageData;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "portugal",
    country: "Portugal",
    region: "Europe",
    tagline: "Family reunification, work permits and long-term residency",
    description:
      "A growing hub for South Asian workers and families, with a clear path from work or D6 family visa to long-term residency.",
    popularFor: ["D6 Family Visa", "Work Visa", "Residency"],
    image: airTicketingBg,
  },
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    region: "Europe",
    tagline: "World-class universities and skilled worker routes",
    description:
      "From undergraduate offers to Skilled Worker sponsorship, the UK remains one of the most requested destinations we process.",
    popularFor: ["Student Visa", "Work Visa", "Tourist Visa"],
    image: gallery3,
  },
  {
    slug: "canada",
    country: "Canada",
    region: "North America",
    tagline: "Study permits, PR pathways and family sponsorship",
    description:
      "Canada's points-based immigration system rewards strong applications — we help build yours around study, work or family routes.",
    popularFor: ["Student Visa", "PR Pathway", "Family Visa"],
    image: gallery1,
  },
  {
    slug: "australia",
    country: "Australia",
    region: "Oceania",
    tagline: "Study, skilled migration and working holiday options",
    description:
      "A consistently popular choice for students and skilled professionals, with well-defined visa subclasses for each pathway.",
    popularFor: ["Student Visa", "Skilled Migration", "Tourist Visa"],
    image: cityRiver,
  },
  {
    slug: "united-states",
    country: "United States",
    region: "North America",
    tagline: "Tourist, business and student visa support",
    description:
      "We prepare DS-160 applications and interview documentation for B1/B2, F1 and other common US visa categories.",
    popularFor: ["Tourist Visa", "Student Visa", "Business Visa"],
    image: gallery4,
  },
  {
    slug: "schengen-europe",
    country: "Schengen Europe",
    region: "Europe",
    tagline: "One visa, 27 countries — tourism and short business trips",
    description:
      "We handle Schengen tourist and business visa applications for Bangladeshi travelers heading across mainland Europe.",
    popularFor: ["Tourist Visa", "Business Visa"],
    image: edgeCanal,
  },
  {
    slug: "malaysia",
    country: "Malaysia",
    region: "Asia",
    tagline: "Affordable education and accessible tourist entry",
    description:
      "A cost-effective study destination with strong transfer pathways to Western universities, plus simple tourist visa processing.",
    popularFor: ["Student Visa", "Tourist Visa"],
    image: backpacker,
  },
  {
    slug: "united-arab-emirates",
    country: "United Arab Emirates",
    region: "Middle East",
    tagline: "Employment visas and fast-turnaround tourist entry",
    description:
      "From work permit attestation to short tourist stays, the UAE is one of our fastest-processing destinations.",
    popularFor: ["Work Visa", "Tourist Visa", "Document Legalization"],
    image: hijabTraveler,
  },
  {
    slug: "saudi-arabia",
    country: "Saudi Arabia",
    region: "Middle East",
    tagline: "Work visas, Umrah and Hajj travel support",
    description:
      "We support employment visa processing alongside Umrah and Hajj travel arrangements, including document legalization.",
    popularFor: ["Work Visa", "Umrah & Hajj", "Document Legalization"],
    image: edgeTraveler,
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((destination) => destination.slug === slug);
}
