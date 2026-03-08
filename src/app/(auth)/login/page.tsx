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
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: FormValues) {
    console.log("clicked");
    router.push("/dashboard")
    toast.success("Welcome Back", {
      description: "Login Successful...",
    });
  }

  return (
    <Card
      className="w-full rounded-3xl shadow-xl border-0"
      style={{ backgroundColor: "#EEF3EA" }}
    >
      <CardHeader className="items-center text-center pt-8 pb-2">
        {/* Logo */}
        <div className="flex justify-center">
          <ExpiroLogo />
        </div>
        <CardTitle className="text-2xl font-bold" style={{ color: "#1A3340" }}>
          Sign in to your Account
        </CardTitle>
        <CardDescription style={{ color: "#51564E" }}>
          Please enter your email and password to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-6">
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-email"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    placeholder="username@gmail.com"
                    aria-invalid={fieldState.invalid}
                    className="bg-white border-gray-200 rounded-xl h-12"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-password"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      aria-invalid={fieldState.invalid}
                      className="bg-white border-gray-200 rounded-xl h-12 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
          form="login-form"
          className="w-full h-12 rounded-xl text-base font-semibold"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          Sign in
        </Button>
        <p className="text-sm text-center" style={{ color: "#51564E" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold hover:underline"
            style={{ color: "#3A7326" }}
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
