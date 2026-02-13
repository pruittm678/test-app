"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
  onAdd?: (movie: Movie) => void;
  onMovieClick?: (movie: Movie) => void;
  showAddButton?: boolean;
}

export default function MovieCard({
  movie,
  onAdd,
  onMovieClick,
  showAddButton = true,
}: MovieCardProps) {
  const year = movie.release_date?.split("-")[0] || "N/A";
  const score = movie.vote_average?.toFixed(1);

  return (
    <div
      className={`group relative flex-shrink-0 w-[180px] rounded-xl overflow-hidden bg-zinc-900 transition-transform duration-300 hover:scale-105 ${onMovieClick ? "cursor-pointer" : ""}`}
      onClick={onMovieClick ? () => onMovieClick(movie) : undefined}
    >
      <div className="relative aspect-[2/3]">
        {movie.poster_path ? (
          <Image
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="180px"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
            No Poster
          </div>
        )}
        {showAddButton && onAdd && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAdd(movie); }}
            className="absolute bottom-2 right-2 bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Add ${movie.title} to ranking`}
          >
            <Plus size={16} aria-hidden />
          </button>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-zinc-100 truncate">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1.5 text-xs text-zinc-400">
          <span>{year}</span>
          <span className="text-yellow-500">{score}</span>
        </div>
      </div>
    </div>
  );
}
