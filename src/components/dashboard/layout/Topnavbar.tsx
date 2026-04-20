import MobileMenuTrigger from "./Mobilemenutrigge";
import NotificationDropdown from "./Notificationdropdow";
import SettingNav from "./SettingNav";
import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth/cookies";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlobalSearch from "./GlobalSearch";
import ClearSearchButton from "./ClearSearchButton";

export default async function TopNavbar() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE.session)?.value;

  if (!session) return null;

  const user = JSON.parse(session) as {
    name: string;
    role: "admin" | "staff" | "super_admin";
    profile_image?: string | null;
  };

  console.log("the user:",user)

  const nameProxy = user.name
    .trim()
    .split(/\s+/)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header
      className="sticky shadow top-0 z-20 flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-white shrink-0"
      style={{ borderBottom: "1px solid #f0f0f0" }}
    >
      <div className="lg:hidden shrink-0">
        <MobileMenuTrigger />
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-xl min-w-0">
        <GlobalSearch role={user.role} />
        <ClearSearchButton />
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <NotificationDropdown />
        <SettingNav />
        <div className="relative" />
        <div className="w-px h-6 bg-gray-200" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Hello,{" "}
            <span className="font-semibold text-gray-800">{user.name}</span>
          </span>
          <Avatar>
            <AvatarImage
              src={
                user.profile_image === ""
                  ? "https://github.com/shadcn.png"
                  : user.profile_image || "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>{nameProxy}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
