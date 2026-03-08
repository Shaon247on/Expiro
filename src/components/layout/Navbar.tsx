"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import ExpiroLogo from "../elements/Logo";
import { Button } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { isAuthOrDashboardRoute } from "./NoNavSection";

// ─── Logo ────────────────────────────────────────────────────────────────────

// ─── Nav Links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", value: "home" },
  { label: "Features", value: "features" },
  { label: "Vision", value: "vision" },
  { label: "Price", value: "price" },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // query param name you use across routes
  const activeSection = (searchParams.get("section") ?? "home").toLowerCase();
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 50));
    return unsub;
  }, [scrollY]);


  if (isAuthOrDashboardRoute(pathname)) return null;

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
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item, i) => {
              const isActive = activeSection === item.value;

              // build URL with query param, keep current pathname
              const href = `${pathname}?section=${encodeURIComponent(item.value)}`;

              return (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "relative px-4 py-2 text-[14.5px] font-medium transition-colors duration-200 group",
                      isActive
                        ? "text-[#1B5E35]"
                        : "text-[#2D4A38] hover:text-[#1B5E35]",
                    )}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-1 left-4 right-4 h-[1.5px] bg-green-500 transition-transform duration-250 origin-left rounded-full",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Link href="/login">
                <Button
                  variant={"secondary"}
                  className="rounded-xl lg:py-6  lg:px-6"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42, duration: 0.4 }}
            >
              <Link href="/signup">
                <Button className="rounded-xl lg:py-6  lg:px-6">
                  Sign Up free trialfree trial
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.25 p-2"
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
        className="fixed top-22 left-0 right-0 z-40 overflow-hidden bg-white/90 backdrop-blur-xl border-b border-green-200/5 lg:hidden"
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.value;
            const href = `${pathname}?section=${encodeURIComponent(item.value)}`;

            return (
              <Link
                key={item.value}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-3 text-4 font-medium border-b border-green-100 last:border-0",
                  isActive ? "text-[#1B5E35]" : "text-[#2D4A38]",
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </Link>
            );
          })}
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
