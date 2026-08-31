import type { Metadata } from "next";
import HomePage from "@/components/home/Home";
import { getBlogs } from "@/lib/data/blogs";
import { getServiceCategories } from "@/lib/data/services";
import {
  getHomeHero,
  getHomeStats,
  getHomeTestimonials,
  getHomePartners,
  getHomeGallery,
  getHomeVisaCards,
  getHomeTicketCards,
  getHomeServiceCards,
  getHomePeopleGallery,
  getContactInfo,
  getContactFormFields,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta("/", getSeoFallback("/"));
  return toMetadata(seo);
}

export default async function Home() {
  const [
    blogs,
    hero,
    stats,
    testimonials,
    partners,
    gallery,
    visaCards,
    ticketCards,
    serviceCards,
    peopleGallery,
    contact,
    serviceCategories,
    contactFormFields,
    terms,
    refund,
  ] = await Promise.all([
    getBlogs(),
    getHomeHero(),
    getHomeStats(),
    getHomeTestimonials(),
    getHomePartners(),
    getHomeGallery(),
    getHomeVisaCards(),
    getHomeTicketCards(),
    getHomeServiceCards(),
    getHomePeopleGallery(),
    getContactInfo(),
    getServiceCategories(),
    getContactFormFields(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);

  return (
    <HomePage
      recentBlogs={blogs.slice(0, 3)}
      hero={hero}
      stats={stats}
      testimonials={testimonials}
      partners={partners}
      gallery={gallery}
      visaCards={visaCards}
      ticketCards={ticketCards}
      serviceCards={serviceCards}
      peopleGallery={peopleGallery}
      contact={contact}
      serviceCategories={serviceCategories}
      contactFormFields={contactFormFields}
      termsEnabled={terms.enabled}
      refundEnabled={refund.enabled}
    />
  );
}
