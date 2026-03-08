"use client";

import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";
import ExpiroLogo from "../elements/Logo";
import { usePathname } from "next/navigation";
import { isAuthRoute } from "./NoNavSection";

const socialLinks = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
  { icon: Twitter, label: "Twitter / X" },
  { icon: Linkedin, label: "LinkedIn" },
];

export default function Footer() {
    const pathname = usePathname();

  if (isAuthRoute(pathname)) return null;
  return (
    <footer className="w-full bg-white px-4 pt-12 pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          {/* Left: Logo + description */}
          <div className="max-w-sm">
            {/* Logo */}
            <div className="mb-10">
                <ExpiroLogo/>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed font-medium" style={{ color: "#3A7326" }}>
              Digital platform for supermarkets, restaurants, and fresh food shops. Automate DLC tracking, get expiry alerts, and pass hygiene inspections effortlessly.
            </p>
          </div>

          {/* Right: Get in Touch + About Us + Socials */}
          <div className="flex flex-col items-start md:items-end gap-5">
            <p className="text-base font-semibold text-black">Get in Touch</p>

            <div className="flex items-center gap-5">
              <p className="text-base font-semibold text-black">About Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                    style={{ backgroundColor: "#F5F5F5" }}
                  >
                    <Icon size={16} style={{ color: "#3A7326" }} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-5" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: "#51564E" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="#51564E" strokeWidth="1.4" fill="none"/>
              <text x="8" y="12" textAnchor="middle" fill="#51564E" fontSize="8" fontWeight="bold">c</text>
            </svg>
            <span>2026 TrendBurst. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: "#51564E" }}>
            <a href="#" className="hover:underline">Terms &amp; Conditions</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}