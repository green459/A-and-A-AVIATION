"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { saveUploadedImage } from "@/lib/upload";
import {
  setSetting,
  getAboutHero,
  getAboutStory,
  getDestinationsHero,
  getBlogsHero,
  getContactHero,
  getServicesHero,
  getServiceDetailHero,
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  type SocialPlatform,
  type AboutValueItem,
  type AboutProcessStep,
  type PrivacyPolicySection,
  type HomeVisaCard,
  type HomeTicketCard,
  type HomeServiceCard,
  type HomePeopleGalleryImage,
} from "@/lib/data/settings";

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

/** Falls back to `fallback` for anything that isn't a proper 6-digit hex
 * color — a ColorField's text input is free-typed, so this is the only
 * thing standing between a stray value and a broken `style={{ color }}`. */
function parseHexColor(formData: FormData, field: string, fallback: string): string {
  const value = String(formData.get(field) ?? "").trim();
  return HEX_COLOR_PATTERN.test(value) ? value : fallback;
}

function parseLegalPageForm(formData: FormData) {
  const titles = formData.getAll("sections_title").map((v) => String(v).trim());
  const bodies = formData.getAll("sections_body").map((v) => String(v).trim());

  const sections: PrivacyPolicySection[] = titles
    .map((title, i) => ({ title, body: bodies[i] ?? "" }))
    .filter((section) => section.title && section.body);

  return {
    enabled: formData.get("enabled") === "true",
    intro: String(formData.get("intro") ?? "").trim(),
    lastUpdated: String(formData.get("lastUpdated") ?? "").trim(),
    sections,
  };
}

export type SettingsFormState = { error: string | null; success: boolean };
const OK: SettingsFormState = { error: null, success: true };

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/", "layout");
  // Without this, the settings page keeps showing whatever it fetched on
  // its last full load — React resets every uncontrolled field in a
  // submitted form back to its `defaultValue` once the action settles, and
  // that `defaultValue` comes from this page's (now-stale) props. The
  // fields the admin just typed would visibly revert (a brand-new row's
  // text/alt back to blank) until a manual reload re-fetched the real data.
  revalidatePath("/controller/settings");
}

export type ClearCacheState = { clearedAt: number | null };

/** Busts every cached render across the site — the root (site) layout tree
 * plus the admin layout tree — for when a fix needs to show up immediately
 * instead of waiting for the next natural revalidation. */
export async function clearAllCaches(): Promise<ClearCacheState> {
  await requireAdmin();

  revalidatePath("/", "layout");
  revalidatePath("/controller", "layout");

  return { clearedAt: Date.now() };
}

export async function updateContactInfo(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return {
      error: "Enter a valid latitude (-90 to 90) and longitude (-180 to 180).",
      success: false,
    };
  }

  await setSetting("contact_info", {
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    latitude,
    longitude,
  });

  revalidatePublicPages();
  return OK;
}

export async function updateSocialLinks(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const platforms = formData.getAll("social_platform").map(String);
  const labels = formData.getAll("social_label").map(String);
  const urls = formData.getAll("social_url").map((v) => String(v).trim());
  const existingIcons = formData.getAll("social_existingIcon").map(String);
  const newIcons = formData.getAll("social_newIcon");

  const links: {
    platform: SocialPlatform;
    label: string;
    url: string;
    icon: string;
  }[] = [];
  for (let i = 0; i < platforms.length; i++) {
    const url = urls[i] ?? "";
    if (!url) continue;

    const safePlatform: SocialPlatform = SOCIAL_PLATFORMS.includes(
      platforms[i] as SocialPlatform,
    )
      ? (platforms[i] as SocialPlatform)
      : "other";
    const label = labels[i]?.trim() || SOCIAL_PLATFORM_LABELS[safePlatform];

    let icon = safePlatform === "other" ? (existingIcons[i] ?? "") : "";
    const newIcon = newIcons[i];
    if (safePlatform === "other" && newIcon instanceof File && newIcon.size > 0) {
      try {
        icon = await saveUploadedImage(newIcon, "social");
      } catch {
        return { error: `Couldn't upload icon for "${label}".`, success: false };
      }
    }

    links.push({ platform: safePlatform, label, url, icon });
  }

  await setSetting("social_links", links);

  revalidatePublicPages();
  return OK;
}

