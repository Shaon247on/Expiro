"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    id: "01",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4L24 32M24 32L14 22M24 32L34 22"
          stroke="#3A7326"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 36V40C8 41.1046 8.89543 42 10 42H38C39.1046 42 40 41.1046 40 40V36"
          stroke="#3A7326"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Import or Scan Products",
    description:
      "Add inventory via barcode scanning, CSV upload, or manual entry. Supplier data integrates automatically.",
  },
  {
    id: "02",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="6"
          y="6"
          width="10"
          height="10"
          rx="1"
          stroke="#3A7326"
          strokeWidth="2.5"
        />
        <rect
          x="32"
          y="6"
          width="10"
          height="10"
          rx="1"
          stroke="#3A7326"
          strokeWidth="2.5"
        />
        <rect
          x="6"
          y="32"
          width="10"
          height="10"
          rx="1"
          stroke="#3A7326"
          strokeWidth="2.5"
        />
        <circle cx="24" cy="24" r="6" stroke="#3A7326" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="2" fill="#3A7326" />
      </svg>
    ),
    title: "Automatically Track Expiry",
    description:
      "Expiro monitors all products in real-time, calculating risk levels and prioritizing attention.",
  },
  {
    id: "03",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 8C17.3726 8 12 13.3726 12 20V30L8 34H40L36 30V20C36 13.3726 30.6274 8 24 8Z"
          stroke="#3A7326"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 34C20 36.2091 21.7909 38 24 38C26.2091 38 28 36.2091 28 34"
          stroke="#3A7326"
          strokeWidth="2.5"
        />
        <circle cx="34" cy="10" r="5" fill="#3A7326" />
        <text
          x="34"
          y="14"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="bold"
        >
          !
        </text>
      </svg>
    ),
    title: "Receive Smart Alerts",
    description:
      "Get proactive notifications via dashboard, email, or mobile when products approach expiry thresholds.",
  },
  {
    id: "04",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="18" fill="#3A7326" />
        <path
          d="M15 24L21 30L33 18"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Stay Audit Ready",
    description:
      "Automated logging ensures accurate, compliant, and inspection-ready HACCP documentation.",
  },
];

const dashboardStats = [
  { label: "Products Tracked", value: "2,867" },
  { label: "Expiring Soon", value: "23" },
  { label: "Open Products", value: "69" },
  { label: "Waste Reduced", value: "34%" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: (i = 0) => ({
    scaleX: 1,
    transition: { duration: 0.5, delay: 0.3 + i * 0.12, ease: "easeOut" },
  }),
};

export default function ExpiroSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const bottomRef = useRef(null);
  const isBottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 px-4 font-sans overflow-hidden"
    >
      {/* ── TOP HEADER ── */}
      <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-5xl md:text-6xl font-extrabold font-dm"
        >
          How <span className="text-[#3A7326]">Expiro</span> Works
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
          className="mt-3 text-base md:text-lg leading-relaxed"
          style={{ color: "#51564E" }}
        >
          A systematic approach to expiry management and compliance control in
          four structured steps.
        </motion.p>
      </div>

      {/* ── STEPS GRID ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-20 md:mb-28">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center lg:text-left"
          >
            {/* Icon */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
              className="mb-4"
            >
              {step.icon}
            </motion.div>

            {/* Horizontal line */}
            <motion.div
              variants={lineGrow}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
              className="w-full h-px mb-5 origin-left"
              style={{ backgroundColor: "#3A7326", opacity: 0.35 }}
            />

            {/* Step label */}
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i + 0.5}
              className="text-xl font-bold tracking-wide mb-2"
              style={{ color: "#3A7326" }}
            >
              Step – {step.id}
            </motion.span>

            {/* Title */}
            <motion.h3
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i + 0.7}
              className="text-xl md:text-3xl md:min-h-20 max-w-56 font-semibold mb-3 leading-snug text-center"
              style={{ color: "#282B27" }}
            >
              {step.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i + 0.9}
              className="text-sm leading-relaxed text-"
              style={{ color: "#51564E" }}
            >
              {step.description}
            </motion.p>
          </div>
        ))}
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div ref={bottomRef} className="max-w-4xl mx-auto text-center mb-8">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isBottomInView ? "visible" : "hidden"}
          custom={0}
          className="text-5xl md:text-6xl font-extrabold font-dm mb-3"
        >
          How <span className="text-[#3A7326]">Expiro</span> Results
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isBottomInView ? "visible" : "hidden"}
          custom={1}
          className="text-base md:text-lg mb-7"
          style={{ color: "#51564E" }}
        >
          A systematic approach to expiry management and compliance control in
          four structured steps.
        </motion.p>

        {/* CTA Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isBottomInView ? "visible" : "hidden"}
          custom={2}
          className="inline-flex items-center gap-2 border rounded-full px-6 py-2 bg-[#E8EDDE] text-sm md:text-base"
        >
          <span>⏳</span>
          <span className="text-[#3A7326]">
            Complete setup in{" "}
            <strong className="font-bold ">under 24 hours</strong>
          </span>
        </motion.div>
      </div>

      {/* ── BROWSER MOCKUP ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={isBottomInView ? "visible" : "hidden"}
        custom={3}
        className="max-w-5xl mx-auto"
      >
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border"
          style={{ borderColor: "#e0e0e0" }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ backgroundColor: "#f5f5f5", borderColor: "#e0e0e0" }}
          >
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
            <span className="mx-auto text-xs" style={{ color: "#51564E" }}>
              expirotechnology.com
            </span>
          </div>

          {/* Dashboard body */}
          <div className="bg-white p-5 md:p-7">
            {/* Top bar skeleton */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold relative"
                    style={{ backgroundColor: "#3A7326" }}
                  >
                    🔔
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center"
                      style={{ backgroundColor: "#3A7326" }}
                    >
                      21
                    </span>
                  </div>
                </div>
                <div
                  className="h-2.5 w-36 rounded-full"
                  style={{ backgroundColor: "#e5e5e5" }}
                />
                <div
                  className="h-2 w-48 rounded-full"
                  style={{ backgroundColor: "#eeeeee" }}
                />
              </div>
              <div
                className="h-16 w-36 md:w-48 rounded-lg"
                style={{ backgroundColor: "#D8DDD2" }}
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {dashboardStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isBottomInView ? "visible" : "hidden"}
                  custom={4 + i * 0.2}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "#E7EBE0" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#51564E" }}>
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Skeleton rows */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg"
                  style={{ backgroundColor: "#D4EAC8", opacity: 0.6 }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 rounded-lg bg-[E7EBE0]"
                  style={{ backgroundColor: "#E7EBE0", opacity: 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
