import type { Metadata } from "next";
import { getSeoMeta, getSeoFallback, toMetadata } from "@/lib/data/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta("/blogs", getSeoFallback("/blogs"));
  return toMetadata(seo);
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