export async function updateHomeHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  await setSetting("home_hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    ctaHref: String(formData.get("ctaHref") ?? "").trim() || "/services",
  });

  revalidatePublicPages();
  return OK;
}

export async function updateHomeStats(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const values = formData.getAll("stats_value").map((v) => String(v).trim());
  const labels = formData.getAll("stats_label").map((v) => String(v).trim());

  const stats = values
    .map((value, i) => ({ value, label: labels[i] ?? "" }))
    .filter((s) => s.value && s.label);

  await setSetting("home_stats", stats);

  revalidatePublicPages();
  return OK;
}

export async function updateHomeTestimonials(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const quotes = formData.getAll("testimonials_quote").map((v) => String(v).trim());
  const names = formData.getAll("testimonials_name").map((v) => String(v).trim());
  const roles = formData.getAll("testimonials_role").map((v) => String(v).trim());
  const captions = formData.getAll("testimonials_caption").map((v) => String(v).trim());

  const testimonials = quotes
    .map((quote, i) => ({
      quote,
      name: names[i] ?? "",
      role: roles[i] ?? "",
      caption: captions[i] ?? "",
    }))
    .filter((t) => t.quote && t.name);

  await setSetting("home_testimonials", testimonials);

  revalidatePublicPages();
  return OK;
}

export async function updateHomePartners(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const labels = formData.getAll("partners_label").map((v) => String(v).trim());
  const existingImages = formData.getAll("partners_existingImage").map((v) => String(v));
  const newImages = formData.getAll("partners_newImage");

  const partners: { name: string; image: string }[] = [];
  for (let i = 0; i < labels.length; i++) {
    if (!labels[i]) continue;
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "partners");
      } catch {
        return { error: `Couldn't upload image for "${labels[i]}".`, success: false };
      }
    }
    if (!image) continue;
    partners.push({ name: labels[i], image });
  }

  await setSetting("home_partners", partners);

  revalidatePublicPages();
  return OK;
}

export async function updateHomeGallery(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const alts = formData.getAll("gallery_label").map((v) => String(v).trim());
  const existingImages = formData.getAll("gallery_existingImage").map((v) => String(v));
  const newImages = formData.getAll("gallery_newImage");

  const gallery: { alt: string; image: string }[] = [];
  for (let i = 0; i < alts.length; i++) {
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "gallery");
      } catch {
        return { error: "Couldn't upload one of the gallery images.", success: false };
      }
    }
    if (!image) continue;
    gallery.push({ alt: alts[i] || "Gallery photo", image });
  }

  await setSetting("home_gallery", gallery);

  revalidatePublicPages();
  return OK;
}

export async function updateFooterGallery(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const alts = formData.getAll("footerGallery_label").map((v) => String(v).trim());
  const existingImages = formData.getAll("footerGallery_existingImage").map((v) => String(v));
  const newImages = formData.getAll("footerGallery_newImage");

  const gallery: { alt: string; image: string }[] = [];
  for (let i = 0; i < alts.length; i++) {
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "footer-gallery");
      } catch {
        return { error: "Couldn't upload one of the footer images.", success: false };
      }
    }
    if (!image) continue;
    gallery.push({ alt: alts[i] || "Footer photo", image });
  }

  await setSetting("footer_gallery", gallery);

  revalidatePublicPages();
  return OK;
}

export async function updateHomeVisaCards(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const tags = formData.getAll("visaCards_tag").map((v) => String(v).trim());
  const titles = formData.getAll("visaCards_title").map((v) => String(v).trim());
  const existingImages = formData.getAll("visaCards_existingImage").map(String);
  const newImages = formData.getAll("visaCards_newImage");

  const cards: HomeVisaCard[] = [];
  for (let i = 0; i < titles.length; i++) {
    if (!titles[i]) continue;
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "visa-cards");
      } catch {
        return { error: `Couldn't upload image for "${titles[i]}".`, success: false };
      }
    }
    if (!image) continue;
    cards.push({ tag: tags[i] ?? "", title: titles[i], image });
  }

  await setSetting("home_visa_cards", cards);

  revalidatePublicPages();
  return OK;
}

