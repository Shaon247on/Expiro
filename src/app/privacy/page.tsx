"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string[];
}

const SECTIONS: Section[] = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly when you create an account, including your name, email address, business name, phone number, and billing information.",
      "We automatically collect certain technical data when you use Expiro, including IP address, browser type, operating system, pages visited, and device identifiers.",
      "Product and inventory data you enter into Expiro — including product names, barcodes, expiry dates, quantities, and store locations — is stored securely on our servers.",
      "We may collect usage analytics to understand how features are used and to improve the platform. This data is aggregated and does not personally identify you.",
    ],
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    content: [
      "To provide, maintain, and improve the Expiro platform and its features.",
      "To process transactions and send related information, including purchase confirmations and invoices.",
      "To send operational communications such as expiry alerts, stock notifications, and daily summaries, based on your notification preferences.",
      "To respond to comments, questions, and requests and provide customer support.",
      "To monitor and analyse trends, usage, and activities in connection with our services.",
      "To comply with legal obligations and enforce our Terms of Service.",
    ],
  },
  {
    id: "sharing",
    title: "3. Sharing of Information",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share your information with third-party service providers who perform services on our behalf, such as payment processing (Stripe), cloud hosting (AWS), and customer support tooling. These providers are contractually bound to protect your data.",
      "We may disclose information if we believe disclosure is in accordance with, or required by, applicable law or legal process.",
      "In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity.",
    ],
  },
  {
    id: "storage",
    title: "4. Data Storage & Security",
    content: [
      "All data is stored on servers located within the European Union (EU) in compliance with GDPR requirements.",
      "We use industry-standard encryption (TLS 1.3) for all data in transit. Data at rest is encrypted using AES-256.",
      "Access to production systems is restricted to authorised Expiro personnel using multi-factor authentication.",
      "We conduct regular security audits and penetration tests. Any security vulnerabilities are remediated promptly.",
      "Despite our measures, no security system is impenetrable. We will notify affected users of any data breach within 72 hours in compliance with GDPR Article 33.",
    ],
  },
  {
    id: "rights",
    title: "5. Your Rights (GDPR)",
    content: [
      "Right of Access: You may request a copy of all personal data we hold about you.",
      "Right to Rectification: You may request correction of any inaccurate data we hold.",
      "Right to Erasure ('Right to be Forgotten'): You may request deletion of your personal data. Note that certain data may be retained for legal compliance purposes.",
      "Right to Data Portability: You may request your data in a structured, machine-readable format.",
      "Right to Object: You may object to certain types of data processing, including direct marketing.",
      "To exercise any of these rights, contact us at privacy@expiro.food. We will respond within 30 days.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies",
    content: [
      "We use essential cookies to maintain your login session and remember your preferences.",
      "We use analytics cookies to understand how users interact with the platform. You may opt out of analytics cookies at any time via your account settings.",
      "We do not use advertising cookies or share cookie data with advertising networks.",
      "You may configure your browser to refuse cookies; however, some features of Expiro may not function correctly without them.",
    ],
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: [
      "Account data is retained for the duration of your subscription plus 90 days after account closure to enable recovery.",
      "Audit logs and traceability records are retained for 5 years to comply with food safety regulations.",
      "Billing information is retained for 7 years to comply with French and EU tax law.",
      "After the applicable retention period, data is permanently deleted from all systems.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will notify you of any material changes by email or via an in-app notification at least 30 days before the changes take effect.",
      "Your continued use of Expiro after the effective date of a revised policy constitutes your acceptance of the updated terms.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact",
    content: [
      "If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at: privacy@expiro.food",
      "Expiro SAS, 123 Rue de la DLC, 75001 Paris, France.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PrivacyPage() {
  const [active, setActive] = useState("collection");
  const heroRef = useRef(null);
  const heroIn  = useInView(heroRef, { once: true });

  // ── Accurate scroll-spy using IntersectionObserver ──────────────────────────
  // rootMargin: top=-112px (navbar) to -60% bottom so a section only becomes
  // "active" when its heading is in the upper portion of the visible area.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-112px 0px -60% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero — mt-28 clears the fixed navbar ── */}
      <section className="mt-28 pb-10 px-4" ref={heroRef}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase">Legal</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Privacy Policy</h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm"
          >
            Last updated: 10 March 2026 &nbsp;·&nbsp; Effective: 10 March 2026
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-base max-w-2xl leading-relaxed"
          >
            At Expiro, we take the privacy of your data seriously. This policy
            explains what data we collect, how we use it, and the rights you have
            over your information under GDPR.
          </motion.p>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Sticky sidebar — top-28 keeps it below the navbar */}
          <aside className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-28">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#3A7326" }}
              >
                Contents
              </p>
              <nav className="flex flex-col gap-1" aria-label="Page sections">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActive(s.id);
                      document.getElementById(s.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: active === s.id ? "#EEF3EA" : "transparent",
                      color:           active === s.id ? "#3A7326"  : "#51564E",
                    }}
                  >
                    {active === s.id && <ChevronRight size={12} />}
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content — scroll-mt-28 offsets each section anchor by navbar height */}
          <div className="flex-1 min-w-0 flex flex-col gap-10">
            {SECTIONS.map((section, si) => (
              <motion.div
                key={section.id}
                id={section.id}
                custom={si}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="scroll-mt-28"
              >
                <h2
                  className="text-lg font-extrabold mb-4"
                  style={{ color: "#1A3340" }}
                >
                  {section.title}
                </h2>
                <div
                  className="rounded-2xl p-6 flex flex-col gap-3"
                  style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
                >
                  {section.content.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed"
                      style={{ color: "#374151" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}