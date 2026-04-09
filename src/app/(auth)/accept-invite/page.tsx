import { redirect } from "next/navigation";
import AcceptInvitePage from "@/components/auth/AcceptInvitePage";

interface AcceptInviteRouteProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function Page({ searchParams }: AcceptInviteRouteProps) {
  const params = await searchParams;
  const token = params?.token?.trim();

  if (!token) {
    redirect("/login");
  }

  return <AcceptInvitePage token={token} />;
}