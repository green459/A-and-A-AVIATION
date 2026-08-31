import { getBlogs } from "@/lib/data/blogs";
import { getServiceCategories } from "@/lib/data/services";
import {
  getBlogsHero,
  getContactInfo,
  getContactFormFields,
  getTermsConditions,
  getRefundPolicy,
} from "@/lib/data/settings";
import BlogsPageClient from "./BlogsPageClient";

export default async function BlogsPage() {
  const [posts, hero, contactInfo, serviceCategories, contactFormFields, terms, refund] =
    await Promise.all([
      getBlogs(),
      getBlogsHero(),
      getContactInfo(),
      getServiceCategories(),
      getContactFormFields(),
      getTermsConditions(),
      getRefundPolicy(),
    ]);

  return (
    <BlogsPageClient
      posts={posts}
      hero={hero}
      contactInfo={contactInfo}
      serviceCategories={serviceCategories}
      contactFormFields={contactFormFields}
      termsEnabled={terms.enabled}
      refundEnabled={refund.enabled}
    />
  );
}
