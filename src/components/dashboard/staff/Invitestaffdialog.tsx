"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Plus, X, Eye, EyeOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters."),
  email:    z.string().email("Please enter a valid email."),
  phone:    z.string().min(6, "Please enter a valid phone number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-sm font-semibold mb-1.5";
const labelStyle = { color: "#1F485B" };

export default function InviteStaffDialog() {
  const [open, setOpen]       = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const form = useForm<FormValues>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    toast.success(`Invitation sent to ${data.email}`, { position: "bottom-right" });
    form.reset();
    setOpen(false);
  }

  function handleClose() {
    form.reset();
    setShowPw(false);
    setOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: "#3A7326", color: "white" }}
      >
        <Plus size={16} aria-hidden="true" />
        Invite Staff
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="p-0 overflow-hidden border-0 shadow-2xl w-full"
          style={{ borderRadius: 16, maxWidth: "min(580px, 95vw)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-base font-bold" style={{ color: "#1A3340" }}>
              Add Member
            </DialogTitle>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#1F485B" }}>
                Invite
              </h2>
              <p className="text-sm text-gray-500">
                Please enter your email and password to invite to your account.
              </p>
            </div>

            <form id="invite-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="gap-4">
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="inv-name" className={labelCls} style={labelStyle}>
                        Enter your Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="inv-name"
                        placeholder="Mohammad AnaYet"
                        aria-invalid={fieldState.invalid}
                        className={inputCls}
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
                      <FieldLabel htmlFor="inv-email" className={labelCls} style={labelStyle}>
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="inv-email"
                        type="email"
                        placeholder="username@gmail.com"
                        aria-invalid={fieldState.invalid}
                        className={inputCls}
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
                      <FieldLabel htmlFor="inv-phone" className={labelCls} style={labelStyle}>
                        Phone Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id="inv-phone"
                        type="tel"
                        placeholder="+(1234) 456789"
                        aria-invalid={fieldState.invalid}
                        className={inputCls}
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
                      <FieldLabel htmlFor="inv-pw" className={labelCls} style={labelStyle}>
                        Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="inv-pw"
                          type={showPw ? "text" : "password"}
                          placeholder="Password"
                          aria-invalid={fieldState.invalid}
                          className={`${inputCls} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPw ? "Hide password" : "Show password"}
                        >
                          {showPw ? <Eye size={17} /> : <EyeOff size={17} />}
                        </button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            {/* Submit */}
            <Button
              type="submit"
              form="invite-form"
              className="w-full h-12 rounded-2xl text-base font-semibold mt-6"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              Invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}