"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const cards = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="6" y="3" width="16" height="20" rx="2" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <path d="M10 8h8M10 12h8M10 16h5" stroke="#3A7326" strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="14" y="16" width="10" height="10" rx="1.5" fill="#A6DC94" stroke="#3A7326" strokeWidth="1.4"/>
        <path d="M17 21h4M17 23.5h2.5" stroke="#3A7326" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Manual Paper Tracking",
    description: "Handwritten logs are error-prone, slow, and impossible to scale across locations.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M16 6v14M16 20l-5-5M16 20l5-5" stroke="#3A7326" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 24h20" stroke="#3A7326" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "CSV/Excel Import",
    description: "Bulk upload supplier data and integrate existing inventory systems.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="15" r="10" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <path d="M16 10v6l3 3" stroke="#3A7326" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="23" cy="23" r="5" fill="#ef4444"/>
        <path d="M23 20.5v3M23 24.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Missed Expiry Dates",
    description: "Products expire unnoticed on shelves, leading to waste and potential health risks.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="10" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <path d="M16 9v7.5" stroke="#3A7326" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="20" r="1.2" fill="#3A7326"/>
        <path d="M12 6.5l1.5 2M20 6.5l-1.5 2" stroke="#3A7326" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "Last-Minute Discount Losses",
    description: "Late detection of near-expiry stock forces steep markdowns that erode margins.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="5" y="18" width="6" height="8" rx="1" stroke="#3A7326" strokeWidth="1.6" fill="none"/>
        <rect x="13" y="12" width="6" height="14" rx="1" stroke="#3A7326" strokeWidth="1.6" fill="none"/>
        <rect x="21" y="7" width="6" height="19" rx="1" stroke="#3A7326" strokeWidth="1.6" fill="none"/>
        <path d="M6 17l7-7 6 4 7-9" stroke="#e11d48" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Stock Mismanagement",
    description: "Guesswork-based ordering leads to overstocking, under-stocking, and wasted budget.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="11" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <path d="M11 11l10 10M21 11l-10 10" stroke="#e11d48" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Failed Hygiene Inspections",
    description: "Lack of digital traceability records makes passing audits stressful and uncertain.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TheProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0}
            className="text-sm font-medium mb-4"
            style={{ color: "#3A7326" }}
          >
            The Problem
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight mb-5"
          >
            Food businesses are{" "}
            <span style={{ color: "#3A7326" }}>losing</span>
            <br />
            <span style={{ color: "#3A7326" }}>money</span> every day
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={2}
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "#51564E" }}
          >
            Without digital traceability, waste, failed audits, and revenue loss are inevitable.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 3}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#E8F5E2" }}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-black mb-3">{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#51564E" }}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}