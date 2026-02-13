"use client";

export default function MarqueeHeader() {
  return (
    <header className="relative pt-8 pb-4 text-center">
      {/* Top Art Deco line */}
      <div className="art-deco-line mx-8 mb-6" />

      {/* Art Deco diamond ornament */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-60">
          <polygon points="10,0 20,10 10,20 0,10" fill="#D4AF37" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-40">
          <polygon points="6,0 12,6 6,12 0,6" fill="#D4AF37" />
        </svg>
        <svg width="8" height="8" viewBox="0 0 8 8" className="opacity-30">
          <polygon points="4,0 8,4 4,8 0,4" fill="#D4AF37" />
        </svg>
      </div>

      {/* Main title */}
      <h1
        className="gold-text text-3xl sm:text-4xl tracking-[0.2em] leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        THE MARQUEE
      </h1>

      {/* Subtitle */}
      <p
        className="mt-2 text-sepia text-[0.65rem] tracking-[0.35em] uppercase"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Rank the Pictures
      </p>

      {/* Bottom ornament — mirrored */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <svg width="8" height="8" viewBox="0 0 8 8" className="opacity-30">
          <polygon points="4,0 8,4 4,8 0,4" fill="#D4AF37" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-40">
          <polygon points="6,0 12,6 6,12 0,6" fill="#D4AF37" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-60">
          <polygon points="10,0 20,10 10,20 0,10" fill="#D4AF37" />
        </svg>
      </div>

      {/* Bottom Art Deco line */}
      <div className="art-deco-line mx-8 mt-6" />
    </header>
  );
}
