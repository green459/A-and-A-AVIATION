import { requireAdmin } from "@/lib/auth/session";
import { ProfileDetailsForm, ChangePasswordForm } from "./ProfileForms";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const admin = await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your admin account details and password.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileDetailsForm name={admin.name} email={admin.email} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
