"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "What is Expiro Food and who is it for?",
    answer:
      "Expiro Food is a digital expiry date (DLC) and stock traceability platform designed for supermarkets, restaurants, fresh food shops, and other businesses selling perishable products. Whether you manage a single store or a multi-location chain, Expiro gives your team real-time visibility over every product's shelf life.",
  },
  {
    id: 2,
    question: "How does the expiry (DLC) alert system work?",
    answer:
      "Our system continuously monitors the expiry dates you enter at product registration. As a product approaches its DLC, Expiro sends automated alerts — via dashboard notifications, email, or push — based on configurable thresholds (e.g. 7 days, 3 days, 1 day). Alerts are colour-coded by urgency so your team always knows what needs attention first.",
  },
  {
    id: 3,
    question: "What happens when a product is opened?",
    answer:
      "Once a product is marked as opened, Expiro switches from the original DLC to a separate open-expiry countdown. You define the open-life in days per category (e.g. 3 days for fresh dairy, 2 days for cut fruit). The product card immediately reflects the new timeline and triggers a fresh set of alerts.",
  },
  {
    id: 4,
    question: "Can the system notify us when stock is low?",
    answer:
      "Yes. In addition to expiry tracking, Expiro monitors item quantity against thresholds you set per product or category. When stock drops below the minimum, a low-stock alert appears on the dashboard and is included in your daily summary email — so you can reorder before gaps appear.",
  },
  {
    id: 5,
    question: "Is Expiro Food suitable for inspections?",
    answer:
      "Absolutely. Expiro maintains a full, timestamped audit trail covering product entries, status changes, removals, and user actions. Every record is exportable to PDF or CSV in seconds, giving hygiene inspectors and quality auditors the documented traceability they require — reducing inspection stress to virtually zero.",
  },
  {
    id: 6,
    question: "Why should we use Expiro Technology?",
    answer:
      "Expiro was built specifically for food operations, not adapted from generic inventory software. That means faster onboarding, workflows that match how food teams actually operate, and a support team that understands perishable stock management. Businesses using Expiro report up to 30% less food waste and an 8% increase in profitability within the first quarter.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      className="min-h-screen py-24 px-4"
      aria-label="Frequently asked questions"
    >
      <div className="max-w-3xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold  leading-tight">
            Frequently Asked
            <br />
            <span style={{ color: "#A6DC94" }}>Questions</span>
          </h1>
          <p className="mt-4 text-base" style={{ color: "#6B7280" }}>
            Everything you need to know about Expiro Food.
          </p>
        </motion.div>

        {/* Accordion items */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <div
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: "#F5F0EB",
                    border: isOpen
                      ? "1.5px solid #3A7326"
                      : "1.5px solid transparent",
                    transition: "border-color 0.25s",
                  }}
                  onClick={() => toggle(item.id)}
                >
                  {/* Question row */}
                  <div className="flex items-center justify-between gap-4 px-6 py-5">
                    <h2
                      className="text-base sm:text-lg font-bold leading-snug"
                      style={{ color: "#111111" }}
                    >
                      {item.question}
                    </h2>
                    <motion.div
                      animate={{ rotate: isOpen ? 0 : 0 }}
                      className="flex-shrink-0"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors"
                        style={{
                          borderColor: isOpen ? "#3A7326" : "#999",
                          backgroundColor: isOpen ? "#EEF3EA" : "transparent",
                        }}
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        {isOpen ? (
                          <ArrowUp size={16} style={{ color: "#3A7326" }} />
                        ) : (
                          <ArrowDown size={16} style={{ color: "#666" }} />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          className="px-6 pb-6 text-sm sm:text-base leading-relaxed"
                          style={{ color: "#4B5563" }}
                        >
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-14"
        >
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Still have questions?{" "}
            <a
              href="/contact"
              className="font-semibold underline underline-offset-2 transition-colors hover:opacity-80"
              style={{ color: "#A6DC94" }}
            >
              Contact our team →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}