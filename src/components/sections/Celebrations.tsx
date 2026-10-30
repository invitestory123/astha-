import { useRef, useState } from "react";
import { CalendarPlus } from "lucide-react";

import frameAsset from "@/assetshttps://media.invitestory.in/diya-haveli/r1.png.asset.json";
import coupleAsset from "@/assetshttps://media.invitestory.in/diya-haveli/r2.png.asset.json";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { gsap, useGSAP, useMotionOk } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Event = {
  name: string;
  date: string; // human-readable, e.g. "12 February 2027"
  time: string; // e.g. "4:00 PM"
  place: string;
  note: string;
  /** ISO start in IST (+05:30). */
  start: string;
  /** ISO end in IST (+05:30). */
  end: string;
  slug: string;
};

const EVENTS: Event[] = [
  {
    name: "Mehendi & Sangeet",
    date: "11 December 2026",
    time: "4:00 PM",
    place: "Hotel Dev Arjun Singh",
    note: "Marigolds, henna, and an evening of dance, dhol and celebration.",
    start: "2026-12-11T16:00:00+05:30",
    end: "2026-12-11T22:00:00+05:30",
    slug: "mehendi-sangeet",
  },
  {
    name: "Baraat Swagat",
    date: "12 December 2026",
    time: "6:00 PM",
    place: "Hotel Dev Arjun Singh",
    note: "Grand arrival and welcoming of the groom's procession.",
    start: "2026-12-12T18:00:00+05:30",
    end: "2026-12-12T19:00:00+05:30",
    slug: "baraat",
  },
  {
    name: "Wedding Ceremony (Saat Phere)",
    date: "12 December 2026",
    time: "7:00 PM Onwards",
    place: "Hotel Dev Arjun Singh",
    note: "Sacred vows and saat phere under a canopy of blessings and divine light.",
    start: "2026-12-12T19:00:00+05:30",
    end: "2026-12-12T21:30:00+05:30",
    slug: "wedding",
  },
  {
    name: "Dinner & Reception",
    date: "12 December 2026",
    time: "8:30 PM Onwards",
    place: "Hotel Dev Arjun Singh",
    note: "A royal feast, heartfelt blessings and celebratory toast.",
    start: "2026-12-12T20:30:00+05:30",
    end: "2026-12-12T23:30:00+05:30",
    slug: "reception",
  },
];

function fmtIcsStamp(iso: string) {
  // 2026-12-12T19:00:00+05:30 → 20261212T190000
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (!m) return iso;
  return `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}${m[6]}`;
}

function buildIcs(e: Event) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Astha and Harshad//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@astha-harshad-2026.example`,
    `DTSTAMP:${fmtIcsStamp(new Date().toISOString())}`,
    `DTSTART:${fmtIcsStamp(e.start)}`,
    `DTEND:${fmtIcsStamp(e.end)}`,
    `SUMMARY:Astha & Harshad — ${e.name}`,
    `LOCATION:${e.place}`,
    `DESCRIPTION:${e.note}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function icsHref(e: Event) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(e))}`;
}

export function Celebrations() {
  return (
    <section
      data-section="celebrations"
      className="relative bg-cover bg-center bg-no-repeat px-6 py-32"
      style={{ backgroundImage: `url(${frameAsset.url})` }}
    >
      <div
        aria-hidden
        className="ken-burns-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${frameAsset.url})` }}
      />
      <div className="absolute inset-0 bg-deep/75" />
      <div className="relative mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="The Celebrations"
          title="Four evenings, woven together."
          className="mx-auto max-w-2xl"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {EVENTS.map((e, i) => (
            <Reveal key={e.name} delay={i * 120}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: Event }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!ok || !cardRef.current) return;
      const card = cardRef.current;
      const onMove = (e: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -y * 4,
          rotateY: x * 5,
          transformPerspective: 800,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      };
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    },
    [ok],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={cardRef}
          className={cn(
            "group h-full cursor-pointer rounded-xl border border-gold/25 p-7 paper",
            "transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(225,190,120,0.4)]",
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center gap-2">
            <img
              src={coupleAsset.url}
              alt=""
              aria-hidden
              className="h-5 w-5 rounded-full object-cover ring-1 ring-gold/40"
            />
            <h3 className="font-display text-3xl gold-text">{event.name}</h3>
          </div>
          <div className="mt-3 w-12 gold-rule transition-all duration-500 group-hover:w-24" />
          <p className="mt-4 text-sm tracking-[0.2em] text-gold-soft/90">
            {event.date} · {event.time}
          </p>
          <p className="mt-2 text-sm text-foreground/85">{event.place}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{event.note}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 border-gold/30 bg-card text-foreground">
        <div className="space-y-3">
          <p className="font-display text-xl gold-text">Save your seat for {event.name}</p>
          <p className="text-xs text-muted-foreground">
            {event.date} · {event.time} · {event.place}
          </p>
          <a
            href={icsHref(event)}
            download={`astha-harshad-${event.slug}.ics`}
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-gold-soft transition-colors hover:bg-gold/10"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Add to calendar
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
