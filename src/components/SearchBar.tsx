"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchMovies, Movie } from "@/lib/tmdb";

interface SearchBarProps {
  onResults: (movies: Movie[]) => void;
  onClear: () => void;
}

export default function SearchBar({ onResults, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      onClear();
      setIsSearching(false);
      setSearchError(null);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setNoResults(false);

    debounceRef.current = setTimeout(() => {
      searchMovies(query.trim())
        .then((movies) => {
          onResults(movies);
          setNoResults(movies.length === 0);
        })
        .catch((err) => {
          setSearchError(err instanceof Error ? err.message : "Search failed");
          onResults([]);
        })
        .finally(() => setIsSearching(false));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onResults, onClear]);

  const handleClose = () => {
    setQuery("");
    setIsOpen(false);
    setSearchError(null);
    setNoResults(false);
    onClear();
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-1">
      {isOpen ? (
        <div className="glassmorphism rounded-2xl flex flex-col px-4 py-3.5 gap-3 w-[300px] md:w-[400px] transition-all">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-zinc-400 flex-shrink-0" aria-hidden />
            <input
              autoFocus
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-zinc-100 placeholder-zinc-500 outline-none w-full text-sm"
              aria-label="Search movies"
            />
            <button
              type="button"
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-200 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
          {isSearching && (
            <p className="text-xs text-zinc-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Searching...
            </p>
          )}
          {searchError && !isSearching && (
            <p className="text-xs text-red-400">{searchError}</p>
          )}
          {noResults && !isSearching && query.trim().length >= 2 && (
            <p className="text-xs text-zinc-400">No movies found for &quot;{query.trim()}&quot;</p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="glassmorphism rounded-full p-3 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          aria-label="Open search"
        >
          <Search size={20} className="text-zinc-300" aria-hidden />
        </button>
      )}
    </div>
  );
}
