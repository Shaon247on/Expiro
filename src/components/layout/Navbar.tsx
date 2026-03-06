"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import ExpiroLogo from "../elements/Logo";

// ─── Logo ────────────────────────────────────────────────────────────────────

// ─── Nav Links ───────────────────────────────────────────────────────────────
const NAV_LINKS = ["How It Works", "Features", "Vision", "Price"];

// ─── Navbar ──────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 50));
    return unsub;
  }, [scrollY]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 py-2"
        animate={{
          backgroundColor: scrolled
            ? "rgba(240, 250, 244, 0.65)"
            : "rgba(255,255,255,0)",
          borderBottomColor: scrolled
            ? "rgba(46,139,78,0.18)"
            : "rgba(0,0,0,0)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(27,94,53,0.10), 0 1px 0 rgba(255,255,255,0.5) inset"
            : "none",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={{
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: "1px solid transparent",
        }}
      >
        <div className="max-w-360 mx-auto px-6 py-6 lg:px-10 h-18 flex items-center justify-between">
          {/* Logo */}
          <ExpiroLogo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="relative px-4 py-2 text-[14.5px] font-medium text-[#2D4A38] hover:text-[#1B5E35] transition-colors duration-200 group"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                  <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left rounded-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Link
                href="/signin"
                className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-[#1B5E35] border border-[#1B5E35]/30 bg-white/70 hover:bg-green-50 hover:border-[#1B5E35]/60 transition-all duration-200"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42, duration: 0.4 }}
            >
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#1B5E35] hover:bg-[#164d2b] shadow-[0_4px_14px_rgba(27,94,53,0.35)] hover:shadow-[0_6px_20px_rgba(27,94,53,0.45)] transition-all duration-200 active:scale-95"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Sign Up free trial
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.25 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-[#1B5E35] rounded-full origin-center"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-[#1B5E35] rounded-full"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
              }
              className="block w-6 h-0.5 bg-[#1B5E35] rounded-full origin-center"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={
          mobileOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-18 left-0 right-0 z-40 overflow-hidden bg-white/90 backdrop-blur-xl border-b border-green-200/50 md:hidden"
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-4 font-medium text-[#2D4A38] border-b border-green-100 last:border-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4">
            <Link
              href="/signin"
              className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-[#1B5E35] border border-[#1B5E35]/30"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1B5E35]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Sign Up free trial
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
