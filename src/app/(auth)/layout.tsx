"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const leftPanelContent: Record<string, { heading: string; sub: string }> = {
  "/login": {
    heading: "Welcome Back to\nExpiro",
    sub: "Track, manage and stay ahead of expiry dates effortlessly.",
  },
  "/signup": {
    heading: "Getting Started With\nExpiro Technology",
    sub: "Join hundreds of food operations across Europe.",
  },
  "/forgot-password": {
    heading: "Recover Your\nAccount",
    sub: "We'll help you get back in quickly and securely.",
  },
  "/otp-verification": {
    heading: "Verify Your\nIdentity",
    sub: "One-time code sent to keep your account safe.",
  },
  "/new-password": {
    heading: "Set a New\nPassword",
    sub: "Choose a strong password to protect your account.",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const panel = leftPanelContent[pathname] ?? leftPanelContent["/signup"];

  // Track current displayed content separately from the route
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [displayedPanel, setDisplayedPanel] = useState(panel);
  const [panelKey, setPanelKey] = useState(pathname);

  const drawerControls = useAnimation();
  const contentControls = useAnimation();
  const isFirstRender = useRef(true);
  const pendingRef = useRef({ children, panel, pathname });

  // Keep pending ref always up to date
  pendingRef.current = { children, panel, pathname };

  useEffect(() => {
    // Skip animation on first mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayedChildren(children);
      setDisplayedPanel(panel);
      setPanelKey(pathname);
      return;
    }

    async function animate() {
      // 0. Instantly hide content BEFORE any animation frame —
      //    this prevents the new children from flashing through
      //    while the drawer is still open.
      contentControls.set({ opacity: 0 });

      // 1. Squeeze the drawer to the right (scaleX → 0, origin right)
      await drawerControls.start({
        scaleX: 0,
        transition: { duration: 0.32, ease: [0.55, 0, 1, 0.45] },
      });

      // 2. Swap content while drawer is fully collapsed
      setDisplayedChildren(pendingRef.current.children);
      setDisplayedPanel(pendingRef.current.panel);
      setPanelKey(pendingRef.current.pathname);

      // 3. Expand the drawer back from right to left
      await drawerControls.start({
        scaleX: 1,
        transition: { duration: 0.38, ease: [0, 0.55, 0.45, 1] },
      });

      // 4. Fade content back in
      await contentControls.start({
        opacity: 1,
        transition: { duration: 0.22, ease: "easeOut" },
      });
    }

    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#1F485B" }}
    >
      {/* ── Background decorative blobs ── */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ backgroundColor: "rgba(166,220,148,0.07)" }}
      />
      <div
        className="absolute -bottom-24 left-16 w-80 h-80 rounded-full pointer-events-none"
        style={{ backgroundColor: "rgba(166,220,148,0.05)" }}
      />
      <div
        className="absolute top-1/3 left-[18%] w-48 h-48 rounded-full pointer-events-none"
        style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      />

      {/* ── Left panel content ── */}
      <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-16 pointer-events-none">
        {/* Bottom heading — swaps per route */}
        <motion.div
          key={panelKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xs"
        >
          <h1
            className="text-3xl xl:text-4xl font-bold leading-tight mb-3 whitespace-pre-line"
            style={{ color: "white" }}
          >
            {displayedPanel.heading}
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(166,220,148,0.85)" }}
          >
            {displayedPanel.sub}
          </p>
        </motion.div>
        {/* Center illustration */}
        <div className="flex w-1/2 h-full items-center justify-center">
          <Image
            src={"/images/authImage.png"}
            alt="auth image"
            width={562}
            height={376}
            className=""
          />
        </div>
      </div>

      {/* ── Drawer panel ── */}
      {/*
        transformOrigin: "right center" means scaleX collapses TOWARD the right edge.
        So the drawer squeezes away to the right, then expands back from the right.
      */}
      <motion.div
        animate={drawerControls}
        initial={{ scaleX: 1 }}
        className="absolute inset-y-0 right-0 flex w-full sm:w-[65%] lg:w-[58%] xl:w-[54%]"
        style={{
          zIndex: 10,
          transformOrigin: "right center",
        }}
      >
        {/* Feathered left shadow seam */}
        <div
          className="hidden sm:block w-14 shrink-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        {/* White rounded drawer */}
        <div
          className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden"
          style={{
            backgroundColor: "white",
            borderRadius: "36px 0 0 36px",
            boxShadow: "-12px 0 60px rgba(0,0,0,0.22)",
          }}
        >
          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 xl:px-14 py-12">
            <div className="w-full max-w-md">
              <motion.div animate={contentControls} initial={{ opacity: 1 }}>
                {displayedChildren}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
