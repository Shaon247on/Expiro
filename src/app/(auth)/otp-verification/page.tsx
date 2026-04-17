import OtpVerificationPage from "@/components/auth/OtpValidation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; mode?: string }>;
}) {
  const params = await searchParams;

  return (
    <OtpVerificationPage
      email={params.email ?? ""}
      mode={params.mode ?? "signup"}
    />
  );
}