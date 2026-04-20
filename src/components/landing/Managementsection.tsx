"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const tiles = [
  {
    label: "2026 Launch Year",
    badge: "NEW",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="20" height="18" rx="2" stroke="white" strokeWidth="1.6" fill="none"/>
        <path d="M4 11h20" stroke="white" strokeWidth="1.6"/>
        <path d="M9 4v4M19 4v4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M9 16h4M9 20h6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "EU-Wide Coverage",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="white" strokeWidth="1.6" fill="none"/>
        <path d="M14 4c0 0-5 4-5 10s5 10 5 10M14 4c0 0 5 4 5 10s-5 10-5 10" stroke="white" strokeWidth="1.4"/>
        <path d="M4 14h20M5 9h18M5 19h18" stroke="white" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    label: "Team Access",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="3.5" stroke="white" strokeWidth="1.6" fill="none"/>
        <circle cx="18" cy="10" r="3.5" stroke="white" strokeWidth="1.6" fill="none"/>
        <path d="M4 22c0-3.314 2.686-6 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M14 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "24/7 Support",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="white" strokeWidth="1.6" fill="none"/>
        <path d="M14 8v6.5l3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Alerts Systems",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4C9.582 4 6 7.582 6 12v7l-2 2h20l-2-2v-7c0-4.418-3.582-8-8-8z" stroke="white" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
        <path d="M11 21c0 1.657 1.343 3 3 3s3-1.343 3-3" stroke="white" strokeWidth="1.6"/>
      </svg>
    ),
  },
];

const trustBullets = ["No credit card required", "7-day free trial", "Cancel anytime"];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ManagementSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full bg-[#3A73261A] py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5"
        >
          <span style={{ color: "#3A7326" }}>The Future of Food Management</span>
          <br />
          <span style={{ color: "#3A7326" }}>Ready</span>{" "}
          <span className="text-black">to Reduce </span>
          <span style={{ color: "#3A7326" }}>Food</span>{" "}
          <span className="text-black">Waste?</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
          className="text-base md:text-lg mb-8 max-w-xl"
          style={{ color: "#51564E" }}
        >
          Join hundreds of supermarkets already saving time and money with Expiro Technology.
        </motion.p>

        {/* Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full mb-10">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 3}
              className="relative flex flex-col items-center justify-center rounded-2xl py-6 px-4 aspect-square"
              style={{
                backgroundColor: "#3A7326",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {tile.badge && (
                <span
                  className="absolute top-3 left-3 text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "#D4EAC8", color: "#3A7326" }}
                >
                  {tile.badge}
                </span>
              )}
              <div className="mb-3">{tile.icon}</div>
              <span className="text-white text-xs font-semibold text-center leading-snug">
                {tile.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Trust bullets */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={8}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {trustBullets.map((text) => (
            <div key={text} className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#3A7326" }}
              >
                <Check size={11} color="white" strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-sm" style={{ color: "#51564E" }}>
                {text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}