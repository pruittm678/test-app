"use client";

import { Movie, getImageUrl } from "@/lib/tmdb";

interface BoxOfficeBattleProps {
  newMovie: Movie;
  opponent: Movie;
  onPickNew: () => void;
  onPickOpponent: () => void;
  onUndo: () => void;
  onSkip: () => void;
  canUndo: boolean;
}

export default function BoxOfficeBattle({
  newMovie,
  opponent,
  onPickNew,
  onPickOpponent,
  onUndo,
  onSkip,
  canUndo,
}: BoxOfficeBattleProps) {
  return (
    <section className="px-4 pb-6 animate-fade-in">
      {/* Header */}
      <h2
        className="gold-text text-xl text-center tracking-[0.2em] mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Which Is Superior?
      </h2>

      {/* Art Deco separator */}
      <div className="art-deco-line mx-12 mb-6" />

      {/* The Battleground */}
      <div className="flex items-stretch justify-center gap-0 mb-6">
        {/* Card A — New movie */}
        <button
          onClick={onPickNew}
          className="flex-1 max-w-[160px] group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="ornate-frame p-1">
            <img
              src={getImageUrl(newMovie.poster_path)}
              alt={newMovie.title}
              className="w-full aspect-[2/3] object-cover block"
            />
          </div>
          <p
            className="text-cream text-xs text-center mt-2.5 tracking-wider leading-snug group-hover:text-gold transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {newMovie.title}
          </p>
          <p className="text-sepia-dark text-[0.6rem] text-center tracking-widest uppercase mt-0.5">
            {newMovie.release_date?.split("-")[0]}
          </p>
        </button>

        {/* VS emblem */}
        <div className="flex flex-col items-center justify-center px-2 -mx-1 z-10" style={{ minWidth: "48px" }}>
          <div className="sunburst">
            <div
              className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center border-2 border-gold"
              style={{
                background: "radial-gradient(circle at 40% 40%, #2d0505, #0a0a0a)",
                boxShadow: "0 0 15px rgba(212,175,55,0.3)",
              }}
            >
              <span
                className="gold-text text-[0.65rem] font-bold tracking-wider"
                style={{ fontFamily: "var(--font-display)" }}
              >
                VS
              </span>
            </div>
          </div>
        </div>

        {/* Card B — Opponent */}
        <button
          onClick={onPickOpponent}
          className="flex-1 max-w-[160px] group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="ornate-frame p-1">
            <img
              src={getImageUrl(opponent.poster_path)}
              alt={opponent.title}
              className="w-full aspect-[2/3] object-cover block"
            />
          </div>
          <p
            className="text-cream text-xs text-center mt-2.5 tracking-wider leading-snug group-hover:text-gold transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {opponent.title}
          </p>
          <p className="text-sepia-dark text-[0.6rem] text-center tracking-widest uppercase mt-0.5">
            {opponent.release_date?.split("-")[0]}
          </p>
        </button>
      </div>

      {/* Art Deco separator */}
      <div className="art-deco-line mx-12 mb-5" />

      {/* Footer actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`pill-btn ${!canUndo ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          Undo
        </button>
        <button onClick={onSkip} className="pill-btn">
          Too Tough to Call
        </button>
      </div>
    </section>
  );
}
