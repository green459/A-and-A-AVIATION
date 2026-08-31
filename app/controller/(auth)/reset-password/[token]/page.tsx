import Link from "next/link";
import { verifyResetToken } from "@/lib/auth/reset-token";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const record = await verifyResetToken(token);

  if (!record) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl text-navy">Link expired</h1>
          <p className="mt-1 text-sm text-gray-500">
            This reset link is invalid or has already been used. Request a
            new one to continue.
          </p>
        </div>
        <Link
          href="/controller/forgot-password"
          className="rounded-lg bg-navy py-3 text-center text-sm font-semibold text-white transition hover:bg-navy-hover"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
