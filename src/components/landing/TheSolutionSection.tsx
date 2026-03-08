"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#3A7326" strokeWidth="1.6"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#3A7326" strokeWidth="1.6"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#3A7326" strokeWidth="1.6"/>
        <path d="M14 17.5h7M17.5 14v7" stroke="#3A7326" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: "Smart DLC Traceability",
    description: "Track every product's expiry date digitally. Get alerts 1–2 weeks before products expire so you can act in time.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 17l5-5 4 3 5-6 4 4" stroke="#3A7326" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 7v4h-4" stroke="#3A7326" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Real-time Stock Monitoring",
    description: "See stock levels update instantly as products are scanned, opened, or removed from shelves.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="5" width="3" height="14" rx="0.5" fill="#3A7326"/>
        <rect x="7.5" y="5" width="1.5" height="14" rx="0.5" fill="#3A7326"/>
        <rect x="10.5" y="5" width="3" height="14" rx="0.5" fill="#3A7326"/>
        <rect x="15" y="5" width="1.5" height="14" rx="0.5" fill="#3A7326"/>
        <rect x="18" y="5" width="3" height="14" rx="0.5" fill="#3A7326"/>
      </svg>
    ),
    title: "Barcode-based Tracking",
    description: "Scan any barcode or QR code to log, identify, and manage products in seconds — no manual entry needed.",
  },
];

const productItems = [
  {
    name: "Organic Milk 1L",
    sub: "3 days left",
    status: "Expiring Soon",
    statusColor: "text-orange-500",
    dot: "bg-orange-500",
    icon: "⚠️",
  },
  {
    name: "Fresh Salmon Fillet",
    sub: "12 days left",
    status: "On Track",
    statusColor: "text-green-600",
    dot: "bg-green-500",
    icon: "✅",
  },
  {
    name: "Organic Milk 1L",
    sub: "Expired Date: 60 Days",
    status: "Open",
    statusColor: "text-orange-400",
    dot: "bg-orange-400",
    icon: "🟠",
  },
  {
    name: "Chocolate Milk 1L",
    sub: "Expired Date",
    status: "Remove",
    statusColor: "text-red-500",
    dot: "bg-red-500",
    icon: "🗑️",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TheSolutionSection() {
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
            className="text-sm font-medium mb-3"
            style={{ color: "#3A7326" }}
          >
            The Solution
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight mb-5"
          >
            Expiro Technology
            <br />
            <span style={{ color: "#3A7326" }}>Digital Traceability Partner</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={2}
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "#51564E" }}
          >
            A single platform that replaces paper logs, spreadsheets, and guesswork with smart automation built for European food regulations.
          </motion.p>
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Features */}
          <div className="flex flex-col gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i + 3}
                className="flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#D4EAC8" }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-1">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#51564E" }}>
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Dashboard mockup */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={3}
            className="relative rounded-2xl p-5 md:p-7"
            style={{ backgroundColor: "#D6E2D1" }}
          >
            {/* Floating notification */}
            <div className="absolute -top-10 right-4 bg-[#D6E2D1] rounded-xl shadow-lg px-4 py-3 z-10 flex items-start gap-3 min-w-52.5">
              <div className="relative mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-label="Bell notification">
                  <path d="M12 3C8.686 3 6 5.686 6 9v5l-2 2h16l-2-2V9c0-3.314-2.686-6-6-6z" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
                  <path d="M10 19c0 1.105.895 2 2 2s2-.895 2-2" stroke="#3A7326" strokeWidth="1.6"/>
                  <circle cx="16.5" cy="5.5" r="4" fill="#3A7326"/>
                  <text x="16.5" y="8.5" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">21</text>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-black">DLC Alert</p>
                <p className="text-xs text-gray-600">5 items expire in 2 days</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#3A7326" }}>
                  Take Action →
                </p>
              </div>
            </div>

            {/* Product cards */}
            <div className="flex flex-col gap-3 mt-8">
              {productItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  custom={i + 5}
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
                  style={{ border: "1px solid rgba(58, 115, 38, 0.2)" }}
                >
                  <div>
                    <p className="text-sm font-semibold text-black">{item.name}</p>
                    <p className="text-xs" style={{ color: "#51564E" }}>{item.sub}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${item.statusColor}`}>
                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    {item.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}