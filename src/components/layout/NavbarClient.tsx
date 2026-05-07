"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import ExpiroLogo from "../elements/Logo";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isAuthOrDashboardRoute } from "./NoNavSection";
import NavbarUserMenu from "./NavbarUserMenu";
import type { NavbarSessionUser } from "./Navbar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "FAQ", href: "/faq" },
  { label: "Price", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function NavbarClient({
  user,
}: {
  user: NavbarSessionUser | null;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
      setScrolled(value > 50);
    });

    return unsubscribe;
  }, [scrollY]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isAuthOrDashboardRoute(pathname)) return null;

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
          <ExpiroLogo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item, i) => {
              const isActive = isActiveLink(item.href);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-[14.5px] font-medium transition-colors duration-200 group",
                      isActive
                        ? "text-[#1B5E35]"
                        : "text-[#2D4A38] hover:text-[#1B5E35]"
                    )}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-1 left-4 right-4 h-[1.5px] bg-green-500 transition-transform duration-250 origin-left rounded-full",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center lg:justify-end gap-3 lg:min-w-40">
            {user ? (
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-base text-end font-medium">{user.name}</h1>
                        <h2 className="text-xs text-end text-gray-500">{user.email}</h2>
                    </div>
                    <NavbarUserMenu user={user} />
                </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" className="rounded-xl lg:py-6 lg:px-6">
                    Sign In
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="rounded-xl lg:py-6 lg:px-6">
                    Sign Up Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden flex flex-col gap-1.25 p-2"
            aria-label="Toggle menu"
            type="button"
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
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-3 text-4 font-medium border-b border-green-100 last:border-0",
                  isActive ? "text-[#1B5E35]" : "text-[#2D4A38]"
                )}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </Link>
            );
          })}

          {!user ? (
            <div className="flex gap-3 pt-4">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-[#1B5E35] border border-[#1B5E35]/30"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1B5E35]"
              >
                Sign Up Free Trial
              </Link>
            </div>
          ) : (
            <NavbarUserMenu user={user} mobile onAction={() => setMobileOpen(false)} />
          )}
        </div>
      </motion.div>
    </>
  );
}