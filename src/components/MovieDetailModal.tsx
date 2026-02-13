"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Plus, Star, Clock, Calendar } from "lucide-react";
import {
  Movie,
  MovieDetails,
  fetchMovieDetails,
  formatRuntime,
  getImageUrl,
} from "@/lib/tmdb";

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onAdd: (movie: Movie) => void;
}

export default function MovieDetailModal({
  movie,
  onClose,
  onAdd,
}: MovieDetailModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!movie) {
      setIsVisible(false);
      setDetails(null);
      return;
    }

    // Trigger animation on next frame
    requestAnimationFrame(() => setIsVisible(true));

    fetchMovieDetails(movie.id)
      .then(setDetails)
      .catch(() => {
        // Fall back to base movie data
        setDetails(null);
      });
  }, [movie]);

  // Escape key listener
  useEffect(() => {
    if (!movie) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [movie, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  if (!movie) return null;

  const displayData = details || movie;
  const year = displayData.release_date?.split("-")[0] || "N/A";
  const score = displayData.vote_average?.toFixed(1);
  const genres = details?.genres?.map((g) => g.name) || [];
  const runtime = details ? formatRuntime(details.runtime) : "";
  const tagline = details?.tagline || "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-200 ${
        isVisible ? "bg-black/80" : "bg-black/0"
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 shadow-2xl transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close"
        >
          <X size={20} aria-hidden />
        </button>

        {/* Backdrop image */}
        {displayData.backdrop_path && (
          <div className="relative w-full aspect-video">
            <Image
              src={getImageUrl(displayData.backdrop_path, "original")}
              alt={displayData.title}
              fill
              className="object-cover rounded-t-2xl"
              sizes="(max-width: 672px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative px-6 sm:px-8 pb-8 -mt-20">
          <div className="flex gap-6">
            {/* Poster */}
            <div className="relative flex-shrink-0 w-[120px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              {displayData.poster_path ? (
                <Image
                  src={getImageUrl(displayData.poster_path, "w500")}
                  alt={displayData.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                  No Poster
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-12">
              <h2 className="text-2xl font-bold text-white">
                {displayData.title}
              </h2>
              {tagline && (
                <p className="text-sm text-zinc-400 italic mt-2">{tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-300">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-zinc-500" />
                  {year}
                </span>
                {runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-zinc-500" />
                    {runtime}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  {score}
                </span>
              </div>
            </div>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs font-medium text-zinc-300 bg-zinc-800 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {displayData.overview && (
            <p className="mt-5 text-sm text-zinc-300 leading-relaxed">
              {displayData.overview}
            </p>
          )}

          {/* Add to Ranking button */}
          <button
            type="button"
            onClick={() => onAdd(movie)}
            className="mt-6 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            aria-label="Add to ranking"
          >
            <Plus size={20} aria-hidden />
            Add to Ranking
          </button>
        </div>
      </div>
    </div>
  );
}
