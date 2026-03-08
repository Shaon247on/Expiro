"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#3A7326"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {checks.map((ok, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ backgroundColor: i < score ? colors[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function NewPasswordPage() {
  const router = useRouter();
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const watchedPassword = form.watch("password");

  function onSubmit(_data: FormValues) {
    toast("Password updated!", {
      description: "Your new password has been set. You can now sign in.",
      position: "bottom-right",
    });
    router.push("/login");
  }

  return (
    <Card
      className="w-full rounded-3xl shadow-xl border-0"
      style={{ backgroundColor: "#EEF3EA" }}
    >
      <CardHeader className="items-center text-center pt-8 pb-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#D4EAC8" }}
        >
          <KeyRound size={26} style={{ color: "#3A7326" }} aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl font-bold" style={{ color: "#1A3340" }}>
          Set a New Password
        </CardTitle>
        <CardDescription className="max-w-xs" style={{ color: "#51564E" }}>
          Choose a strong password you haven&apos;t used before.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-6">
        <form id="new-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* New Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="new-password"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      aria-invalid={fieldState.invalid}
                      className="bg-white border-gray-200 rounded-xl h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNew((v) => !v)}
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <PasswordStrength password={watchedPassword} />
                  <FieldDescription style={{ color: "#51564E" }}>
                    Use 8+ characters, one uppercase letter, and one number.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="confirm-password"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white border-gray-200 rounded-xl h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 sm:px-8 pb-8 pt-2">
        <Button
          type="submit"
          form="new-password-form"
          className="w-full h-12 rounded-xl text-base font-semibold"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          Update Password
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full h-12 rounded-xl text-base"
          onClick={() => router.push("/login")}
        >
          <ArrowLeft size={16} className="mr-2" aria-hidden="true" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}