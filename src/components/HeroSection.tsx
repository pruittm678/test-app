"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Movie, fetchTrending, getImageUrl } from "@/lib/tmdb";

interface HeroSectionProps {
  onAdd: (movie: Movie) => void;
  onMovieClick?: (movie: Movie) => void;
}

export default function HeroSection({ onAdd, onMovieClick }: HeroSectionProps) {
  const [hero, setHero] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTrending()
      .then((movies) => {
        if (movies.length > 0) {
          setHero(movies[0]);
          setTrendingMovies(movies);
        }
      })
      .catch(console.error);
  }, []);

  if (!hero) {
    return (
      <div className="relative w-full h-[70vh] bg-zinc-900 animate-pulse" />
    );
  }

  return (
    <section className="relative w-full">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {hero.backdrop_path && (
          <Image
            src={getImageUrl(hero.backdrop_path, "original")}
            alt={hero.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-14 left-6 md:left-12 lg:left-16 max-w-2xl">
          <p className="text-indigo-400 text-sm font-medium mb-3">
            #1 Trending This Week
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {hero.title}
          </h1>
          <p className="text-zinc-300 text-sm md:text-base line-clamp-3 mb-6">
            {hero.overview}
          </p>
          <button
            type="button"
            onClick={() => onAdd(hero)}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            aria-label="Add to ranking"
          >
            <Plus size={20} aria-hidden />
            Add to Ranking
          </button>
        </div>
      </div>

      {/* Trending Row */}
      <div className="px-6 md:px-12 lg:px-16 -mt-14 relative z-10 pb-2">
        <h2 className="text-xl font-semibold text-zinc-100 mb-5">
          Trending This Week
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {trendingMovies.slice(1, 10).map((movie) => (
            <div
              key={movie.id}
              className="group relative flex-shrink-0 w-[140px] rounded-xl overflow-hidden bg-zinc-900 transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={onMovieClick ? () => onMovieClick(movie) : undefined}
            >
              <div className="relative aspect-[2/3]">
                {movie.poster_path ? (
                  <Image
                    src={getImageUrl(movie.poster_path, "w500")}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                    No Poster
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAdd(movie); }}
                  className="absolute bottom-2 right-2 bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-full min-w-[28px] min-h-[28px] flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`Add ${movie.title} to ranking`}
                >
                  <Plus size={14} aria-hidden />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-zinc-200 truncate">
                  {movie.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
