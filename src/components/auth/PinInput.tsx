"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  ariaLabel: string;
}

const LEN = 4;

export function PinInput({ value, onChange, disabled, invalid, ariaLabel }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(LEN, " ").slice(0, LEN).split("");

  function setAt(i: number, d: string) {
    const next = value.split("");
    next[i] = d;
    onChange(next.join("").replace(/\s/g, "").slice(0, LEN));
  }

  function handleChange(i: number, raw: string) {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (!d) return;
    setAt(i, d);
    if (i < LEN - 1) refs.current[i + 1]?.focus();
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i].trim()) {
        setAt(i, "");
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        setAt(i - 1, "");
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LEN - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, LEN - 1)]?.focus();
    }
  }

  return (
    <div className="flex gap-2.5" role="group" aria-label={ariaLabel}>
      {Array.from({ length: LEN }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={1}
          disabled={disabled}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          aria-label={`${ariaLabel} ${i + 1}`}
          className={`h-14 w-full rounded-xl border bg-surface-2 text-center text-2xl font-semibold text-foreground caret-gold outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_rgba(217,164,65,0.18)] disabled:opacity-50 ${
            invalid ? "border-danger/70" : "border-border-strong"
          }`}
        />
      ))}
    </div>
  );
}
