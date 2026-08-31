import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/controller");
  }

  const { next, reset } = await searchParams;
  return <LoginForm next={next} resetSuccess={reset === "success"} />;
}
