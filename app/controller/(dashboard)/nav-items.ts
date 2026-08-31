import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Newspaper,
  MapPin,
  Search,
  Settings,
  UserCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/controller", icon: LayoutDashboard },
  { label: "Inquiries", href: "/controller/inquiries", icon: Inbox },
  { label: "Newsletter", href: "/controller/newsletter", icon: Mail },
  { label: "Services", href: "/controller/services", icon: Briefcase },
  { label: "Blogs", href: "/controller/blogs", icon: Newspaper },
  { label: "Destinations", href: "/controller/destinations", icon: MapPin },
  { label: "SEO", href: "/controller/seo", icon: Search },
  { label: "Settings", href: "/controller/settings", icon: Settings },
];

export const PROFILE_NAV_ITEM: NavItem = {
  label: "Profile",
  href: "/controller/profile",
  icon: UserCircle,
};
