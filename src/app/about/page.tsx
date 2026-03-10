"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, ShieldCheck, BarChart3, Users, Globe, Zap } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATS = [
  { value: "500+", label: "Food Businesses" },
  { value: "30%",  label: "Waste Reduction" },
  { value: "8%",   label: "Profit Increase" },
  { value: "100%", label: "Audit Ready" },
];

const VALUES = [
  { icon: Leaf,        title: "Sustainability First",   desc: "We believe reducing food waste is not just good business — it's a moral imperative. Every feature we build has waste reduction at its core." },
  { icon: ShieldCheck, title: "Compliance Built-In",    desc: "HACCP traceability, EU DLC regulations, and hygiene audit trails are baked into every plan — not sold as add-ons." },
  { icon: BarChart3,   title: "Data You Can Trust",     desc: "Real-time stock intelligence with timestamped logs gives your team and your auditors total confidence in your records." },
  { icon: Users,       title: "Built for Teams",        desc: "From solo shop owners to multi-location chains, Expiro adapts to how your team actually works — not the other way around." },
  { icon: Globe,       title: "Designed for Europe",    desc: "Expiro is built to the standards of European food safety regulations, with multi-language support and EU data residency." },
  { icon: Zap,         title: "Fast Onboarding",        desc: "Most businesses are fully operational within 24 hours. No complex setup, no expensive consultants, no weeks of training." },
];

const TEAM = [
  { initials: "MA", name: "Mohammad AnaYet", role: "Founder & CEO",        bg: "#3D4F61" },
  { initials: "SJ", name: "Sarah Johnson",   role: "Head of Product",      bg: "#5C4F3D" },
  { initials: "MB", name: "Mike Brown",      role: "Lead Engineer",        bg: "#3D4F4F" },
  { initials: "ED", name: "Emily Davis",     role: "Head of Compliance",   bg: "#3D3D5C" },
];

export default function AboutPage() {
  const heroRef   = useRef(null);
  const missionRef = useRef(null);
  const valuesRef  = useRef(null);
  const teamRef    = useRef(null);

  const heroIn    = useInView(heroRef,    { once: true });
  const missionIn = useInView(missionRef, { once: true, margin: "-80px" });
  const valuesIn  = useInView(valuesRef,  { once: true, margin: "-80px" });
  const teamIn    = useInView(teamRef,    { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative pt-28 pb-10 px-4 overflow-hidden"
        ref={heroRef}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: "#3A7326", filter: "blur(80px)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: "#A6DC94", filter: "blur(60px)", transform: "translate(-20%, 20%)" }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#A6DC94" }}
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold  leading-tight mb-6"
          >
            We&apos;re on a mission to
            <br />
            <span style={{ color: "#A6DC94" }}>end food waste</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Expiro was founded in 2022 by a team of food industry veterans who were
            frustrated by the spreadsheets, paper logs, and missed expiries costing
            their businesses thousands every month. We built the tool we always
            wished existed.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-4 px-4" ref={missionRef}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={missionIn ? "visible" : "hidden"}
                className="text-center py-6 px-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <p className="text-4xl font-extrabold mb-1" style={{ color: "#3A7326" }}>
                  {value}
                </p>
                <p className="text-xs font-medium" style={{ color: "#51564E" }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-8 sm:p-12"
            style={{ backgroundColor: "#EEF3EA", border: "1px solid #D4EAC8" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={missionIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#3A7326" }}>
                Why We Exist
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: "#1A3340" }}>
                Food waste costs the industry billions.
                <br />
                <span style={{ color: "#3A7326" }}>We&apos;re changing that.</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#51564E" }}>
                An estimated 1.3 billion tonnes of food is wasted globally every year.
                A significant portion of that happens at the retail and food service level —
                not because businesses don&apos;t care, but because they lack the tools to act
                in time. Expiro gives every food business, regardless of size, the same
                intelligent expiry management once reserved for enterprise-level operations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 px-4" ref={valuesRef}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#3A7326" }}>
              What Drives Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#1A3340" }}>
              Our values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={valuesIn ? "visible" : "hidden"}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#EEF3EA" }}
                >
                  <Icon size={20} style={{ color: "#3A7326" }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1A3340" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#51564E" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16 px-4" ref={teamRef}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#3A7326" }}>
              The People
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#1A3340" }}>
              Meet the team
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(({ initials, name, role, bg }, i) => (
              <motion.div
                key={name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={teamIn ? "visible" : "hidden"}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 border-2"
                  style={{ backgroundColor: bg, borderColor: "#D4EAC8" }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <p className="font-bold text-sm" style={{ color: "#1A3340" }}>{name}</p>
                <p className="text-xs mt-1" style={{ color: "#51564E" }}>{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "#1A3340" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to join us?
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            Start your free trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#3A7326" }}
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Talk to Sales
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}