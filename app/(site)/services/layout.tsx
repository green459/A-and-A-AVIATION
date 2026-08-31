import type { Metadata } from "next";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta("/services", getSeoFallback("/services"));
  return toMetadata(seo);
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
