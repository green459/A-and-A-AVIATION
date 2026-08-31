import DestinationForm from "../DestinationForm";
import { createDestination } from "../actions";

export const metadata = { title: "New destination" };

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-navy">New destination</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new destination to the public site.
      </p>
      <div className="mt-6">
        <DestinationForm
          action={createDestination}
          submitLabel="Create destination"
        />
      </div>
    </div>
  );
}
