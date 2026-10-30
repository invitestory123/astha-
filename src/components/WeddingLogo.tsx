import { cn } from "@/lib/utils";

interface WeddingLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withName?: boolean;
}

export function WeddingLogo({ className, size = "md", withName = false }: WeddingLogoProps) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-44 h-44",
  };

  return (
    <div className={cn("inline-flex flex-col items-center justify-center select-none", className)}>
      <div className={cn("relative transition-transform duration-700 hover:scale-105", sizeMap[size])}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)]"
          aria-label="Astha & Harshad Monogram Logo"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="30%" stopColor="#E6C374" />
              <stop offset="60%" stopColor="#B38938" />
              <stop offset="85%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFF8E7" />
            </linearGradient>

            <linearGradient id="goldGradSoft" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFF2D6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B38938" stopOpacity="0.4" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer ornamental patterned thin circle */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="url(#goldGradSoft)"
            strokeWidth="0.8"
            strokeDasharray="2 4"
          />

          {/* Solid elegant outer ring */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
          />

          {/* Inner ring */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#goldGradSoft)"
            strokeWidth="0.75"
          />

          {/* 4 Cardinal Diamond Accents */}
          <g fill="url(#goldGrad)">
            {/* Top */}
            <path d="M 100 6 L 102.5 11 L 100 16 L 97.5 11 Z" />
            {/* Bottom */}
            <path d="M 100 184 L 102.5 189 L 100 194 L 97.5 189 Z" />
            {/* Left */}
            <path d="M 6 100 L 11 97.5 L 16 100 L 11 102.5 Z" />
            {/* Right */}
            <path d="M 184 100 L 189 97.5 L 194 100 L 189 102.5 Z" />
          </g>

          {/* Corner Floral Leaf Motifs */}
          <g stroke="url(#goldGrad)" fill="none" strokeWidth="1" strokeLinecap="round">
            {/* Top Left Leaf */}
            <path d="M 45 45 Q 60 52 68 68 Q 52 60 45 45" fill="url(#goldGradSoft)" />
            <circle cx="48" cy="48" r="1.5" fill="url(#goldGrad)" />

            {/* Top Right Leaf */}
            <path d="M 155 45 Q 140 52 132 68 Q 148 60 155 45" fill="url(#goldGradSoft)" />
            <circle cx="152" cy="48" r="1.5" fill="url(#goldGrad)" />

            {/* Bottom Left Leaf */}
            <path d="M 45 155 Q 60 148 68 132 Q 52 140 45 155" fill="url(#goldGradSoft)" />
            <circle cx="48" cy="152" r="1.5" fill="url(#goldGrad)" />

            {/* Bottom Right Leaf */}
            <path d="M 155 155 Q 140 148 132 132 Q 148 140 155 155" fill="url(#goldGradSoft)" />
            <circle cx="152" cy="152" r="1.5" fill="url(#goldGrad)" />
          </g>

          {/* Imperial Lotus / Royal Crest Crown on Top */}
          <g transform="translate(100, 32) scale(0.65)" fill="url(#goldGrad)" stroke="url(#goldGrad)" strokeWidth="0.5">
            {/* Center petal */}
            <path d="M 0 -18 C 5 -10, 6 -2, 0 8 C -6 -2, -5 -10, 0 -18 Z" />
            {/* Left petal */}
            <path d="M -2 4 C -9 -3, -15 -2, -18 7 C -10 9, -5 7, -2 4 Z" />
            {/* Right petal */}
            <path d="M 2 4 C 9 -3, 15 -2, 18 7 C 10 9, 5 7, 2 4 Z" />
            {/* Base diamond */}
            <polygon points="0,11 3,14 0,17 -3,14" />
          </g>

          {/* Central Monogram Letters: A & H */}
          {/* Letter 'A' (Astha) */}
          <text
            x="76"
            y="118"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Cinzel Decorative', 'Georgia', serif"
            fontSize="54"
            fontWeight="400"
            fontStyle="normal"
            letterSpacing="-0.02em"
            fill="url(#goldGrad)"
            filter="url(#goldGlow)"
            className="select-none"
          >
            A
          </text>

          {/* Ampersand '&' in the center */}
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Playfair Display', serif"
            fontSize="26"
            fontStyle="italic"
            fontWeight="300"
            fill="url(#goldGrad)"
            opacity="0.85"
            className="select-none"
          >
            &amp;
          </text>

          {/* Letter 'H' (Harshad) */}
          <text
            x="125"
            y="118"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Cinzel Decorative', 'Georgia', serif"
            fontSize="54"
            fontWeight="400"
            letterSpacing="-0.02em"
            fill="url(#goldGrad)"
            filter="url(#goldGlow)"
            className="select-none"
          >
            H
          </text>

          {/* Bottom Royal Flourish */}
          <g transform="translate(100, 150) scale(0.6)" stroke="url(#goldGrad)" fill="none" strokeWidth="1.2" strokeLinecap="round">
            <path d="M -35 -4 Q -15 6 0 -1 Q 15 6 35 -4" />
            <path d="M -20 -1 Q -10 9 0 2 Q 10 9 20 -1" opacity="0.6" />
            <circle cx="0" cy="0" r="2.5" fill="url(#goldGrad)" />
            <circle cx="-35" cy="-4" r="1.5" fill="url(#goldGrad)" />
            <circle cx="35" cy="-4" r="1.5" fill="url(#goldGrad)" />
          </g>
        </svg>
      </div>

      {withName && (
        <div className="mt-2 text-center">
          <p className="font-display tracking-[0.35em] text-xs uppercase text-gold-soft/90">
            Astha &amp; Harshad
          </p>
          <p className="mt-0.5 text-[0.55rem] tracking-[0.3em] uppercase text-gold-soft/60">
            12 · 12 · 2026
          </p>
        </div>
      )}
    </div>
  );
}

