import AboutPageClient from "./AboutPageClient";
import { getServiceCategories } from "@/lib/data/services";
import {
  getHomeStats,
  getHomePartners,
  getContactInfo,
  getAboutHero,
  getAboutStory,
  getAboutValues,
  getAboutProcess,
} from "@/lib/data/settings";

export default async function AboutPage() {
  const [stats, partners, contactInfo, serviceCategories, hero, story, values, process] =
    await Promise.all([
      getHomeStats(),
      getHomePartners(),
      getContactInfo(),
      getServiceCategories(),
      getAboutHero(),
      getAboutStory(),
      getAboutValues(),
      getAboutProcess(),
    ]);

  return (
    <AboutPageClient
      stats={stats}
      partners={partners}
      contactInfo={contactInfo}
      serviceCategories={serviceCategories}
      hero={hero}
      story={story}
      values={values}
      process={process}
    />
  );
}
