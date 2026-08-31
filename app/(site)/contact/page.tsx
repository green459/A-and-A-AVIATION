import type { Metadata } from "next";
import Contact from "@/components/Contact";
import ContactHero from "./ContactHero";
import {
  getContactInfo,
  getContactHero,
  getContactFormFields,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import { getServiceCategories } from "@/lib/data/services";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta("/contact", getSeoFallback("/contact"));
  return toMetadata(seo);
}

export default async function Page() {
  const [contactInfo, hero, serviceCategories, contactFormFields, terms, refund] =
    await Promise.all([
      getContactInfo(),
      getContactHero(),
      getServiceCategories(),
      getContactFormFields(),
      getTermsConditions(),
      getRefundPolicy(),
    ]);

  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center bg-sky">
      <ContactHero hero={hero} />
      <Contact
        contactInfo={contactInfo}
        serviceCategories={serviceCategories}
        phoneFieldEnabled={contactFormFields.phoneFieldEnabled}
        termsEnabled={terms.enabled}
        refundEnabled={refund.enabled}
      />
    </div>
  );
}
