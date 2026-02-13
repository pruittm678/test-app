"use client";

import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

interface SearchResultsProps {
  results: Movie[];
  onAdd: (movie: Movie) => void;
  onMovieClick?: (movie: Movie) => void;
}

export default function SearchResults({ results, onAdd, onMovieClick }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <section className="px-8 md:px-16 py-8">
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">
        Search Results
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onAdd={onAdd} onMovieClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
}
