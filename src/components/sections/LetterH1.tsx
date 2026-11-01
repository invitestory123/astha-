import { Letters } from "@/hooks/use-letters";

/**
 * Static "Astha & Harshad" headline. Rendered without entrance animation so
 * the names are always visible the moment React hydrates — no GSAP, no
 * opacity transitions, no transform. The letter spans preserve the
 * gold-text gradient and inline layout; they are not animated.
 */
export function LetterH1() {
  return (
    <h1
      className="mt-5 inline-flex flex-nowrap items-center justify-center whitespace-nowrap font-display text-[clamp(2rem,7.5vw,5.5rem)] leading-none gold-text"
      style={{ opacity: 1 }}
    >
      <Letters text="Astha" />
      <span className="mx-2 align-middle text-[0.65em] font-light italic sm:mx-4">&amp;</span>
      <Letters text="Harshad" />
    </h1>
  );
}
