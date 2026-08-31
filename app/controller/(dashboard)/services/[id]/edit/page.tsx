import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "../../ServiceForm";
import { updateService } from "../../actions";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Edit service</h1>
      <p className="mt-1 text-sm text-gray-500">{service.title}</p>
      <div className="mt-6">
        <ServiceForm
          action={updateService.bind(null, id)}
          defaultValues={{
            title: service.title,
            slug: service.slug,
            category: service.category,
            tagline: service.tagline,
            description: service.description,
            features: service.features as string[],
            image: service.image,
            order: service.order,
            isPublished: service.isPublished,
            metaTitle: service.metaTitle,
            metaDescription: service.metaDescription,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
