"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const schema = z.object({
  name:    z.string().min(2, "Please enter your name."),
  email:   z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
type FormValues = z.infer<typeof schema>;

const inputCls =
  "w-full bg-transparent border border-[#3A7326] rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#A6DC94] focus:ring-1 focus:ring-[#A6DC94] transition-all";

const contactInfo = [
  { icon: MapPin, label: "123 Expiro Street, Paris, France 75001" },
  { icon: Phone, label: "+33 1 23 45 67 89" },
  { icon: Mail, label: "support@expiro.food" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ContactPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormValues) {
    toast.success("Message sent! We'll get back to you soon.", { position: "bottom-right" });
    reset();
  }

  return (
    <section
      className="min-h-screen py-28 px-4"
      aria-label="Contact us"
    >
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ color: "#3A7326" }}
          >
            Get in touch
          </h1>
          <p className="mt-3 text-base" style={{ color: "#6B7280" }}>
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start justify-between">
          {/* ── LEFT: Form ── */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Name */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
                <input
                  {...register("name")}
                  placeholder="Your Name"
                  aria-label="Your name"
                  className={inputCls}
                />
                {errors.name && (
                  <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>{errors.name.message}</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Your Email"
                  aria-label="Your email"
                  className={inputCls}
                />
                {errors.email && (
                  <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>{errors.email.message}</p>
                )}
              </motion.div>

              {/* Message */}
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Your Message"
                  aria-label="Your message"
                  className={`${inputCls} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>{errors.message.message}</p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
                <Button
                size={"lg"}
                  type="submit"
                  className="w-full"
                >
                  <Send size={17} />
                  Submit
                </Button>
              </motion.div>
            </form>
          </div>

          {/* ── RIGHT: Illustration + contact info ── */}
          <div className="flex flex-col gap-10 items-center">
            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl overflow-hidden flex items-center justify-center"
            >
              {/* SVG customer support illustration */}
              <Image
              src={"/images/contact.png"}
              alt="Contact us Image"
              width={510}
              height={340}
              className="object-center object-cover"
              />
            </motion.div>

            {/* Contact info */}
            <div className="flex flex-col gap-5">
              {contactInfo.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  custom={i + 4}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <Icon size={18} style={{ color: "#3A7326" }} />
                  </div>
                  <span className="text-sm" >
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}