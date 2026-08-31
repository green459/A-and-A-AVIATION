import type { Metadata } from "next";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta("/contact", getSeoFallback("/contact"));
  return toMetadata(seo);
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
