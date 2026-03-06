"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────
interface GridImage {
  id: number;
  row: number;
  src: string;
  alt: string;
}

// ─── Image Data (4 rows: 1 → 2 → 3 → 4) ────────────────────────────────────
const GRID_IMAGES: GridImage[] = [
  // Row 0 — top, 1 image
  {
    id: 1,
    row: 0,
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=220&h=220&fit=crop&crop=faces",
    alt: "Team meeting",
  },
  // Row 1 — 2 images
  {
    id: 2,
    row: 1,
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=220&h=220&fit=crop&crop=faces",
    alt: "Collaboration",
  },
  {
    id: 3,
    row: 1,
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=220&h=220&fit=crop&crop=faces",
    alt: "Office work",
  },
  // Row 2 — 3 images
  {
    id: 4,
    row: 2,
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=220&h=220&fit=crop&crop=faces",
    alt: "Professional",
  },
  {
    id: 5,
    row: 2,
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=220&h=220&fit=crop&crop=faces",
    alt: "Working team",
  },
  {
    id: 6,
    row: 2,
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=220&h=220&fit=crop&crop=faces",
    alt: "Team discussion",
  },
  // Row 3 — bottom, 4 images
  {
    id: 7,
    row: 3,
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=220&h=220&fit=crop&crop=faces",
    alt: "Manager",
  },
  {
    id: 8,
    row: 3,
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=220&h=220&fit=crop&crop=faces",
    alt: "Presentation",
  },
  {
    id: 9,
    row: 3,
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=220&h=220&fit=crop&crop=faces",
    alt: "Brainstorm",
  },
  {
    id: 10,
    row: 3,
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=220&h=220&fit=crop&crop=faces",
    alt: "Group work",
  },
];

const ROW_COUNTS = [1, 2, 3, 4];
const TILE = 135; // px
const GAP = 10; // px

// ─── Single Falling Tile ─────────────────────────────────────────────────────
function FallingTile({ image, delay }: { image: GridImage; delay: number }) {
  return (
    <motion.div
      initial={{
        y: -380,
        opacity: 0,
        rotate: Math.random() * 14 - 7,
        scale: 0.82,
      }}
      animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
      transition={{
        y: {
          type: "spring",
          stiffness: 160,
          damping: 16,
          mass: 0.85,
          delay,
        },
        opacity: { duration: 0.15, delay },
        rotate: { type: "spring", stiffness: 200, damping: 20, delay },
        scale: { type: "spring", stiffness: 200, damping: 20, delay },
      }}
      style={{ width: TILE, height: TILE, flexShrink: 0 }}
    >
      <div className="size-32 rounded-[18px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.14)] ring-1 ring-white/30 relative">
        <Image
          height={150}
          width={150}
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* subtle green shimmer */}
        <div className="absolute inset-0 bg-linear-to-br from-green-900/10 via-transparent to-transparent rounded-[18px]" />
      </div>
    </motion.div>
  );
}

