"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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

const schema = z.object({
  shopCategory: z.string().min(1, "Please select a shop category."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof schema>;

const categories = [
  "Expiro Food",
  "Supermarket",
  "Restaurant",
  "Fresh Food Shop",
  "Catering",
  "Other",
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shopCategory: "",
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    toast("Account created!", {
      description: (
        <pre className="mt-2 rounded-md bg-muted p-3 text-xs overflow-x-auto">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
  }

  return (
    <Card
      className="w-full rounded-3xl shadow-xl border-0"
      style={{ backgroundColor: "#EEF3EA" }}
    >
      <CardHeader className="items-center text-center pt-8 pb-2">
        {/* Logo */}
        <div className="flex items-center justify-center">
            <ExpiroLogo/>
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
            {/* Shop Category */}
            <Controller
              name="shopCategory"
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
                      className="w-full h-12 rounded-xl bg-white border border-gray-200 px-3 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-400"
                      style={{ color: field.value ? "#1A3340" : "#9ca3af" }}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Name */}
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
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Email */}
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
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Phone */}
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
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password */}
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
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold hover:underline"
              style={{ color: "#3A7326" }}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 px-6 sm:px-8 pb-8 pt-2">
        <Button
          type="submit"
          form="signup-form"
          className="w-full h-12 rounded-xl text-base font-semibold"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          Sign up
        </Button>
        <p className="text-sm text-center" style={{ color: "#51564E" }}>
          Don&apos;t have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#3A7326" }}>
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}