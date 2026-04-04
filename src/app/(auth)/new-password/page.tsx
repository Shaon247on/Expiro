import NewPasswordPage from "@/components/auth/NewPasswordPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const resetToken = cookieStore.get("password_reset_token")?.value;

  if (!resetToken) {
    redirect("/forgot-password");
  }

  return <NewPasswordPage />;
}