export async function updateHomeTicketCards(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const titles = formData.getAll("ticketCards_title").map((v) => String(v).trim());
  const descriptions = formData
    .getAll("ticketCards_description")
    .map((v) => String(v).trim());
  const existingImages = formData.getAll("ticketCards_existingImage").map(String);
  const newImages = formData.getAll("ticketCards_newImage");

  const cards: HomeTicketCard[] = [];
  for (let i = 0; i < titles.length; i++) {
    if (!titles[i]) continue;
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "ticket-cards");
      } catch {
        return { error: `Couldn't upload image for "${titles[i]}".`, success: false };
      }
    }
    if (!image) continue;
    cards.push({ title: titles[i], description: descriptions[i] ?? "", image });
  }

  await setSetting("home_ticket_cards", cards);

  revalidatePublicPages();
  return OK;
}

export async function updateHomeServiceCards(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const categories = formData
    .getAll("serviceCards_category")
    .map((v) => String(v).trim());
  const titles = formData.getAll("serviceCards_title").map((v) => String(v).trim());
  const existingImages = formData.getAll("serviceCards_existingImage").map(String);
  const newImages = formData.getAll("serviceCards_newImage");

  const cards: HomeServiceCard[] = [];
  for (let i = 0; i < titles.length; i++) {
    if (!titles[i]) continue;
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "service-cards");
      } catch {
        return { error: `Couldn't upload image for "${titles[i]}".`, success: false };
      }
    }
    if (!image) continue;
    cards.push({ category: categories[i] ?? "", title: titles[i], image });
  }

  await setSetting("home_service_cards", cards);

  revalidatePublicPages();
  return OK;
}

export async function updateHomePeopleGallery(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const alts = formData.getAll("peopleGallery_alt").map((v) => String(v).trim());
  const talls = formData.getAll("peopleGallery_tall").map(String);
  const existingImages = formData.getAll("peopleGallery_existingImage").map(String);
  const newImages = formData.getAll("peopleGallery_newImage");

  const images: HomePeopleGalleryImage[] = [];
  for (let i = 0; i < alts.length; i++) {
    const newImage = newImages[i];
    let image = existingImages[i] ?? "";
    if (newImage instanceof File && newImage.size > 0) {
      try {
        image = await saveUploadedImage(newImage, "people-gallery");
      } catch {
        return { error: "Couldn't upload one of the gallery images.", success: false };
      }
    }
    if (!image) continue;
    images.push({ image, alt: alts[i] || "Traveler photo", tall: talls[i] === "true" });
  }

  await setSetting("home_people_gallery", images);

  revalidatePublicPages();
  return OK;
}

