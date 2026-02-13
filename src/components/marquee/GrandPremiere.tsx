"use client";

import { getImageUrl } from "@/lib/tmdb";

interface RankedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  score: number;
  vibe: "masterpiece" | "matinee" | "flop";
}

interface GrandPremiereProps {
  rankings: RankedMovie[];
  onRemove: (id: number) => void;
}

export default function GrandPremiere({ rankings, onRemove }: GrandPremiereProps) {
  if (rankings.length === 0) {
    return (
      <section className="px-6 pb-8 animate-fade-in">
        <h2
          className="gold-text text-xl text-center tracking-[0.2em] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Grand Premiere
        </h2>
        <div className="art-deco-line mx-8 mb-8" />

        <div className="text-center py-16">
          {/* Empty state — ornate ticket graphic */}
          <div className="inline-block mb-6 opacity-30">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="20" width="60" height="40" rx="4" stroke="#D4AF37" strokeWidth="2" />
              <line x1="30" y1="20" x2="30" y2="60" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="40" r="8" stroke="#D4AF37" strokeWidth="1.5" />
              <polygon points="50,34 52,38 56,38 53,41 54,45 50,43 46,45 47,41 44,38 48,38" fill="#D4AF37" />
            </svg>
          </div>
          <p
            className="text-sepia-dark text-sm italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            No pictures ranked yet.
          </p>
          <p
            className="text-sepia-dark/60 text-xs mt-2 tracking-widest uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Search &amp; rate to begin
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-8 animate-fade-in">
      <h2
        className="gold-text text-xl text-center tracking-[0.2em] mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        The Grand Premiere
      </h2>

      <div className="art-deco-line mx-8 mb-6" />

      {/* Ranked list */}
      <div className="space-y-3">
        {rankings.map((movie, index) => (
          <div
            key={movie.id}
            className="marquee-row rounded-sm px-3 py-3 flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
          >
            {/* Rank star */}
            <div className="gold-star flex-shrink-0">
              <span>{index + 1}</span>
            </div>

            {/* Poster thumbnail */}
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-9 h-14 object-cover rounded-sm border border-gold/30 flex-shrink-0"
            />

            {/* Movie info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-cream text-sm font-semibold truncate tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {movie.title}
              </p>
              <p className="text-sepia-dark text-[0.6rem] tracking-widest uppercase mt-0.5">
                {movie.release_date?.split("-")[0]}
                {" \u2022 "}
                <span
                  className={
                    movie.vibe === "masterpiece"
                      ? "text-gold"
                      : movie.vibe === "matinee"
                      ? "text-silver"
                      : "text-sepia-dark"
                  }
                >
                  {movie.vibe === "masterpiece"
                    ? "Masterpiece"
                    : movie.vibe === "matinee"
                    ? "Matinee"
                    : "Flop"}
                </span>
              </p>
            </div>

            {/* Score circle */}
            <div className="score-circle flex-shrink-0">
              <span>{movie.score.toFixed(1)}</span>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(movie.id)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-sepia-dark/40 hover:text-red-400 transition-colors"
              aria-label={`Remove ${movie.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
