"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Camera } from "lucide-react";

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

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  firstName: z.string().min(1, "Required."),
  lastName: z.string().min(1, "Required."),
  email: z.string().email("Invalid email."),
  phone: z.string().min(6, "Invalid phone number."),
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

// ── Styles ────────────────────────────────────────────────────────────────────
const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-sm font-medium mb-1.5";
const labelStyle = { color: "#374151" };

// ── Toggle switch component ───────────────────────────────────────────────────
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

// ── Notification row ──────────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfileForm() {
  const [notifs, setNotifs] = useState({
    expiryAlerts: true,
    lowStockAlerts: true,
    dailySummaryEmail: false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "Mohammad",
      lastName: "AnaYet",
      email: "demoexample@gmail.com",
      phone: "(1234) 567890",
      gender: "Male",
      dob: "2000-10-01",
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

  function onSubmit(data: FormValues) {
    toast.success("Profile updated successfully!", {
      position: "bottom-right",
    });
  }

  function onPasswordSubmit(data: PasswordValues) {
    toast.success("Password updated successfully!", {
      position: "bottom-right",
    });
    passwordForm.reset();
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* ── Greeting ── */}
      <div>
        <h1
          className="text-xl sm:text-2xl font-bold"
          style={{ color: "#1F485B" }}
        >
          Hello, Mohammad AnaYet. Welcome back to Ana Admin!
        </h1>
        <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
          {dateStr}
        </p>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        {/* Avatar + name row */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200"
              style={{ backgroundColor: "#3D4F61" }}
              aria-label="Profile photo"
            >
              MA
            </div>
            {/* Camera upload button */}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow"
              style={{ backgroundColor: "#3A7326" }}
              aria-label="Upload profile photo"
            >
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p
              className="font-bold text-base sm:text-lg"
              style={{ color: "#1A3340" }}
            >
              Mohammad AnaYet
            </p>
            <p className="text-sm text-gray-500">demoexample@gmail.com</p>
          </div>
        </div>

        {/* ── Profile form ── */}
        <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            {/* Row 1: First + Last name */}
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
                      Frist Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="s-fname"
                      placeholder="Your First Name"
                      aria-invalid={fieldState.invalid}
                      className={inputCls}
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
                    <FieldLabel
                      htmlFor="s-lname"
                      className={labelCls}
                      style={labelStyle}
                    >
                      Last Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="s-lname"
                      placeholder="Your Last Name"
                      aria-invalid={fieldState.invalid}
                      className={inputCls}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Row 2: Email + Phone */}
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
                      placeholder="demoexample@gmail.com"
                      aria-invalid={fieldState.invalid}
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
                      placeholder="(1234) 567890"
                      aria-invalid={fieldState.invalid}
                      className={inputCls}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Row 3: Gender + Date of Birth */}
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
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
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
                      aria-invalid={fieldState.invalid}
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
                className="h-11 px-8 rounded-2xl text-sm font-semibold"
                style={{ backgroundColor: "#3A7326", color: "white" }}
              >
                Save Changes
              </Button>
            </div>
          </FieldGroup>
        </form>

        {/* ── Change Password (separate form) ── */}
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
                {/* Current Password */}
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
                        placeholder="Enter current password"
                        aria-invalid={fieldState.invalid}
                        className={inputCls}
                        autoComplete="current-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* New Password */}
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
                        placeholder="Enter new password"
                        aria-invalid={fieldState.invalid}
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
                {/* Confirm Password */}
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
                        placeholder="Re-enter new password"
                        aria-invalid={fieldState.invalid}
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
                  className="h-11 px-8 rounded-2xl text-sm font-semibold"
                  style={{ backgroundColor: "#3A7326", color: "white" }}
                >
                  Save Password
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>

        {/* ── Notification Preferences ── */}
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
              onChange={(v) => setNotifs((p) => ({ ...p, lowStockAlerts: v }))}
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
        </div>

        {/* ── Save button ── */}
        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            form="profile-form"
            className="h-11 px-8 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: "#3A7326", color: "white" }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
