"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

interface MetricConfig {
  prefix: string;
  target: number;
  suffix: string;
  label: string;
  format?: (n: number) => string;
}

const metrics: MetricConfig[] = [
  {
    prefix: "Up to ",
    target: 8,
    suffix: "%",
    label: "Reduction in Expiry Losses",
  },
  {
    prefix: "",
    target: 30,
    suffix: "%",
    label: "Waste Reduced in 90 Days",
  },
  {
    prefix: "",
    target: 100,
    suffix: "%",
    label: "Audit-Ready Documentation",
  },
  {
    prefix: "$",
    target: 24500,
    suffix: "",
    label: "Average Annual Savings",
    format: (n) => n.toLocaleString("en-US"),
  },
];

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, duration]);

  return value;
}

function MetricItem({ metric, active }: { metric: MetricConfig; active: boolean }) {
  const raw = useCountUp(metric.target, active);
  const displayed = metric.format ? metric.format(raw) : raw.toString();

  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: "#3A7326" }}>
        {metric.prefix}
        {displayed}
        {metric.suffix}
      </p>
      <p className="text-sm md:text-base" style={{ color: "#51564E" }}>
        {metric.label}
      </p>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function TrustBySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full bg-[#F5F5F5] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-14 md:mb-20">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
            >
              <MetricItem metric={m} active={inView} />
            </motion.div>
          ))}
        </div>

        {/* Trusted By */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={4}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-bold mb-1" style={{ color: "#3A7326" }}>
            Trusted By
          </p>
          <p className="text-base md:text-lg" style={{ color: "#51564E" }}>
            500+ Food Operations Across Europe
          </p>
        </motion.div>
      </div>
    </section>
  );
}