// ─── Image Pyramid ───────────────────────────────────────────────────────────
function ImagePyramid({ triggered }: { triggered: boolean }) {
  const maxCols = 4;
  const gridW = maxCols * TILE + (maxCols - 1) * GAP;

  return (
    <div className="relative" style={{ width: gridW }}>
      {/* Rows — right-aligned (bottom row widest) */}
      <div className="flex flex-col gap-2.5 items-end">
        {ROW_COUNTS.map((count, rowIdx) => {
          const rowImages = GRID_IMAGES.filter((img) => img.row === rowIdx);
          const rowW = count * TILE + (count - 1) * GAP;
          const offsetLeft = gridW - rowW;

          // Row 0 falls first (top); row 3 falls last (bottom)
          // Each tile in a row also staggers left→right
          return (
            <div
              key={rowIdx}
              className="flex gap-2.5"
              style={{ marginLeft: offsetLeft }}
            >
              {triggered &&
                rowImages.map((img, colIdx) => {
                  const totalRows = ROW_COUNTS.length;

                  const delay =
                    0.25 +
                    (totalRows - 1 - rowIdx) * 0.22 + // reverse row order
                    colIdx * 0.11;
                  return <FallingTile key={img.id} image={img} delay={delay} />;
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stat Item ───────────────────────────────────────────────────────────────
function StatItem({
  label,
  sub,
  delay,
  accent = false,
}: {
  label: string;
  sub: string;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 130 }}
      className="flex flex-col gap-0.5"
    >
      <span
        className={`text-[13.5px] font-bold leading-tight ${accent ? "text-[#1B8A3F]" : "text-[#1B5E35]"}`}
      >
        {label}
      </span>
      <span className="text-sm text-gray-500 leading-tight font-dm">{sub}</span>
    </motion.div>
  );
}

// ─── Animated word reveal ────────────────────────────────────────────────────
function RevealLine({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <div className="overflow-hidden">
      <motion.span
        display="block"
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`block ${className ?? ""} `}
      >
        {text}
      </motion.span>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
export default function HeroSection() {
  const pyramidRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pyramidRef, { once: true, margin: "-80px" });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (inView) setTriggered(true);
  }, [inView]);

  return (
    <section className="relative min-h-screen font-inter flex items-center overflow-hidden bg-[#F7FCF9]">
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial glow top-left */}
        <div
          className="absolute -top-32 -left-32 w-150 h-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(134,239,172,0.22) 0%, rgba(134,239,172,0.04) 60%, transparent 80%)",
          }}
        />
        {/* Subtle glow bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-125 h-125 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(187,247,208,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Very faint grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#1B5E35 1px, transparent 1px), linear-gradient(90deg, #1B5E35 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-360 mx-auto px-6 lg:px-10 w-full pt-28 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6">
        {/* ── Left: Text ── */}
        <div className="flex-1 max-w-350">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-7 rounded-full border border-green-300/70 bg-white/70 backdrop-blur-sm shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[13px] font-medium text-[#1B6E3A]">
              Full DLC Traceability in One Platform
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[56px] lg:text-[66px] xl:text-[80px] font-bold leading-[1.06] tracking-tighter mb-5 font-dm">
            <RevealLine
              text="Stop Food Waste."
              delay={0.28}
              className="text-[#121C15]"
            />
            <RevealLine
              text="Increase Your Margin."
              delay={0.42}
              className="text-[#1B8A3F]"
            />
          </h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.55 }}
            className="text-[16.5px] text-[#3D5944] leading-[1.72] mb-10 max-w-125"
          >
            Expiro helps supermarkets, restaurants, and fresh food businesses
            prevent product loss, simplify expiry tracking, and stay HACCP
            compliant — all with automated alerts and effortless data
            management.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <Link href="/signup">
              <Button size={"lg"}>
                Start Free Trial
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </Button>
            </Link>

            <Link href="/demo">
              <Button variant={"secondary"} size={"lg"}>
                <span className="text-base">
                  <Calendar fill="#3A732640" />
                </span>{" "}
                Book a Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-6 border-t border-green-200/60"
          >
            <StatItem
              label="EU Standards"
              sub="Built for Europe"
              delay={1.05}
            />
            <div className="w-px h-8 bg-green-200/60 self-center hidden sm:block" />
            <StatItem
              label="Real-Time"
              sub="Instant Alerts"
              delay={1.12}
              accent
            />
            <div className="w-px h-8 bg-green-200/60 self-center hidden sm:block" />
            <StatItem label="Multi-user" sub="Team Access" delay={1.19} />
            <div className="w-px h-8 bg-green-200/60 self-center hidden sm:block" />
            <StatItem
              label="Reduce waste"
              sub="by up to 30% in 90 days"
              delay={1.26}
              accent
            />
          </motion.div>
        </div>

        {/* ── Right: Falling image pyramid ── */}
        <div
          ref={pyramidRef}
          className="shrink-0 flex items-end justify-center lg:justify-end w-full lg:w-auto"
        >
          <ImagePyramid triggered={triggered} />
        </div>
      </div>
    </section>
  );
}
