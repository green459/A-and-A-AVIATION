import {
  Award,
  Clock,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Users,
  Plane,
  Star,
  type LucideIcon,
} from "lucide-react";

/** Fixed set of icons an admin can pick for an About-page "value" card —
 * a dropdown of known-good keys instead of free-text, so a bad value can
 * never break rendering. */
export const ABOUT_VALUE_ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  clock: Clock,
  users: Users,
  globe: Globe2,
  "heart-handshake": HeartHandshake,
  award: Award,
  plane: Plane,
  star: Star,
};

export const ABOUT_VALUE_ICON_OPTIONS = [
  { value: "shield-check", label: "Shield" },
  { value: "clock", label: "Clock" },
  { value: "users", label: "Users" },
  { value: "globe", label: "Globe" },
  { value: "heart-handshake", label: "Handshake" },
  { value: "award", label: "Award" },
  { value: "plane", label: "Plane" },
  { value: "star", label: "Star" },
];

export function getAboutValueIcon(key: string): LucideIcon {
  return ABOUT_VALUE_ICONS[key] ?? ShieldCheck;
}
