import ServiceForm from "../ServiceForm";
import { createService } from "../actions";

export const metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-navy">New service</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new service to the public site.
      </p>
      <div className="mt-6">
        <ServiceForm action={createService} submitLabel="Create service" />
      </div>
    </div>
  );
}
