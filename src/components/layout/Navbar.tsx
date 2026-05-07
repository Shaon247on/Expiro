import Link from "next/link";
import { cookies } from "next/headers";
import ExpiroLogo from "../elements/Logo";
import { COOKIE } from "@/lib/auth/cookies";
import NavbarClient from "./NavbarClient";

export type NavbarSessionUser = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "staff" | "admin";
  profile_image: string;
  shop_category: "restaurant" | "super_market" | null;
  is_active: boolean;
  plan_type: "free" | "starter" | "professional" | "enterprise";
};

export default async function Navbar() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(COOKIE.session)?.value;

  let user: NavbarSessionUser | null = null;

  if (rawSession) {
    try {
      user = JSON.parse(rawSession) as NavbarSessionUser;
    } catch {
      user = null;
    }
  }

  return <NavbarClient user={user} />;
}