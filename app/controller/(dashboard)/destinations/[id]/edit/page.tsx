import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DestinationForm from "../../DestinationForm";
import { updateDestination } from "../../actions";

export const metadata = { title: "Edit destination" };

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });

  if (!destination) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Edit destination</h1>
      <p className="mt-1 text-sm text-gray-500">{destination.country}</p>
      <div className="mt-6">
        <DestinationForm
          action={updateDestination.bind(null, id)}
          defaultValues={{
            country: destination.country,
            slug: destination.slug,
            region: destination.region,
            tagline: destination.tagline,
            description: destination.description,
            popularFor: destination.popularFor as string[],
            image: destination.image,
            order: destination.order,
            isPublished: destination.isPublished,
            metaTitle: destination.metaTitle,
            metaDescription: destination.metaDescription,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
