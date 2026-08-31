import type { Metadata } from "next";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta("/about", getSeoFallback("/about"));
  return toMetadata(seo);
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
