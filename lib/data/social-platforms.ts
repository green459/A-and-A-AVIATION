// Pure constants/types only — no Prisma import. lib/data/settings.ts pulls
// in the Prisma client (and its Node-only mariadb driver), so anything
// imported by a "use client" component must come from here instead, or
// Next bundles the DB driver into the browser and the build fails.

export const SOCIAL_PLATFORMS = [
  "facebook",
  "twitter",
  "instagram",
  "pinterest",
  "linkedin",
  "youtube",
  "whatsapp",
  "other",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  twitter: "Twitter / X",
  instagram: "Instagram",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  other: "Other",
};

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
  /** Custom uploaded icon path — only meaningful when platform === "other".
   * Empty string means "use the generic link icon". */
  icon: string;
}
