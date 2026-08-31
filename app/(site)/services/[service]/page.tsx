import { notFound } from "next/navigation";
import { getService, getServices, getServiceCategories } from "@/lib/data/services";
import {
  getServiceDetailHero,
  getContactInfo,
  getContactFormFields,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import ServiceDetailClient from "./ServiceDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const [
    allServices,
    hero,
    contactInfo,
    serviceCategories,
    contactFormFields,
    terms,
    refund,
  ] = await Promise.all([
    getServices(),
    getServiceDetailHero(),
    getContactInfo(),
    getServiceCategories(),
    getContactFormFields(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);
  const relatedServices = allServices.filter((s) => s.slug !== service.slug);

  return (
    <ServiceDetailClient
      service={service}
      relatedServices={relatedServices}
      hero={hero}
      contactInfo={contactInfo}
      serviceCategories={serviceCategories}
      contactFormFields={contactFormFields}
      termsEnabled={terms.enabled}
      refundEnabled={refund.enabled}
    />
  );
}
