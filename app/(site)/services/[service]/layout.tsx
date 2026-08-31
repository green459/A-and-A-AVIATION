import type { Metadata } from "next";
import { getService } from "@/lib/data/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.metaTitle || `${service.title} | A&A Aviation`,
    description: service.metaDescription || service.tagline,
  };
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
