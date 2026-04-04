import { getProfileAction } from "@/actions/profile/profile.action";
import ProfileForm from "@/components/dashboard/profile/ProfileForm";

export default async function ProfilePage() {
  const result = await getProfileAction();

  if (!result.success || !result.data) {
    return <div className="p-6 text-sm text-red-500">{result.message}</div>;
  }
  console.log("my profile:", result.data);

  return <ProfileForm initialProfile={result.data} />;
}