export async function updateAboutHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getAboutHero();
  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile, "about");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed.", success: false };
    }
  }

  await setSetting("about_hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    titleColor: parseHexColor(formData, "titleColor", existing.titleColor),
    shadowColor: parseHexColor(formData, "shadowColor", existing.shadowColor),
  });

  revalidatePath("/about");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateAboutStory(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getAboutStory();
  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile, "about");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed.", success: false };
    }
  }

  await setSetting("about_story", {
    label: String(formData.get("label") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    paragraph1: String(formData.get("paragraph1") ?? "").trim(),
    paragraph2: String(formData.get("paragraph2") ?? "").trim(),
    ctaLabel: String(formData.get("ctaLabel") ?? "").trim(),
    ctaHref: String(formData.get("ctaHref") ?? "").trim() || "/services",
    image,
  });

  revalidatePath("/about");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateDestinationsHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getDestinationsHero();
  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile, "destinations-hero");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed.", success: false };
    }
  }

  await setSetting("destinations_hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    titleColor: parseHexColor(formData, "titleColor", existing.titleColor),
    shadowColor: parseHexColor(formData, "shadowColor", existing.shadowColor),
  });

  revalidatePath("/destinations");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateBlogsHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getBlogsHero();
  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile, "blogs-hero");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed.", success: false };
    }
  }

  await setSetting("blogs_hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    titleColor: parseHexColor(formData, "titleColor", existing.titleColor),
    shadowColor: parseHexColor(formData, "shadowColor", existing.shadowColor),
  });

  revalidatePath("/blogs");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateContactHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getContactHero();
  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile, "contact-hero");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed.", success: false };
    }
  }

  await setSetting("contact_hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    titleColor: parseHexColor(formData, "titleColor", existing.titleColor),
    shadowColor: parseHexColor(formData, "shadowColor", existing.shadowColor),
  });

  revalidatePath("/contact");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateServicesHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getServicesHero();
  let image = existing.image;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      image = await saveUploadedImage(imageFile, "services-hero");
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Image upload failed.", success: false };
    }
  }

  await setSetting("services_hero", {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    titleColor: parseHexColor(formData, "titleColor", existing.titleColor),
    shadowColor: parseHexColor(formData, "shadowColor", existing.shadowColor),
  });

  revalidatePath("/services");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateServiceDetailHero(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const existing = await getServiceDetailHero();

  await setSetting("service_detail_hero", {
    titleColor: parseHexColor(formData, "titleColor", existing.titleColor),
    shadowColor: parseHexColor(formData, "shadowColor", existing.shadowColor),
  });

  // Every /services/[slug] page reads this same setting, so bust the whole
  // segment rather than one slug.
  revalidatePath("/services/[service]", "page");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateAboutValues(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const icons = formData.getAll("values_icon").map(String);
  const titles = formData.getAll("values_title").map((v) => String(v).trim());
  const descriptions = formData.getAll("values_description").map((v) => String(v).trim());

  const items: AboutValueItem[] = titles
    .map((title, i) => ({
      icon: icons[i] ?? "shield-check",
      title,
      description: descriptions[i] ?? "",
    }))
    .filter((item) => item.title && item.description);

  await setSetting("about_values", {
    sectionLabel: String(formData.get("sectionLabel") ?? "").trim(),
    sectionTitle: String(formData.get("sectionTitle") ?? "").trim(),
    items,
  });

  revalidatePath("/about");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateAboutProcess(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const titles = formData.getAll("process_title").map((v) => String(v).trim());
  const descriptions = formData.getAll("process_description").map((v) => String(v).trim());

  const items: AboutProcessStep[] = titles
    .map((title, i) => ({ title, description: descriptions[i] ?? "" }))
    .filter((item) => item.title && item.description);

  await setSetting("about_process", {
    sectionLabel: String(formData.get("sectionLabel") ?? "").trim(),
    sectionTitle: String(formData.get("sectionTitle") ?? "").trim(),
    items,
  });

  revalidatePath("/about");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updatePrivacyPolicy(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const titles = formData.getAll("sections_title").map((v) => String(v).trim());
  const bodies = formData.getAll("sections_body").map((v) => String(v).trim());

  const sections: PrivacyPolicySection[] = titles
    .map((title, i) => ({ title, body: bodies[i] ?? "" }))
    .filter((section) => section.title && section.body);

  await setSetting("privacy_policy", {
    intro: String(formData.get("intro") ?? "").trim(),
    lastUpdated: String(formData.get("lastUpdated") ?? "").trim(),
    sections,
  });

  revalidatePath("/privacy-policy");
  revalidatePath("/controller/settings");
  return OK;
}

export async function updateTermsConditions(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  await setSetting("terms_conditions", parseLegalPageForm(formData));

  revalidatePath("/terms-and-conditions");
  revalidatePublicPages();
  return OK;
}

export async function updateRefundPolicy(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  await setSetting("refund_policy", parseLegalPageForm(formData));

  revalidatePath("/refund-policy");
  revalidatePublicPages();
  return OK;
}

export async function updateContactFormFields(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  await setSetting("contact_form_fields", {
    phoneFieldEnabled: formData.get("phoneFieldEnabled") === "true",
  });

  revalidatePublicPages();
  return OK;
}
