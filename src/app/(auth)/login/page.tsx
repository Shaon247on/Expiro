import LoginPage from "@/components/auth/LoginPage";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function Page({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params?.next ?? "";

  return <LoginPage next={next} />;
}
