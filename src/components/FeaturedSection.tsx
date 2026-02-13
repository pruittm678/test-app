"use client";

import { useEffect, useState } from "react";
import { Film } from "lucide-react";
import { Movie, fetchMoviesByIds, FEATURED_MOVIE_IDS } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface FeaturedSectionProps {
  onAdd: (movie: Movie) => void;
  onMovieClick?: (movie: Movie) => void;
}

export default function FeaturedSection({
  onAdd,
  onMovieClick,
}: FeaturedSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMoviesByIds(FEATURED_MOVIE_IDS)
      .then(setMovies)
      .catch(console.error);
  }, []);

  if (movies.length === 0) return null;

  return (
    <section className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
      <div className="flex items-center gap-3 mb-6">
        <Film className="text-indigo-400" size={24} aria-hidden />
        <h2 className="text-xl font-semibold text-zinc-100">
          More to explore (2020+)
        </h2>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onAdd={onAdd}
            onMovieClick={onMovieClick}
          />
        ))}
      </div>
    </section>
  );
}
