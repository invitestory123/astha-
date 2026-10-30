import { useCallback, useEffect, useRef, useState } from "react";

import coverAsset from "@/assetshttps://media.invitestory.in/diya-haveli/r3.png.asset.json";
import openerAsset from "@/assetshttps://media.invitestory.in/diya-haveli/openr.mp4.asset.json";
import lotusAsset from "@/assetshttps://media.invitestory.in/diya-haveli/lotus.mp4.asset.json";
import lastFrameAsset from "@/assetshttps://media.invitestory.in/diya-haveli/last_frame.jpeg.asset.json";

import { CoverZoom } from "./CoverZoom";
import { HoldToOpen } from "./HoldToOpen";
import { SkipProgress } from "./SkipProgress";
import { TapRipple } from "./TapRipple";
import { WeddingLogo } from "./WeddingLogo";

type Phase = "cover" | "opener" | "lotus" | "still" | "done";

/** How long before the opener ends we begin the cross-fade (seconds). */
const FADE_LEAD = 2.4;

export function OpeningSequence({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<Phase>("cover");
  const [hidden, setHidden] = useState(false);
  const [tap, setTap] = useState<{ x: number; y: number; id: number } | null>(null);
  const openerRef = useRef<HTMLVideoElement>(null);
  const lotusRef = useRef<HTMLVideoElement>(null);
  const tapCounter = useRef(0);

  const finish = useCallback(() => {
    setPhase("still");
    onFinish();
    window.setTimeout(() => setHidden(true), 1600);
  }, [onFinish]);

  const start = useCallback(() => {
    if (phase !== "cover") return;
    setPhase("opener");
    const v = openerRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => {
        v.muted = true;
        void v.play().catch(() => finish());
      });
    }
  }, [phase, finish]);

  // Cross-fade opener -> lotus near the end of the opener.
  useEffect(() => {
    const v = openerRef.current;
    if (!v || phase !== "opener") return;
    const onTime = () => {
      if (!v.duration) return;
      if (v.duration - v.currentTime <= FADE_LEAD) {
        setPhase("lotus");
        const l = lotusRef.current;
        if (l) {
          l.currentTime = 0;
          void l.play().catch(() => {
            l.muted = true;
            void l.play().catch(() => finish());
          });
        }
      }
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onTime);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onTime);
    };
  }, [phase, finish]);

  // Skip on Escape / after a stall.
  useEffect(() => {
    if (phase === "cover" || phase === "done") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  const onTap = (x: number, y: number) => {
    tapCounter.current += 1;
    setTap({ x, y, id: tapCounter.current });
  };

  if (hidden) return null;

  const showCover = phase === "cover";
  const showOpener = phase === "opener";
  const showLotus = phase === "lotus";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-deep transition-opacity duration-[1400ms] ${
        phase === "still" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Tap-to-open cover with hold-to-open arc */}
      <HoldToOpen
        onActivate={start}
        onTap={onTap}
        className={`absolute inset-0 z-20 h-full w-full transition-opacity duration-1000 ${
          showCover ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <CoverZoom
          src={coverAsset.url}
          alt="Ornate golden and vermilion wedding invitation cover"
          paused={!showCover}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-6 bg-deep/40 backdrop-blur-[2px] rounded-full border border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.25)] float-slow">
          <WeddingLogo size="xl" withName />
        </div>
        <span className="pointer-events-none absolute inset-x-0 bottom-[8%] mx-auto block w-56 rounded-full border border-gold/40 bg-deep/60 py-2.5 text-center font-display text-xs tracking-[0.4em] text-gold-soft uppercase shadow-lg backdrop-blur-sm">
          Tap to Open
        </span>
      </HoldToOpen>

      <video
        ref={openerRef}
        src={openerAsset.url}
        playsInline
        preload="auto"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${
          showOpener ? "opacity-100" : "opacity-0"
        }`}
      />

      <video
        ref={lotusRef}
        src={lotusAsset.url}
        playsInline
        preload="auto"
        onEnded={finish}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${
          showLotus ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Final still, cross-faded in as the lotus film ends */}
      <img
        src={lastFrameAsset.url}
        alt="Bride and groom feet with lotus motifs"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
          phase === "still" ? "opacity-100" : "opacity-0"
        }`}
      />

      <TapRipple tap={tap} />

      {phase !== "cover" && phase !== "still" && <SkipProgress onClick={finish} />}
    </div>
  );
}
