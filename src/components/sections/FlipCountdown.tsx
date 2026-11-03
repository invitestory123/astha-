import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";

import { useGSAP, useMotionOk } from "@/lib/motion";
import { cn } from "@/lib/utils";

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return [
    Math.floor(ms / 86400000),
    Math.floor(ms / 3600000) % 24,
    Math.floor(ms / 60000) % 60,
    Math.floor(ms / 1000) % 60,
  ];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FlipCountdown({ target }: { target: string }) {
  const t = new Date(target).getTime();
  const [values, setValues] = useState<number[]>(() => diff(t));
  const ok = useMotionOk();

  useEffect(() => {
    setValues(diff(t));
    const id = window.setInterval(() => {
      setValues(diff(t));
    }, 1000);
    return () => window.clearInterval(id);
  }, [t]);

  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-3" suppressHydrationWarning>
      {UNITS.map((u, i) => (
        <FlipUnit
          key={u}
          label={u}
          value={values[i] ?? 0}
          animate={ok}
          highlight={
            (u === "Days" && (values[0] ?? 0) <= 7) || (u === "Hours" && (values[1] ?? 0) <= 6)
          }
        />
      ))}
    </div>
  );
}

function FlipUnit({
  label,
  value,
  animate,
  highlight,
}: {
  label: string;
  value: number;
  animate: boolean;
  highlight: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Highlight pulse: only runs once on mount if already inside the threshold.
  useGSAP(
    () => {
      if (!animate || !highlight || !boxRef.current) return;
      gsap.fromTo(
        boxRef.current,
        { boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
        {
          boxShadow: "0 0 0 8px rgba(225, 190, 120, 0.35)",
          duration: 0.8,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
      );
    },
    [animate, highlight],
  );

  // Subtle digit tick animation when value changes.
  useGSAP(
    () => {
      if (!animate || !textRef.current) return;
      gsap.fromTo(
        textRef.current,
        { y: -6, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
      );
    },
    [animate, value],
  );

  return (
    <div
      ref={boxRef}
      className={cn(
        "rounded-lg border border-gold/25 bg-card/50 px-2 py-4 text-center backdrop-blur-sm",
      )}
    >
      <div className="relative flex h-9 items-center justify-center overflow-hidden">
        <div
          ref={textRef}
          className="font-display text-3xl gold-text tabular-nums"
        >
          {pad(value)}
        </div>
      </div>
      <div className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
