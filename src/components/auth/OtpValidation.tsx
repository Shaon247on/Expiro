"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { OtpInput } from "@/components/auth/OtpInput";
import ExpiroLogo from "@/components/elements/Logo";
import { verifyOtpAction } from "@/actions/auth/signup.action";
import {
  resendOtpAction,
  verifyForgotOtpAction,
} from "@/actions/auth/forgetPassword.action";

const schema = z.object({
  otp: z
    .string()
    .length(6, "Please enter all 6 digits.")
    .regex(/^\d{6}$/, "OTP must be 6 digits."),
});

type FormValues = z.infer<typeof schema>;

const RESEND_COOLDOWN = 30;

export default function OtpVerificationPage({
    email, mode
}: {email: string; mode: string}) {
  const router = useRouter();
  const searchParams = useSearchParams();
//   const email = searchParams.get("email") ?? "";
  const rawMode = searchParams.get("mode");
//   const mode = rawMode?.trim().toLowerCase() ?? "signup";  
  const isForgotPasswordMode = mode === "forgot-password";

  console.log("isForgotPasswordMode", isForgotPasswordMode);
  const [otp, setOtp] = React.useState("");
  const [countdown, setCountdown] = React.useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  function startCountdown() {
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  React.useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleOtpChange(val: string) {
    setOtp(val);
    setValue("otp", val, { shouldValidate: false });
    if (val.length === 6) clearErrors("otp");
  }

  function handleResend() {
    if (!canResend || !email) return;

    startTransition(async () => {
      const result = await resendOtpAction({ email });

      if (!result.success) {
        toast.error("Resend failed", {
          description: result.message,
        });
        return;
      }

      setOtp("");
      setValue("otp", "");
      clearErrors("otp");
      startCountdown();

      toast.success("OTP resent", {
        description: result.message,
      });
    });
  }

  function onSubmit(data: FormValues) {
    if (!email) {
      toast.error("Missing email", {
        description: isForgotPasswordMode
          ? "Please request forgot password again."
          : "Please sign up again before verifying OTP.",
      });

      router.push(isForgotPasswordMode ? "/forgot-password" : "/signup");
      return;
    }

    startTransition(async () => {
      console.log("OTP mode:", mode);
      console.log("isForgotPasswordMode:", isForgotPasswordMode);

      const result = isForgotPasswordMode
        ? await verifyForgotOtpAction({
            email,
            otp: data.otp,
          })
        : await verifyOtpAction({
            email,
            otp: data.otp,
          });

      console.log("checking the api:", result);

      if (!result.success) {
        if (result.fieldErrors?.otp?.[0]) {
          setError("otp", {
            type: "server",
            message: result.fieldErrors.otp[0],
          });
        }

        toast.error("OTP verification failed", {
          description: result.message,
        });
        return;
      }

      toast.success("OTP verified", {
        description: result.message,
      });

      if (isForgotPasswordMode) {
        router.push("/new-password");
      }
    });
  }

  const hasError = !!errors.otp;

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
          Verify your Email
        </CardTitle>

        <CardDescription className="w-full" style={{ color: "#51564E" }}>
          We sent a 6-digit code to {email || "your email"}. Enter it below to
          continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-6">
        <form id="otp-form" onSubmit={handleSubmit(onSubmit)}>
          <Field data-invalid={hasError}>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              length={6}
              hasError={hasError}
            />
            {hasError && (
              <div className="flex justify-center mt-2">
                <FieldError errors={[errors.otp]} />
              </div>
            )}
          </Field>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-sm" style={{ color: "#51564E" }}>
            Didn&apos;t receive the code?
          </span>

          <Button
            type="button"
            variant="secondary"
            className="h-8 px-3 text-sm rounded-lg"
            onClick={handleResend}
            disabled={!canResend || isPending}
            aria-label={
              canResend
                ? "Resend OTP code"
                : `Resend available in ${countdown}s`
            }
          >
            {canResend ? "Resend Code" : `Resend in ${countdown}s`}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 sm:px-8 pb-8 pt-2">
        <Button
          type="submit"
          form="otp-form"
          disabled={isPending}
          className="w-full h-12 rounded-xl text-base font-semibold"
          style={{ backgroundColor: "#3A7326", color: "white" }}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full h-12 rounded-xl text-base"
          onClick={() => router.push("/login")}
          disabled={isPending}
        >
          <ArrowLeft size={16} className="mr-2" aria-hidden="true" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
