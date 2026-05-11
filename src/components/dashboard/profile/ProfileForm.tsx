"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Camera, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  changePasswordAction,
  type ProfileDto,
  updateProfileAction,
} from "@/actions/profile/profile.action";

import {
  updateNotificationPreferencesAction,
  type NotificationPreferencesDto,
} from "@/actions/profile/notification-preferences.action";

import {
  getWhatsappPreferenceAction,
  sendWhatsappOtpAction,
  toggleWhatsappNotificationAction,
  type WhatsappPreferenceDto,
  verifyWhatsappOtpAction,
} from "@/actions/profile/whatsapp.action";

import Image from "next/image";
import { usePathname } from "next/navigation";

const schema = z.object({
  firstName: z.string().min(1, "Required."),
  lastName: z.string().min(1, "Required."),
  email: z.string().email("Invalid email."),
  phone: z
    .string()
    .trim()
    .regex(
      /^[\d+-]{8,15}$/,
      "Phone number must be 8 to 15 characters and can include digits, +, or -.",
    ),
  gender: z.string().min(1, "Required."),
  dob: z.string().min(1, "Required."),
});

type FormValues = z.infer<typeof schema>;

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

const whatsappSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{8,15}$/,
      "Phone number must be 8 to 15 digits and may start with +.",
    ),
  otp: z.string().optional(),
});

type WhatsappValues = z.infer<typeof whatsappSchema>;

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-sm font-medium mb-1.5";
const labelStyle = { color: "#374151" };

function Toggle({
  checked,
  onChange,
  id,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        width: 52,
        height: 28,
        backgroundColor: checked ? "#3A7326" : "#D1D5DB",
      }}
    >
      <span
        className="inline-block rounded-full bg-white shadow-sm transition-transform"
        style={{
          width: 22,
          height: 22,
          transform: checked ? "translateX(26px)" : "translateX(3px)",
        }}
        aria-hidden="true"
      />
    </button>
  );
}

function NotifRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  name?: string | null,
) {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";
  }

  const parts = name?.trim().split(" ").filter(Boolean) ?? [];
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatPlanLabel(plan: ProfileDto["plan_type"]) {
  switch (plan) {
    case "free":
      return "Free";
    case "starter":
      return "Starter";
    case "professional":
      return "Professional";
    case "enterprise":
      return "Enterprise";
    default:
      return "No Plan";
  }
}

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "—";
  }
}

function normalizeWhatsappPhone(value?: string | null) {
  if (!value) return "";
  return value.replace(/^whatsapp:/, "");
}

