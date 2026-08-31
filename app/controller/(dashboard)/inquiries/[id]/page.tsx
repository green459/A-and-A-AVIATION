import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isEmailConfigured } from "@/lib/email";
import InquiryDetailPanel from "../InquiryDetailPanel";

export const metadata = { title: "Inquiry" };

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { replies: { orderBy: { createdAt: "desc" } } },
  });

  if (!inquiry) {
    notFound();
  }

  const { replies, ...inquiryFields } = inquiry;

  return (
    <div className="max-w-6xl">
      <Link
        href="/controller/inquiries"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inquiries
      </Link>

      <div className="mt-4">
        <InquiryDetailPanel
          inquiry={inquiryFields}
          replies={replies}
          emailConfigured={isEmailConfigured()}
        />
      </div>
    </div>
  );
}
