"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Plus, X, Loader2 } from "lucide-react";

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
import { inviteStaffAction } from "@/actions/admin/staff.action";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phone: z
    .string()
    .trim()
    .regex(/^[\d+-]{8,15}$/, "Phone number must be 8 to 15 characters and can include digits, +, or -."),
});

type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full h-12 px-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all placeholder:text-gray-400";
const labelCls = "text-sm font-semibold mb-1.5";
const labelStyle = { color: "#1F485B" };

export default function InviteStaffDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await inviteStaffAction(data);

      if (!result.success) {
        if (result.fieldErrors?.name?.[0]) {
          form.setError("name", {
            type: "server",
            message: result.fieldErrors.name[0],
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

        toast.error("Invitation failed", {
          description: result.message,
        });
        return;
      }

      toast.success("Invitation sent", {
        description: result.message,
      });

      form.reset();
      setOpen(false);
    });
  }

  function handleClose(nextOpen = false) {
    form.reset();
    setOpen(nextOpen);
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-base font-bold" style={{ color: "#1A3340" }}>
              Add Member
            </DialogTitle>
          </div>

          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#1F485B" }}>
                Invite
              </h2>
              <p className="text-sm text-gray-500">
                Enter staff details to send an invitation.
              </p>
            </div>

            <form id="invite-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="gap-4">
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
                      <FieldLabel htmlFor="inv-phone" className={labelCls} style={labelStyle}>
                        Phone Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id="inv-phone"
                        type="tel"
                        placeholder="+8801700000000"
                        aria-invalid={fieldState.invalid}
                        className={inputCls}
                        disabled={isPending}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            <Button
              type="submit"
              form="invite-form"
              disabled={isPending}
              className="w-full h-12 rounded-2xl text-base font-semibold mt-6"
              style={{ backgroundColor: "#3A7326", color: "white" }}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Inviting...
                </span>
              ) : (
                "Invite"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}