export function VenueMap() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-gold/25 bg-deep/40 p-1 shadow-[0_30px_80px_-35px_oklch(0.2_0.1_30/0.9)]">
      <iframe
        title="Hotel Dev Arjun Singh on Google Maps"
        src="https://www.google.com/maps?q=Hotel+Dev+Arjun+Singh&output=embed"
        className="h-[28rem] w-full rounded-[1.2rem] border-0 grayscale-[0.15]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-left">
        <div>
          <p className="font-display text-lg text-gold-soft">Hotel Dev Arjun Singh</p>
          <p className="mt-1 text-xs text-foreground/55">Wedding Destination &amp; Celebrations</p>
        </div>
        <a
          href="https://maps.app.goo.gl/a2bJFj4s9ns88LL6A?g_st=ac"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-gold/40 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-gold-soft transition-colors hover:bg-gold/15 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
