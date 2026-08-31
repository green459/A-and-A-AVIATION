import { getDestinations } from "@/lib/data/destinations";
import { getServiceCategories } from "@/lib/data/services";
import {
  getDestinationsHero,
  getContactInfo,
  getContactFormFields,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import DestinationsPageClient from "./DestinationsPageClient";

export default async function DestinationsPage() {
  const [
    destinations,
    hero,
    contactInfo,
    serviceCategories,
    contactFormFields,
    terms,
    refund,
  ] = await Promise.all([
    getDestinations(),
    getDestinationsHero(),
    getContactInfo(),
    getServiceCategories(),
    getContactFormFields(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);

  return (
    <DestinationsPageClient
      destinations={destinations}
      hero={hero}
      contactInfo={contactInfo}
      serviceCategories={serviceCategories}
      contactFormFields={contactFormFields}
      termsEnabled={terms.enabled}
      refundEnabled={refund.enabled}
    />
  );
}
