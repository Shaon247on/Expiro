import { getProfileAction } from "@/actions/profile/profile.action";
import { getNotificationPreferencesAction } from "@/actions/profile/notification-preferences.action";
import { getWhatsappPreferenceAction } from "@/actions/profile/whatsapp.action";
import ProfileForm from "@/components/dashboard/profile/ProfileForm";

export default async function ProfilePage() {
  const [profileResult, notificationResult, whatsappResult] = await Promise.all([
    getProfileAction(),
    getNotificationPreferencesAction(),
    getWhatsappPreferenceAction(),
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
      initialWhatsappPreference={
        whatsappResult.success && whatsappResult.data
          ? whatsappResult.data
          : {
              phone: null,
              is_verified: false,
              is_enabled: false,
              last_error: null,
              created_at: "",
              updated_at: "",
            }
      }
    />
  );
}