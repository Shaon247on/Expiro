"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const roles = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="10" r="5" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <path d="M6 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#3A7326" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19 22l2 2 4-4" stroke="#3A7326" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Store Managers",
    description:
      "Responsible for daily operations, inventory control, and preventing stock losses while ensuring compliance and smooth store performance.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="4" y="14" width="24" height="14" rx="2" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <path d="M10 14v-3a6 6 0 0 1 12 0v3" stroke="#3A7326" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="16" cy="21" r="2" fill="#3A7326"/>
        <path d="M16 23v3" stroke="#3A7326" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: "Restaurant Owners",
    description:
      "Responsible for overall operations, food safety compliance, cost control, and ensuring high-quality service while minimizing waste and protecting profitability.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="5" stroke="#3A7326" strokeWidth="1.8" fill="none"/>
        <circle cx="16" cy="16" r="11" stroke="#3A7326" strokeWidth="1.8" fill="none" strokeDasharray="4 2"/>
        <circle cx="16" cy="5" r="1.5" fill="#3A7326"/>
        <circle cx="16" cy="27" r="1.5" fill="#3A7326"/>
        <circle cx="5" cy="16" r="1.5" fill="#3A7326"/>
        <circle cx="27" cy="16" r="1.5" fill="#3A7326"/>
      </svg>
    ),
    title: "Operations Managers",
    description:
      "Oversee multi-location operations, streamline processes, ensure compliance, and drive efficiency while reducing costs and operational risks.",
  },
];

const enterpriseItems = [
  ["HACCP compliance mandatory", "Multi-location inventory control"],
  ["Supplier data integration", "Audit trail documentation"],
  ["Financial impact tracking", "EU data protection standards"],
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ProfessionalSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight mb-5"
          >
            Built for Professional{" "}
            <span style={{ color: "#3A7326" }}>Food</span>
            <br />
            <span style={{ color: "#3A7326" }}>Operations</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={1}
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "#51564E" }}
          >
            Expiro serves enterprise food businesses that demand operational precision and regulatory compliance.
          </motion.p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-8 md:mb-10">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#E8F5E2" }}
              >
                {role.icon}
              </div>
              <h3 className="text-lg font-bold text-black mb-3">{role.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#51564E" }}>
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Requirements Panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={5}
          className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8"
          style={{ border: "1px solid rgba(58, 115, 38, 0.3)" }}
        >
          {/* Left */}
          <div className="md:w-1/3 flex-shrink-0">
            <h3 className="text-xl font-bold text-black mb-2">Enterprise Requirements</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#51564E" }}>
              Designed for businesses with serious operational and compliance obligations.
            </p>
          </div>

          {/* Right: two columns of bullets */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {enterpriseItems.flat().map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#3A7326" }}
                />
                <span className="text-sm" style={{ color: "#51564E" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}