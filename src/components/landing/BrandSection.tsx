"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

const brands = [
  { name: "acme", src: "/images/slide-1.png" },
  { name: "hexa", src: "/images/slide-2.png" },
  { name: "liwa", src: "/images/slide-3.png" },
  { name: "codelab", src: "/images/slide-4.png" },
  { name: "radyal", src: "/images/slide-5.png" },
  { name: "stari", src: "/images/slide-6.png" },
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={clsx(
          "flex gap-10 min-w-max will-change-transform",
          reverse
            ? "animate-(--animate-marquee-reverse)"
            : "animate-(--animate-marquee)",
          paused && "marquee-paused"
        )}
      >
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-w-30 shrink-0"
          >
            <Image
              src={brand.src}
              alt={brand.name}
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrandMarquee() {
  return (
    <section className="py-10 relative overflow-hidden bg-[#F5F5F5]">
      <div className="relative">
        <div className="absolute rotate-45 top-16 -left-36 hidden lg:block lg:size-85 bg-[#F5F5F5] z-10 blur-lg" />
        <div className="absolute rotate-45 top-16 -right-36 hidden lg:block lg:size-85 bg-[#F5F5F5] z-10 blur-lg" />
        <MarqueeRow />
      </div>
    </section>
  );
}