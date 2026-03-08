import { NavBar } from "@/components/layout/NavBar";
import { LoginForm } from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { redirect: redirectTo } = await searchParams;
  if (session) redirect(redirectTo ?? "/");

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
