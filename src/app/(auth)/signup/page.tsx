"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ExpiroLogo from "@/components/elements/Logo";
import { signupAction } from "@/actions/auth/signup.action";

const schema = z
  .object({
    shop_category: z.string().min(1, "Please select a shop category."),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z
  .string()
  .trim()
  .regex(/^[\d+-]{8,15}$/, "Phone number must be 8 to 15 characters"),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof schema>;

const categories = [
  {
    value: "restaurant",
    label: "Restaurant"
  },
  {
    value: "supermarket",
    label: "Super Market"
  }
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shop_category: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await signupAction(data);
console.log(result)
      if (!result.success) {
        if (result.fieldErrors?.confirm_password?.[0]) {
          form.setError("confirm_password", {
            type: "server",
            message: result.fieldErrors.confirm_password[0],
          });
        }

        toast.error("Signup failed", {
          description: result.message,
        });
        return;
      }

      toast.success("OTP sent", {
        description: result.message,
      });

      router.push(`/otp-verification?email=${encodeURIComponent(data.email)}`);
    });
  }

  return (
    <Card
      className="w-full rounded-3xl shadow-xl border-0"
      style={{ backgroundColor: "#EEF3EA" }}
    >
      <CardHeader className="items-center text-center pt-8 pb-2">
        <div className="flex items-center justify-center">
          <ExpiroLogo />
        </div>

        <CardTitle className="text-2xl font-bold" style={{ color: "#1A3340" }}>
          Create your Account
        </CardTitle>

        <CardDescription style={{ color: "#51564E" }}>
          Please enter your details to sign up to your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-6">
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-0.5">
            <Controller
              name="shop_category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-category"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Shop Category
                  </FieldLabel>

                  <div className="relative">
                    <select
                      {...field}
                      id="signup-category"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                      className="w-full h-12 rounded-xl bg-white border border-gray-200 px-3 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-400"
                      style={{ color: field.value ? "#1A3340" : "#9ca3af" }}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3 5l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-name"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Enter your Name
                  </FieldLabel>

                  <Input
                    {...field}
                    id="signup-name"
                    placeholder="Mohammad AnaYet"
                    aria-invalid={fieldState.invalid}
                    className="bg-white border-gray-200 rounded-xl h-12"
                    disabled={isPending}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-email"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    placeholder="username@gmail.com"
                    aria-invalid={fieldState.invalid}
                    className="bg-white border-gray-200 rounded-xl h-12"
                    disabled={isPending}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-phone"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Phone Number
                  </FieldLabel>

                  <Input
                    {...field}
                    id="signup-phone"
                    type="tel"
                    placeholder="+(1234) 456789"
                    aria-invalid={fieldState.invalid}
                    className="bg-white border-gray-200 rounded-xl h-12"
                    disabled={isPending}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-password"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white border-gray-200 rounded-xl h-12 pr-10"
                      disabled={isPending}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isPending}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-confirm-password"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Confirm Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white border-gray-200 rounded-xl h-12 pr-10"
                      disabled={isPending}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      disabled={isPending}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 px-6 sm:px-8 pb-8 pt-2">
        <Button
          type="submit"
          form="signup-form"
          disabled={isPending}
          className="w-full h-12 rounded-xl text-base font-semibold"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </span>
          ) : (
            "Sign up"
          )}
        </Button>

        <p className="text-sm text-center" style={{ color: "#51564E" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "#3A7326" }}
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}