"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";

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
  email: z.string().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: FormValues) {
    toast("Reset link sent!", {
      description: `We sent a password reset link to ${data.email}`,
      position: "bottom-right",
    });
    router.push("/otp-verification");
  }

  return (
    <Card
      className="w-full rounded-3xl shadow-xl border-0"
      style={{ backgroundColor: "#EEF3EA" }}
    >
      <CardHeader className="items-center text-center pt-8 pb-2">
        <div className="flex items-center justify-center lg:pl-8">
          <ExpiroLogo />
        </div>
        <CardTitle className="text-2xl font-bold" style={{ color: "#1A3340" }}>
          Forgot your Password?
        </CardTitle>
        <CardDescription className="w-full" style={{ color: "#51564E" }}>
          Enter your email address and we&apos;ll send you a one-time
          verification code.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-6">
        <form id="forgot-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="forgot-email"
                    className="font-semibold"
                    style={{ color: "#3A7326" }}
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="forgot-email"
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
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 sm:px-8 pb-8 pt-2">
        <Button
          type="submit"
          form="forgot-form"
          className="w-full h-12 rounded-xl text-base font-semibold"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          Send Verification Code
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
        <p className="text-sm text-center" style={{ color: "#51564E" }}>
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "#3A7326" }}
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
