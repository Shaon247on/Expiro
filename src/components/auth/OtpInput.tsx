"use client";

import React, { useRef, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  hasError?: boolean;
}

export function OtpInput({ value, onChange, length = 6, hasError = false }: OtpInputProps) {
  const digits = value.padEnd(length, "").split("").slice(0, length);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function focus(index: number) {
    refs.current[index]?.focus();
  }

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const arr = [...digits];
    arr[index] = digit;
    const next = arr.join("");
    onChange(next);
    if (digit && index < length - 1) focus(index + 1);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = [...digits];
      if (arr[index]) {
        arr[index] = "";
        onChange(arr.join(""));
      } else if (index > 0) {
        arr[index - 1] = "";
        onChange(arr.join(""));
        focus(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focus(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focus(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length));
    const nextFocus = Math.min(pasted.length, length - 1);
    focus(nextFocus);
  }

  return (
    <div className="flex gap-3 justify-center" role="group" aria-label="One-time password input">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={hasError}
          className={[
            "w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-green-400 transition-all",
            hasError
              ? "border-red-400 text-red-600"
              : digits[i]
              ? "border-[#3A7326] text-[#1A3340]"
              : "border-gray-200 text-[#1A3340]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}