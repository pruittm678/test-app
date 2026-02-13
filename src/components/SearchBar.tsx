"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { searchMovies, Movie } from "@/lib/tmdb";

interface SearchBarProps {
  onResults: (movies: Movie[]) => void;
  onClear: () => void;
}

export default function SearchBar({ onResults, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      onClear();
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchMovies(query.trim())
        .then(onResults)
        .catch(console.error);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onResults, onClear]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {isOpen ? (
        <div className="glassmorphism rounded-full flex items-center px-4 py-2 gap-2 w-[300px] md:w-[400px] transition-all">
          <Search size={18} className="text-zinc-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-zinc-100 placeholder-zinc-500 outline-none w-full text-sm"
          />
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              onClear();
            }}
            className="text-zinc-400 hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="glassmorphism rounded-full p-3 hover:bg-white/10 transition-colors"
        >
          <Search size={20} className="text-zinc-300" />
        </button>
      )}
    </div>
  );
}
