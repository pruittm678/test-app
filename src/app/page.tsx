"use client";

import { useCallback, useState } from "react";
import { Movie } from "@/lib/tmdb";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import RankingList from "@/components/RankingList";
import MovieDetailModal from "@/components/MovieDetailModal";

export default function Home() {
  const [rankings, setRankings] = useLocalStorage<Movie[]>(
    "cinerank-rankings",
    []
  );
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const addToRanking = useCallback(
    (movie: Movie) => {
      setRankings((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        return [...prev, movie];
      });
    },
    [setRankings]
  );

  const removeFromRanking = useCallback(
    (id: number) => {
      setRankings((prev) => prev.filter((m) => m.id !== id));
    },
    [setRankings]
  );

  const handleSearchResults = useCallback((movies: Movie[]) => {
    setSearchResults(movies);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 pb-16">
      <SearchBar onResults={handleSearchResults} onClear={handleClearSearch} />
      <HeroSection onAdd={addToRanking} onMovieClick={handleMovieClick} />
      <FeaturedSection onAdd={addToRanking} onMovieClick={handleMovieClick} />
      <SearchResults results={searchResults} onAdd={addToRanking} onMovieClick={handleMovieClick} />
      <RankingList
        rankings={rankings}
        onReorder={setRankings}
        onRemove={removeFromRanking}
      />
      <MovieDetailModal
        movie={selectedMovie}
        onClose={handleCloseModal}
        onAdd={addToRanking}
      />
    </main>
  );
}
