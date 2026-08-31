import { getServices, getServiceCategories } from "@/lib/data/services";
import {
  getServicesHero,
  getContactInfo,
  getContactFormFields,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import ServicesPageClient from "./ServicesPageClient";

export default async function Page() {
  const [
    services,
    hero,
    contactInfo,
    serviceCategories,
    contactFormFields,
    terms,
    refund,
  ] = await Promise.all([
    getServices(),
    getServicesHero(),
    getContactInfo(),
    getServiceCategories(),
    getContactFormFields(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);

  return (
    <ServicesPageClient
      services={services}
      hero={hero}
      contactInfo={contactInfo}
      serviceCategories={serviceCategories}
      contactFormFields={contactFormFields}
      termsEnabled={terms.enabled}
      refundEnabled={refund.enabled}
    />
  );
}
