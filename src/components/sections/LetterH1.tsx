import { Letters } from "@/hooks/use-letters";

/**
 * Highlighted couple headline:
 * First Bride: Astha
 * Then &
 * Then Groom: Harshad
 */
export function LetterH1() {
  return (
    <h1
      className="mt-6 flex flex-col items-center justify-center font-display leading-[0.88] tracking-tight sm:mt-10"
      style={{ opacity: 1 }}
    >
      {/* First: Bride Name */}
      <span className="gold-text text-6xl font-normal drop-shadow-[0_4px_30px_rgba(212,175,55,0.45)] sm:text-7xl md:text-8xl lg:text-9xl">
        <Letters text="Astha" />
      </span>

      {/* Then: & */}
      <span className="my-2 select-none font-display text-3xl font-light italic text-gold-soft/80 sm:my-3 sm:text-5xl">
        &amp;
      </span>

      {/* Then: Groom Name */}
      <span className="gold-text text-6xl font-normal drop-shadow-[0_4px_30px_rgba(212,175,55,0.45)] sm:text-7xl md:text-8xl lg:text-9xl">
        <Letters text="Harshad" />
      </span>
    </h1>
  );
}
