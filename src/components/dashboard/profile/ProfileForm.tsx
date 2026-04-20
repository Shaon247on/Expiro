"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Camera, Loader2 } from "lucide-react";

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
import Image from "next/image";

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

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-sm font-medium mb-1.5";
const labelStyle = { color: "#374151" };

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
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

export default function ProfileForm({
  initialProfile,
  initialNotificationPreferences,
  isAdmin = false,
}: {
  initialProfile: ProfileDto;
  initialNotificationPreferences: NotificationPreferencesDto;
  isAdmin?: boolean;
}) {
  const [notifs, setNotifs] = useState({
    expiryAlerts: initialNotificationPreferences.expiry_alerts,
    lowStockAlerts: initialNotificationPreferences.low_stock_alerts,
    dailySummaryEmail: initialNotificationPreferences.daily_summary_email,
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<ProfileDto>(initialProfile);
  const [isSavingProfile, startSavingProfile] = useState(false);
  const [isSavingPassword, startSavingPassword] = useState(false);
  console.log("the profile data:", profile);
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

        toast.error("Update failed", {
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

        toast.error("Password change failed", {
          description: result.message,
        });
        return;
      }

      toast.success("Password updated", {
        description: result.message,
      });

      passwordForm.reset();
    } finally {
      startSavingPassword(false);
    }
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const displayName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    profile.name ||
    "User";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl sm:text-2xl font-bold"
          style={{ color: "#1F485B" }}
        >
          Hello, {displayName}. Welcome back!
        </h1>
        <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
          {dateStr}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative shrink-0">
            {previewImage ? (
              <Image
                width={500}
                height={500}
                src={previewImage}
                alt={displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200"
                style={{ backgroundColor: "#3D4F61" }}
                aria-label="Profile photo"
              >
                {getInitials(
                  profile.first_name,
                  profile.last_name,
                  profile.name,
                )}
              </div>
            )}

            <label
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer"
              style={{ backgroundColor: "#3A7326" }}
              aria-label="Upload profile photo"
            >
              <Camera size={13} className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedImage(file);
                }}
              />
            </label>
          </div>

          <div>
            <p
              className="font-bold text-base sm:text-lg"
              style={{ color: "#1A3340" }}
            >
              {displayName}
            </p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="s-fname"
                      className={labelCls}
                      style={labelStyle}
                    >
                      First Name
                    </FieldLabel>
                    <Input {...field} id="s-fname" className={inputCls} />
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
                    <FieldLabel
                      htmlFor="s-lname"
                      className={labelCls}
                      style={labelStyle}
                    >
                      Last Name
                    </FieldLabel>
                    <Input {...field} id="s-lname" className={inputCls} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="s-email"
                      className={labelCls}
                      style={labelStyle}
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="s-email"
                      type="email"
                      className={inputCls}
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
                    <FieldLabel
                      htmlFor="s-phone"
                      className={labelCls}
                      style={labelStyle}
                    >
                      Phone Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id="s-phone"
                      type="tel"
                      className={inputCls}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="s-gender"
                      className={labelCls}
                      style={labelStyle}
                    >
                      Gender
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="s-gender"
                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 text-sm"
                      >
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
                    <FieldLabel
                      htmlFor="s-dob"
                      className={labelCls}
                      style={labelStyle}
                    >
                      Date of Birth
                    </FieldLabel>
                    <Input
                      {...field}
                      id="s-dob"
                      type="date"
                      className={inputCls}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="flex justify-end mt-8">
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
                  "Save Changes"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>

        <div className="mt-10">
          <p
            className="text-base font-bold mb-0.5"
            style={{ color: "#1A3340" }}
          >
            Change Password
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Update your password to keep your account secure
          </p>

          <form
            id="password-form"
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          >
            <FieldGroup className="gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Controller
                  name="currentPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="s-current-password"
                        className={labelCls}
                        style={labelStyle}
                      >
                        Current Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="s-current-password"
                        type="password"
                        className={inputCls}
                        autoComplete="current-password"
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
                      <FieldLabel
                        htmlFor="s-new-password"
                        className={labelCls}
                        style={labelStyle}
                      >
                        New Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="s-new-password"
                        type="password"
                        className={inputCls}
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Controller
                  name="confirmPassword"
                  control={passwordForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="s-confirm-password"
                        className={labelCls}
                        style={labelStyle}
                      >
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="s-confirm-password"
                        type="password"
                        className={inputCls}
                        autoComplete="new-password"
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
        {isAdmin === false && (
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
                onChange={(v) => setNotifs((p) => ({ ...p, expiryAlerts: v }))}
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
        )}
      </div>
    </div>
  );
}
