import { getProfileAction } from "@/actions/profile/profile.action";
import { getNotificationPreferencesAction } from "@/actions/profile/notification-preferences.action";
import ProfileForm from "@/components/dashboard/profile/ProfileForm";

export default async function ProfilePage() {
  const [profileResult, notificationResult] = await Promise.all([
    getProfileAction(),
    getNotificationPreferencesAction(),
  ]);

  if (!profileResult.success || !profileResult.data) {
    return <div className="p-6 text-sm text-red-500">{profileResult.message}</div>;
  }

  return (
    <ProfileForm
      initialProfile={profileResult.data}
      initialNotificationPreferences={
        notificationResult.success && notificationResult.data
          ? notificationResult.data
          : {
              user_id: 0,
              user_email: profileResult.data.email,
              user_role: profileResult.data.role,
              expiry_alerts: true,
              low_stock_alerts: true,
              daily_summary_email: false,
              created_at: "",
              updated_at: "",
            }
      }
    />
  );
}