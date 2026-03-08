import { NavBar } from "@/components/layout/NavBar";
import { ContributeForm } from "@/components/contribute/ContributeForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ContributePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <ContributeForm isLoggedIn={!!session} />
    </div>
  );
}
