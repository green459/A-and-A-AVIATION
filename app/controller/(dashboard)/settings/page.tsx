import { Suspense } from "react";
import {
  getContactInfo,
  getSocialLinks,
  getHomeHero,
  getHomeStats,
  getHomeTestimonials,
  getHomePartners,
  getHomeGallery,
  getFooterGallery,
  getHomeVisaCards,
  getHomeTicketCards,
  getHomeServiceCards,
  getHomePeopleGallery,
  getAboutHero,
  getAboutStory,
  getAboutValues,
  getAboutProcess,
  getDestinationsHero,
  getBlogsHero,
  getServicesHero,
  getServiceDetailHero,
  getContactHero,
  getContactFormFields,
  getPrivacyPolicy,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import ContactInfoForm from "./ContactInfoForm";
import SocialLinksForm from "./SocialLinksForm";
import HomeHeroForm from "./HomeHeroForm";
import HomeStatsForm from "./HomeStatsForm";
import HomeTestimonialsForm from "./HomeTestimonialsForm";
import HomePartnersForm from "./HomePartnersForm";
import HomeGalleryForm from "./HomeGalleryForm";
import FooterGalleryForm from "./FooterGalleryForm";
import HomeVisaCardsForm from "./HomeVisaCardsForm";
import HomeTicketCardsForm from "./HomeTicketCardsForm";
import HomeServiceCardsForm from "./HomeServiceCardsForm";
import HomePeopleGalleryForm from "./HomePeopleGalleryForm";
import AboutHeroForm from "./AboutHeroForm";
import AboutStoryForm from "./AboutStoryForm";
import AboutValuesForm from "./AboutValuesForm";
import AboutProcessForm from "./AboutProcessForm";
import DestinationsHeroForm from "./DestinationsHeroForm";
import BlogsHeroForm from "./BlogsHeroForm";
import ServicesHeroForm from "./ServicesHeroForm";
import ServiceDetailHeroForm from "./ServiceDetailHeroForm";
import ContactHeroForm from "./ContactHeroForm";
import ContactFormFieldsForm from "./ContactFormFieldsForm";
import PrivacyPolicyForm from "./PrivacyPolicyForm";
import TermsConditionsForm from "./TermsConditionsForm";
import RefundPolicyForm from "./RefundPolicyForm";
import ClearCacheForm from "./ClearCacheForm";
import SettingsTabs, { type SettingsTab } from "./SettingsTabs";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [
    contact,
    social,
    hero,
    stats,
    testimonials,
    partners,
    gallery,
    footerGallery,
    visaCards,
    ticketCards,
    serviceCards,
    peopleGallery,
    aboutHero,
    aboutStory,
    aboutValues,
    aboutProcess,
    destinationsHero,
    blogsHero,
    servicesHero,
    serviceDetailHero,
    contactHero,
    contactFormFields,
    privacyPolicy,
    termsConditions,
    refundPolicy,
  ] = await Promise.all([
    getContactInfo(),
    getSocialLinks(),
    getHomeHero(),
    getHomeStats(),
    getHomeTestimonials(),
    getHomePartners(),
    getHomeGallery(),
    getFooterGallery(),
    getHomeVisaCards(),
    getHomeTicketCards(),
    getHomeServiceCards(),
    getHomePeopleGallery(),
    getAboutHero(),
    getAboutStory(),
    getAboutValues(),
    getAboutProcess(),
    getDestinationsHero(),
    getBlogsHero(),
    getServicesHero(),
    getServiceDetailHero(),
    getContactHero(),
    getContactFormFields(),
    getPrivacyPolicy(),
    getTermsConditions(),
    getRefundPolicy(),
  ]);

  const tabs: SettingsTab[] = [
    {
      id: "general",
      label: "General",
      description:
        "Site-wide basics: contact details, social links, and the footer photo strip shown at the bottom of every page.",
      subTabs: [
        {
          id: "contact-social",
          label: "Contact & Social",
          items: [
            <ContactInfoForm key="contact-info" values={contact} />,
            <SocialLinksForm key="social-links" values={social} />,
          ],
        },
        {
          id: "footer-photos",
          label: "Footer Photos",
          items: [<FooterGalleryForm key="footer-gallery" values={footerGallery} />],
        },
      ],
    },
    {
      id: "home",
      label: "Home Page",
      description:
        "Every editable section of the homepage, top to bottom — pick a section below to jump straight to it.",
      subTabs: [
        {
          id: "hero",
          label: "Hero Banner",
          items: [<HomeHeroForm key="home-hero" values={hero} />],
        },
        {
          id: "photo-galleries",
          label: "Photo Galleries",
          items: [
            <HomeGalleryForm key="home-gallery" values={gallery} />,
            <HomePeopleGalleryForm key="home-people-gallery" values={peopleGallery} />,
          ],
        },
        {
          id: "card-marquees",
          label: "Scrolling Card Marquees",
          items: [
            <HomeVisaCardsForm key="home-visa-cards" values={visaCards} />,
            <HomeTicketCardsForm key="home-ticket-cards" values={ticketCards} />,
            <HomeServiceCardsForm key="home-service-cards" values={serviceCards} />,
          ],
        },
        {
          id: "stats-partners-reviews",
          label: "Stats, Partners & Reviews",
          items: [
            <HomeStatsForm key="home-stats" values={stats} />,
            <HomePartnersForm key="home-partners" values={partners} />,
            <HomeTestimonialsForm key="home-testimonials" values={testimonials} />,
          ],
        },
      ],
    },
    {
      id: "about",
      label: "About Page",
      description: "The hero, story, values, and process sections on the About page.",
      subTabs: [
        {
          id: "hero-story",
          label: "Hero & Story",
          items: [
            <AboutHeroForm key="about-hero" values={aboutHero} />,
            <AboutStoryForm key="about-story" values={aboutStory} />,
          ],
        },
        {
          id: "values-process",
          label: "Values & Process",
          items: [
            <AboutValuesForm key="about-values" values={aboutValues} />,
            <AboutProcessForm key="about-process" values={aboutProcess} />,
          ],
        },
      ],
    },
    {
      id: "destinations",
      label: "Destinations Page",
      description:
        "The hero banner at the top of the Destinations page. The destination cards below it are managed on the Destinations page in the sidebar, not here.",
      items: [<DestinationsHeroForm key="destinations-hero" values={destinationsHero} />],
    },
    {
      id: "blogs",
      label: "Blogs Page",
      description:
        "The hero banner at the top of the Blogs page. The posts below it are managed on the Blogs page in the sidebar, not here.",
      items: [<BlogsHeroForm key="blogs-hero" values={blogsHero} />],
    },
    {
      id: "services",
      label: "Services Page",
      description:
        "The hero banner at the top of the Services listing page, plus the text color used on every individual service page. Service content itself (title, tagline, description, image) is managed on the Services page in the sidebar.",
      items: [
        <ServicesHeroForm key="services-hero" values={servicesHero} />,
        <ServiceDetailHeroForm key="service-detail-hero" values={serviceDetailHero} />,
      ],
    },
    {
      id: "contact",
      label: "Contact Page",
      description:
        "The hero banner at the top of the Contact page, and the contact form's optional fields. The address, phone, and email in the form come from the General tab. The contact form itself also appears on the Home, Destinations, and Blogs pages, so field changes apply everywhere it's shown.",
      items: [
        <ContactHeroForm key="contact-hero" values={contactHero} />,
        <ContactFormFieldsForm key="contact-form-fields" values={contactFormFields} />,
      ],
    },
    {
      id: "legal",
      label: "Legal & System",
      description:
        "The Privacy Policy, Terms & Conditions, and Refund Policy pages, plus site-wide cache controls. Terms & Conditions and Refund Policy can each be switched off, which 404s the page and hides its link from the footer and contact form.",
      subTabs: [
        {
          id: "privacy-policy",
          label: "Privacy Policy",
          items: [<PrivacyPolicyForm key="privacy-policy" values={privacyPolicy} />],
        },
        {
          id: "terms-conditions",
          label: "Terms & Conditions",
          items: [<TermsConditionsForm key="terms-conditions" values={termsConditions} />],
        },
        {
          id: "refund-policy",
          label: "Refund Policy",
          items: [<RefundPolicyForm key="refund-policy" values={refundPolicy} />],
        },
        {
          id: "system",
          label: "System",
          items: [<ClearCacheForm key="clear-cache" />],
        },
      ],
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Every editable section of the site, organized by page. Contact
        details, social links, and the footer live under General; each
        public page has its own tab with the sections that appear on it.
      </p>

      <div className="mt-6">
        <Suspense>
          <SettingsTabs tabs={tabs} />
        </Suspense>
      </div>
    </div>
  );
}
