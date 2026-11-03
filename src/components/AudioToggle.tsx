import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import defaultAudio from "@/assets/audio.mp3";
import { cn } from "@/lib/utils";

/**
 * Floating audio mute/unmute toggle. Plays a looped audio file.
 * Hidden until the opening sequence finishes (pass `visible` from index.tsx).
 */
export function AudioToggle({ visible }: { visible: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const src = (import.meta.env["VITE_AUDIO_URL"] as string | undefined) ?? defaultAudio;
    const a = new Audio(src);
    a.loop = true;
    a.preload = "auto";
    a.addEventListener("error", () => setBroken(true), { once: true });
    // Safety listener to ensure seamless continuous looping across all mobile/desktop browsers
    a.addEventListener("ended", () => {
      a.currentTime = 0;
      void a.play().catch(() => {});
    });
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const a = audioRef.current;
    if (a && !playing && !broken) {
      void a
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // In case mobile browser requires an explicit button tap
          setPlaying(false);
        });
    }
  }, [visible, broken]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || broken) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a
        .play()
        .then(() => setPlaying(true))
        .catch(() => setBroken(true));
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Mute music" : "Play music"}
      className={cn(
        "fixed bottom-5 left-5 z-30 grid h-10 w-10 place-items-center rounded-full",
        "border border-gold/30 bg-deep/70 text-gold-soft backdrop-blur-sm",
        "transition-colors hover:bg-deep/90 shadow-lg",
      )}
    >
      {broken ? (
        <span className="text-[0.6rem]">—</span>
      ) : playing ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </button>
  );
}