export default function ProfileForm({
  initialProfile,
  initialNotificationPreferences,
  initialWhatsappPreference,
  isAdmin = false,
}: {
  initialProfile: ProfileDto;
  initialNotificationPreferences: NotificationPreferencesDto;
  initialWhatsappPreference: WhatsappPreferenceDto;
  isAdmin?: boolean;
}) {
  const [notifs, setNotifs] = useState({
    expiryAlerts: initialNotificationPreferences.expiry_alerts,
    lowStockAlerts: initialNotificationPreferences.low_stock_alerts,
    dailySummaryEmail: initialNotificationPreferences.daily_summary_email,
  });

  const pathname = usePathname();
  const isStaff = pathname.startsWith("/staff");

  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<ProfileDto>(initialProfile);
  const [isSavingProfile, startSavingProfile] = useState(false);
  const [isSavingPassword, startSavingPassword] = useState(false);

  const [whatsappPref, setWhatsappPref] = useState<WhatsappPreferenceDto>(
    initialWhatsappPreference,
  );
  const [isSendingWhatsappOtp, setIsSendingWhatsappOtp] = useState(false);
  const [isVerifyingWhatsappOtp, setIsVerifyingWhatsappOtp] = useState(false);
  const [isTogglingWhatsapp, setIsTogglingWhatsapp] = useState(false);
  const [showWhatsappOtpInput, setShowWhatsappOtpInput] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialProfile.first_name ?? "",
      lastName: initialProfile.last_name ?? "",
      email: initialProfile.email ?? "",
      phone: initialProfile.phone ?? "",
      gender: initialProfile.gender ?? "",
      dob: initialProfile.date_of_birth ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const whatsappForm = useForm<WhatsappValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      phone:
        normalizeWhatsappPhone(initialWhatsappPreference?.phone) ||
        initialProfile?.phone ||
        "",
      otp: "",
    },
  });

  async function handleSaveNotifications() {
    setIsSavingNotifications(true);

    const previousState = { ...notifs };

    try {
      const result = await updateNotificationPreferencesAction({
        expiry_alerts: notifs.expiryAlerts,
        low_stock_alerts: notifs.lowStockAlerts,
        daily_summary_email: notifs.dailySummaryEmail,
      });

      if (!result.success) {
        setNotifs(previousState);

        toast.error("Failed to update notifications", {
          description: result.message,
        });
        return;
      }

      if (result.data) {
        setNotifs({
          expiryAlerts: result.data.expiry_alerts,
          lowStockAlerts: result.data.low_stock_alerts,
          dailySummaryEmail: result.data.daily_summary_email,
        });
      }

      toast.success("Notification preferences updated", {
        description: result.message,
      });
    } finally {
      setIsSavingNotifications(false);
    }
  }

  const previewImage = useMemo(() => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    return profile.profile_image || "";
  }, [selectedImage, profile.profile_image]);

  async function onSubmit(data: FormValues) {
    startSavingProfile(true);

    try {
      const payload = new FormData();

      payload.append("name", `${data.firstName} ${data.lastName}`.trim());
      payload.append("email", data.email);
      payload.append("phone", data.phone);
      payload.append("first_name", data.firstName);
      payload.append("last_name", data.lastName);
      payload.append("gender", data.gender.toLowerCase());
      payload.append("date_of_birth", data.dob);

      if (selectedImage) {
        payload.append("profile_image", selectedImage);
      }

      const result = await updateProfileAction(payload);

      if (!result.success) {
        if (result.fieldErrors?.first_name?.[0]) {
          form.setError("firstName", {
            type: "server",
            message: result.fieldErrors.first_name[0],
          });
        }
        if (result.fieldErrors?.last_name?.[0]) {
          form.setError("lastName", {
            type: "server",
            message: result.fieldErrors.last_name[0],
          });
        }
        if (result.fieldErrors?.email?.[0]) {
          form.setError("email", {
            type: "server",
            message: result.fieldErrors.email[0],
          });
        }
        if (result.fieldErrors?.phone?.[0]) {
          form.setError("phone", {
            type: "server",
            message: result.fieldErrors.phone[0],
          });
        }
        if (result.fieldErrors?.gender?.[0]) {
          form.setError("gender", {
            type: "server",
            message: result.fieldErrors.gender[0],
          });
        }
        if (result.fieldErrors?.date_of_birth?.[0]) {
          form.setError("dob", {
            type: "server",
            message: result.fieldErrors.date_of_birth[0],
          });
        }

        toast.error("Failed to update profile", {
          description: result.message,
        });
        return;
      }

      if (result.data) {
        setProfile(result.data);
        form.reset({
          firstName: result.data.first_name ?? "",
          lastName: result.data.last_name ?? "",
          email: result.data.email ?? "",
          phone: result.data.phone ?? "",
          gender: result.data.gender ?? "",
          dob: result.data.date_of_birth ?? "",
        });
      }

      setSelectedImage(null);

      toast.success("Profile updated", {
        description: result.message,
      });
    } finally {
      startSavingProfile(false);
    }
  }

  async function onPasswordSubmit(data: PasswordValues) {
    startSavingPassword(true);

    try {
      const result = await changePasswordAction({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_new_password: data.confirmPassword,
      });

      if (!result.success) {
        if (result.fieldErrors?.current_password?.[0]) {
          passwordForm.setError("currentPassword", {
            type: "server",
            message: result.fieldErrors.current_password[0],
          });
        }
        if (result.fieldErrors?.new_password?.[0]) {
          passwordForm.setError("newPassword", {
            type: "server",
            message: result.fieldErrors.new_password[0],
          });
        }
        if (result.fieldErrors?.confirm_new_password?.[0]) {
          passwordForm.setError("confirmPassword", {
            type: "server",
            message: result.fieldErrors.confirm_new_password[0],
          });
        }

        toast.error("Failed to change password", {
          description: result.message,
        });
        return;
      }

      passwordForm.reset();

      toast.success("Password updated", {
        description: result.message,
      });
    } finally {
      startSavingPassword(false);
    }
  }

  async function handleUseExistingPhone() {
    whatsappForm.setValue("phone", profile.phone);
  }

  async function handleSendWhatsappOtp() {
    const valid = await whatsappForm.trigger("phone");
    if (!valid) return;

    setIsSendingWhatsappOtp(true);

    try {
      const phone = whatsappForm.getValues("phone");

      const result = await sendWhatsappOtpAction({ phone });

      if (!result.success) {
        if (result.fieldErrors?.phone?.[0]) {
          whatsappForm.setError("phone", {
            type: "server",
            message: result.fieldErrors.phone[0],
          });
        }

        toast.error("Failed to send OTP", {
          description: result.message,
        });
        return;
      }

      const refreshed = await getWhatsappPreferenceAction();
      if (refreshed.success && refreshed.data) {
        setWhatsappPref(refreshed.data);
      }

      setShowWhatsappOtpInput(true);

      toast.success("OTP sent", {
        description: result.message,
      });
    } finally {
      setIsSendingWhatsappOtp(false);
    }
  }

  async function handleVerifyWhatsappOtp() {
    const otp = whatsappForm.getValues("otp")?.trim();

    if (!otp) {
      whatsappForm.setError("otp", {
        type: "manual",
        message: "OTP is required.",
      });
      return;
    }

    setIsVerifyingWhatsappOtp(true);

    try {
      const result = await verifyWhatsappOtpAction({ otp_code: otp });

      if (!result.success) {
        if (result.fieldErrors?.otp_code?.[0]) {
          whatsappForm.setError("otp", {
            type: "server",
            message: result.fieldErrors.otp_code[0],
          });
        }

        toast.error("OTP verification failed", {
          description: result.message,
        });
        return;
      }

      const refreshed = await getWhatsappPreferenceAction();
      if (refreshed.success && refreshed.data) {
        setWhatsappPref(refreshed.data);
      }

      setShowWhatsappOtpInput(false);
      whatsappForm.setValue("otp", "");

      toast.success("WhatsApp verified", {
        description: result.message,
      });
    } finally {
      setIsVerifyingWhatsappOtp(false);
    }
  }

  async function handleToggleWhatsapp(value: boolean) {
    setIsTogglingWhatsapp(true);

    try {
      const result = await toggleWhatsappNotificationAction({
        is_enabled: value,
      });

      if (!result.success) {
        toast.error("Failed to update WhatsApp notification", {
          description: result.message,
        });
        return;
      }

      if (result.data) {
        setWhatsappPref(result.data);
      }

      toast.success("WhatsApp preference updated", {
        description: result.message,
      });
    } finally {
      setIsTogglingWhatsapp(false);
    }
  }

  const initials = getInitials(
    profile.first_name,
    profile.last_name,
    profile.name,
  );

  const isFreePlan = profile.plan_type === "free";
  const isWhatsappVerified = whatsappPref?.is_verified;
  const whatsappPhoneValue = whatsappForm.watch("phone");

  return (
    <div className="w-full">
      <div className="rounded-[28px] border border-gray-100 bg-white shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-10">
          <div className="w-full xl:w-[280px] shrink-0">
            <div className="rounded-[28px] border border-gray-100 bg-gray-50 p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white flex items-center justify-center">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt={profile.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-[#3A7326]">
                        {initials}
                      </span>
                    )}
                  </div>

                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#3A7326] text-white flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <Camera size={18} />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setSelectedImage(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>

                <h2 className="mt-4 text-lg font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-sm text-gray-500">{profile.email}</p>

                <div className="mt-5 w-full rounded-2xl bg-white border border-gray-100 p-4 text-left space-y-3">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Current Plan</span>
                    <span className="font-semibold text-[#3A7326]">
                      {formatPlanLabel(profile.plan_type)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Started At</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(profile.started_at)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Expires At</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(profile.expires_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div>
              <p className="text-xl font-bold" style={{ color: "#1A3340" }}>
                Personal Information
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Update your basic account details
              </p>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5"
                id="profile-form"
              >
                <FieldGroup>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            First Name
                          </FieldLabel>
                          <Input
                            {...field}
                            className={inputCls}
                            placeholder="First name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lastName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Last Name
                          </FieldLabel>
                          <Input
                            {...field}
                            className={inputCls}
                            placeholder="Last name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Email
                          </FieldLabel>
                          <Input
                            {...field}
                            className={inputCls}
                            placeholder="Email"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Phone Number
                          </FieldLabel>
                          <Input
                            {...field}
                            className={inputCls}
                            placeholder="Phone number"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="gender"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Gender
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className={inputCls}>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="dob"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Date of Birth
                          </FieldLabel>
                          <Input {...field} type="date" className={inputCls} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      form="profile-form"
                      disabled={isSavingProfile}
                      className="h-11 px-8 rounded-2xl text-sm font-semibold"
                      style={{ backgroundColor: "#3A7326", color: "white" }}
                    >
                      {isSavingProfile ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        "Save Profile"
                      )}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </div>

            <div className="mt-10">
              <p
                className="text-base font-bold mb-0.5"
                style={{ color: "#1A3340" }}
              >
                Change Password
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Keep your account secure
              </p>

              <form
                id="password-form"
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="mt-5"
              >
                <FieldGroup>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Controller
                      name="currentPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Current Password
                          </FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            className={inputCls}
                            placeholder="Current password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="newPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            New Password
                          </FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            className={inputCls}
                            placeholder="New password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="confirmPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className={labelCls} style={labelStyle}>
                            Confirm Password
                          </FieldLabel>
                          <Input
                            {...field}
                            type="password"
                            className={inputCls}
                            placeholder="Confirm password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      form="password-form"
                      disabled={isSavingPassword}
                      className="h-11 px-8 rounded-2xl text-sm font-semibold"
                      style={{ backgroundColor: "#3A7326", color: "white" }}
                    >
                      {isSavingPassword ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        "Save Password"
                      )}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </div>

            {!isAdmin && (
              <>
                <div className="mt-10">
                  <p
                    className="text-base font-bold mb-0.5"
                    style={{ color: "#1A3340" }}
                  >
                    Notification Preferences
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Control how you receive alerts
                  </p>

                  <div className="mt-3">
                    <NotifRow
                      id="n-expiry"
                      label="Expiry Alerts"
                      description="Get notified when products are nearing expiry"
                      checked={notifs.expiryAlerts}
                      onChange={(v) =>
                        setNotifs((p) => ({ ...p, expiryAlerts: v }))
                      }
                    />
                    <NotifRow
                      id="n-stock"
                      label="Low Stock Alerts"
                      description="Get notified when items are running low"
                      checked={notifs.lowStockAlerts}
                      onChange={(v) =>
                        setNotifs((p) => ({ ...p, lowStockAlerts: v }))
                      }
                    />
                    <NotifRow
                      id="n-daily"
                      label="Daily Summary Email"
                      description="Receive a daily overview of your operations"
                      checked={notifs.dailySummaryEmail}
                      onChange={(v) =>
                        setNotifs((p) => ({ ...p, dailySummaryEmail: v }))
                      }
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={handleSaveNotifications}
                      disabled={isSavingNotifications}
                      className="h-11 px-8 rounded-2xl text-sm font-semibold"
                      style={{ backgroundColor: "#3A7326", color: "white" }}
                    >
                      {isSavingNotifications ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        "Save Notification Settings"
                      )}
                    </Button>
                  </div>
                </div>
                {isStaff ? (
                  <></>
                ) : (
                  <>
                    <div className="mt-10">
                      <p
                        className="text-base font-bold mb-0.5"
                        style={{ color: "#1A3340" }}
                      >
                        WhatsApp Notifications
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        Choose which WhatsApp number should receive your alerts
                      </p>

                      {isFreePlan ? (
                        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                          <p className="text-sm font-semibold text-amber-900">
                            This feature is not available on the Free plan.
                          </p>
                          <p className="text-xs text-amber-800 mt-1">
                            Upgrade your plan to enable WhatsApp notification
                            delivery.
                          </p>
                          <div className="mt-4">
                            <Link href="/pricing">
                              <Button
                                type="button"
                                className="h-10 rounded-xl text-sm font-semibold"
                                style={{
                                  backgroundColor: "#3A7326",
                                  color: "white",
                                }}
                              >
                                Upgrade Plan
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5 space-y-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                              <MessageCircle
                                size={18}
                                className="text-[#3A7326]"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                Current WhatsApp number
                              </p>
                              <p className="text-xs text-gray-500 mt-1 break-all">
                                {whatsappPref?.phone
                                  ? normalizeWhatsappPhone(whatsappPref?.phone)
                                  : "No WhatsApp number configured yet."}
                              </p>
                              <p className="text-xs mt-1">
                                <span className="font-medium text-gray-700">
                                  Verification:
                                </span>{" "}
                                <span
                                  className={
                                    whatsappPref?.is_verified
                                      ? "text-green-600 font-semibold"
                                      : "text-amber-600 font-semibold"
                                  }
                                >
                                  {whatsappPref?.is_verified
                                    ? "Verified"
                                    : "Not verified"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
                            <div>
                              <Field
                                data-invalid={
                                  !!whatsappForm.formState.errors.phone
                                }
                              >
                                <FieldLabel
                                  className={labelCls}
                                  style={labelStyle}
                                >
                                  WhatsApp Number
                                </FieldLabel>
                                <Input
                                  {...whatsappForm.register("phone")}
                                  className={inputCls}
                                  placeholder="+8801710670341"
                                />
                                {whatsappForm.formState.errors.phone && (
                                  <FieldError
                                    errors={[
                                      whatsappForm.formState.errors.phone,
                                    ]}
                                  />
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  Your current signup phone is{" "}
                                  <span className="font-medium text-gray-700">
                                    {profile.phone}
                                  </span>
                                  . If that number does not have WhatsApp, use a
                                  different one.{" "}
                                  <strong>
                                    Use country code before the number.
                                  </strong>
                                </p>
                              </Field>
                            </div>

                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-12 rounded-2xl"
                                onClick={handleUseExistingPhone}
                              >
                                Use Existing Phone
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              type="button"
                              onClick={handleSendWhatsappOtp}
                              disabled={isSendingWhatsappOtp}
                              className="h-11 rounded-2xl text-sm font-semibold"
                              style={{
                                backgroundColor: "#3A7326",
                                color: "white",
                              }}
                            >
                              {isSendingWhatsappOtp ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 size={16} className="animate-spin" />
                                  Sending OTP...
                                </span>
                              ) : (
                                "Send OTP to WhatsApp"
                              )}
                            </Button>

                            {isWhatsappVerified &&
                            normalizeWhatsappPhone(whatsappPref.phone) ===
                              whatsappPhoneValue.trim() ? (
                              <div className="h-11 px-4 rounded-2xl bg-green-50 border border-green-200 inline-flex items-center gap-2 text-sm text-green-700 font-medium">
                                <ShieldCheck size={16} />
                                Verified Number
                              </div>
                            ) : null}
                          </div>

                          {showWhatsappOtpInput && (
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                              <div>
                                <Field
                                  data-invalid={
                                    !!whatsappForm.formState.errors.otp
                                  }
                                >
                                  <FieldLabel
                                    className={labelCls}
                                    style={labelStyle}
                                  >
                                    Verification OTP
                                  </FieldLabel>
                                  <Input
                                    {...whatsappForm.register("otp")}
                                    className={inputCls}
                                    placeholder="Enter OTP"
                                  />
                                  {whatsappForm.formState.errors.otp && (
                                    <FieldError
                                      errors={[
                                        whatsappForm.formState.errors.otp,
                                      ]}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  onClick={handleVerifyWhatsappOtp}
                                  disabled={isVerifyingWhatsappOtp}
                                  className="h-12 rounded-2xl text-sm font-semibold"
                                  style={{
                                    backgroundColor: "#3A7326",
                                    color: "white",
                                  }}
                                >
                                  {isVerifyingWhatsappOtp ? (
                                    <span className="flex items-center gap-2">
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                      Verifying...
                                    </span>
                                  ) : (
                                    "Verify OTP"
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

                          {whatsappPref?.last_error ? (
                            <p className="text-xs text-red-500">
                              {whatsappPref?.last_error}
                            </p>
                          ) : null}

                          <div className="flex items-center justify-between gap-6 pt-2 border-t border-gray-200">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800">
                                Enable WhatsApp Notifications
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                This option becomes available only after the
                                phone number is verified.
                              </p>
                            </div>

                            <Toggle
                              id="whatsapp-enabled"
                              checked={whatsappPref?.is_enabled}
                              onChange={handleToggleWhatsapp}
                              disabled={
                                !whatsappPref?.is_verified || isTogglingWhatsapp
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
