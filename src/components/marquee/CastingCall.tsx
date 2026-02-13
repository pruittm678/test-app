"use client";

import { useState, useCallback } from "react";
import { Movie, searchMovies, getImageUrl } from "@/lib/tmdb";

type VibeRating = "masterpiece" | "matinee" | "flop";

interface CastingCallProps {
  onVibeSelected: (movie: Movie, vibe: VibeRating) => void;
}

export default function CastingCall({ onVibeSelected }: CastingCallProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSelectedMovie(null);
    setHasSearched(true);
    try {
      const movies = await searchMovies(query.trim());
      setResults(movies.filter((m) => m.poster_path));
    } catch {
      setResults([]);
    }
    setSearching(false);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setResults([]);
  }, []);

  const handleVibeClick = useCallback(
    (vibe: VibeRating) => {
      if (!selectedMovie) return;
      onVibeSelected(selectedMovie, vibe);
      setSelectedMovie(null);
      setQuery("");
      setHasSearched(false);
    },
    [selectedMovie, onVibeSelected]
  );

  return (
    <section className="px-6 pb-8 animate-fade-in">
      {/* Section heading */}
      <h2
        className="text-center text-gold text-xs tracking-[0.3em] uppercase mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        The Casting Call
      </h2>

      {/* Search bar — ticket stub style */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a picture..."
            className="ticket-input w-full px-5 py-3.5 pr-14 rounded-sm text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gold hover:text-gold-100 transition-colors"
            aria-label="Search"
          >
            {searching ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            )}
          </button>
        </div>

        {/* Ticket stub perforated edge */}
        <div className="flex justify-between mt-1 px-1 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-gold" />
          ))}
        </div>
      </div>

      {/* Search results — show as small tappable rows */}
      {results.length > 0 && !selectedMovie && (
        <div className="mb-6 max-h-60 overflow-y-auto space-y-1 animate-slide-up">
          {results.slice(0, 8).map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className="w-full flex items-center gap-3 p-2.5 rounded-sm border border-gold/20 bg-velvet-900/60 hover:border-gold/50 hover:bg-velvet-800/60 transition-all text-left"
            >
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-9 h-13 object-cover rounded-sm border border-gold/30"
                style={{ height: "52px" }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-cream text-sm font-semibold truncate"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {movie.title}
                </p>
                <p className="text-sepia-dark text-xs">
                  {movie.release_date?.split("-")[0] || "Unknown"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {hasSearched && results.length === 0 && !selectedMovie && !searching && (
        <p className="text-center text-sepia-dark text-sm italic mb-6">
          No pictures found. Try another title.
        </p>
      )}

      {/* Selected movie — framed poster */}
      {selectedMovie && (
        <div className="flex flex-col items-center animate-scale-in">
          {/* Framed poster */}
          <div className="ornate-frame p-1.5 mb-2">
            <img
              src={getImageUrl(selectedMovie.poster_path)}
              alt={selectedMovie.title}
              className="w-48 h-auto block"
              style={{ maxHeight: "288px", objectFit: "cover" }}
            />
          </div>

          {/* Movie title */}
          <h3
            className="gold-text text-lg text-center mt-3 mb-1 tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {selectedMovie.title}
          </h3>
          <p className="text-sepia-dark text-xs tracking-widest uppercase mb-6">
            {selectedMovie.release_date?.split("-")[0]}
          </p>

          {/* Art Deco separator */}
          <div className="art-deco-line w-32 mb-5" />

          {/* Vibe heading */}
          <p
            className="text-sepia text-[0.65rem] tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Verdict
          </p>

          {/* Vibe check buttons */}
          <div className="flex items-center justify-center gap-5">
            {/* Masterpiece — Gold */}
            <button
              onClick={() => handleVibeClick("masterpiece")}
              className="vibe-btn vibe-btn-gold"
            >
              <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span className="leading-tight">Master-<br />piece</span>
            </button>

            {/* Matinee — Silver */}
            <button
              onClick={() => handleVibeClick("matinee")}
              className="vibe-btn vibe-btn-silver"
            >
              <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 8h20" />
                <circle cx="6" cy="6" r="1" fill="currentColor" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
              <span className="leading-tight">Matinee</span>
            </button>

            {/* Flop — Torn ticket */}
            <button
              onClick={() => handleVibeClick("flop")}
              className="vibe-btn vibe-btn-torn"
            >
              <svg className="w-7 h-7 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l4 2-2 4 4 2-2 4 4 2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 20l-4-2 2-4-4-2 2-4-4-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="leading-tight">Flop</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
