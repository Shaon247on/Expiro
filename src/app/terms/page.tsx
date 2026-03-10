"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string[];
}

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Expiro platform ('Service'), you agree to be bound by these Terms and Conditions ('Terms'). If you do not agree to these Terms, you may not use the Service.",
      "These Terms apply to all users of the Service, including administrators, staff members, and any other individuals who access the Service under your account.",
      "We reserve the right to modify these Terms at any time. We will notify you of material changes at least 30 days in advance. Continued use of the Service after any changes constitutes your acceptance.",
    ],
  },
  {
    id: "account",
    title: "2. Account Registration",
    content: [
      "You must provide accurate, current, and complete information during registration and keep this information up to date.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You must immediately notify Expiro of any unauthorised use of your account at support@expiro.food.",
      "One organisation may maintain only one account unless a Multi-Store Enterprise agreement is in place.",
      "Accounts may not be transferred or sold to another party without prior written consent from Expiro.",
    ],
  },
  {
    id: "service",
    title: "3. Use of the Service",
    content: [
      "You may use the Service only for lawful purposes and in accordance with these Terms.",
      "You agree not to use the Service to upload, transmit, or distribute any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable.",
      "You may not attempt to gain unauthorised access to any portion or feature of the Service, or any other systems or networks connected to the Service.",
      "You may not use automated tools (bots, scrapers, crawlers) to access the Service without our prior written consent.",
      "Expiro reserves the right to suspend or terminate accounts that violate these Terms without notice.",
    ],
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions & Billing",
    content: [
      "Paid plans are billed monthly or annually in advance. Prices are displayed in EUR and are exclusive of applicable VAT.",
      "You authorise Expiro to charge your payment method on a recurring basis. If payment fails, we will notify you and provide a 7-day grace period before service suspension.",
      "Annual subscriptions are non-refundable except where required by applicable law. Monthly subscriptions may be cancelled at any time; cancellation takes effect at the end of the current billing period.",
      "Expiro reserves the right to change pricing with 30 days' notice. Price changes do not affect the current active billing cycle.",
      "Free trial accounts are limited to 7 days. At the end of the trial, you must select a paid plan or your account will be downgraded to read-only.",
    ],
  },
  {
    id: "data",
    title: "5. Your Data",
    content: [
      "You retain full ownership of all product data, inventory records, and business information you input into Expiro ('Customer Data').",
      "You grant Expiro a limited licence to store, process, and display Customer Data solely to provide the Service.",
      "Expiro will not access your Customer Data except to provide the Service, troubleshoot issues at your request, or as required by law.",
      "Upon account closure, you may export your Customer Data within 90 days. After this period, all Customer Data will be permanently deleted.",
      "You represent and warrant that you have the right to submit all data you provide to Expiro and that doing so does not violate any third-party rights.",
    ],
  },
  {
    id: "ip",
    title: "6. Intellectual Property",
    content: [
      "The Service, including all software, algorithms, designs, logos, and documentation, is owned by Expiro SAS and is protected by intellectual property laws.",
      "Your subscription grants you a limited, non-exclusive, non-transferable licence to access and use the Service for your internal business operations.",
      "You may not copy, modify, distribute, sell, sublicence, or reverse engineer any part of the Service.",
      "Any feedback, suggestions, or ideas you provide regarding the Service may be used by Expiro without restriction or compensation.",
    ],
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: [
      "The Service is provided 'as is' and 'as available'. Expiro makes no warranties, express or implied, regarding the reliability, accuracy, or fitness for a particular purpose of the Service.",
      "To the maximum extent permitted by applicable law, Expiro's aggregate liability for any claims arising out of or related to these Terms shall not exceed the amount you paid for the Service in the 12 months preceding the claim.",
      "Expiro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.",
      "Nothing in these Terms limits Expiro's liability for death or personal injury caused by our negligence, or for fraud or fraudulent misrepresentation.",
    ],
  },
  {
    id: "termination",
    title: "8. Termination",
    content: [
      "You may cancel your subscription at any time via the account settings page or by contacting support@expiro.food.",
      "Expiro may suspend or terminate your access to the Service immediately if you breach these Terms or if we are required to do so by law.",
      "Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (including data retention, intellectual property, and limitation of liability) will survive.",
    ],
  },
  {
    id: "governing",
    title: "9. Governing Law",
    content: [
      "These Terms are governed by the laws of France. Any dispute arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Paris, France.",
      "If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.",
      "These Terms constitute the entire agreement between you and Expiro regarding the Service and supersede all prior agreements.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact",
    content: [
      "For questions about these Terms, please contact us at legal@expiro.food.",
      "Expiro SAS, 123 Rue de la DLC, 75001 Paris, France. Registered in France: SIRET 123 456 789 00010.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TermsPage() {
  const [active, setActive] = useState("acceptance");
  const heroRef = useRef(null);
  const heroIn  = useInView(heroRef, { once: true });

  // ── Accurate scroll-spy using IntersectionObserver ──────────────────────────
  // rootMargin top = -112px (navbar height), bottom = -60% so only the section
  // in the upper portion of the visible area is considered active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
    <div className="min-h-screen" style={{ backgroundColor: "#F8FDF6" }}>

      {/* ── Hero — mt-28 clears the fixed navbar ── */}
      <section
        className="mt-28 pb-10 px-4"
        ref={heroRef}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(166,220,148,0.15)" }}
            >
              <FileText size={26} style={{ color: "#A6DC94" }} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#A6DC94" }}>
                Legal
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#1A3340" }}>
                Terms & Conditions
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm"
            style={{ color: "#9CA3AF" }}
          >
            Last updated: 10 March 2026 &nbsp;·&nbsp; Effective: 10 March 2026
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroIn ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-base max-w-2xl leading-relaxed"
            style={{ color: "#51564E" }}
          >
            Please read these Terms and Conditions carefully before using Expiro.
            By accessing the platform, you agree to be legally bound by these Terms.
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