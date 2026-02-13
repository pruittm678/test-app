"use client";

import { useCallback, useState, useMemo } from "react";
import { Movie } from "@/lib/tmdb";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import MarqueeHeader from "@/components/marquee/MarqueeHeader";
import CastingCall from "@/components/marquee/CastingCall";
import BoxOfficeBattle from "@/components/marquee/BoxOfficeBattle";
import GrandPremiere from "@/components/marquee/GrandPremiere";

type VibeRating = "masterpiece" | "matinee" | "flop";
type Screen = "casting" | "battle" | "premiere";

interface RankedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  score: number;
  vibe: VibeRating;
}

interface BattleState {
  movie: Movie;
  vibe: VibeRating;
  low: number;
  high: number;
  history: { low: number; high: number; mid: number }[];
}

function vibeBaseScore(vibe: VibeRating): number {
  switch (vibe) {
    case "masterpiece":
      return 9.0;
    case "matinee":
      return 6.5;
    case "flop":
      return 3.0;
  }
}

export default function Home() {
  const [rankings, setRankings] = useLocalStorage<RankedMovie[]>(
    "marquee-rankings",
    []
  );
  const [activeScreen, setActiveScreen] = useState<Screen>("casting");
  const [battle, setBattle] = useState<BattleState | null>(null);

  // Compute the opponent for the current battle mid-point
  const battleMid = useMemo(() => {
    if (!battle) return -1;
    return Math.floor((battle.low + battle.high) / 2);
  }, [battle]);

  const opponent = useMemo(() => {
    if (!battle || battleMid < 0 || battleMid >= rankings.length) return null;
    return rankings[battleMid];
  }, [battle, battleMid, rankings]);

  // Start a battle when user selects a vibe
  const handleVibeSelected = useCallback(
    (movie: Movie, vibe: VibeRating) => {
      if (rankings.length === 0) {
        // First movie — no battle needed, insert directly
        const score = vibeBaseScore(vibe);
        setRankings([
          {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            score,
            vibe,
          },
        ]);
        setActiveScreen("premiere");
        return;
      }

      // Check for duplicates
      if (rankings.some((m) => m.id === movie.id)) {
        setActiveScreen("premiere");
        return;
      }

      // Start binary search battle
      setBattle({
        movie,
        vibe,
        low: 0,
        high: rankings.length,
        history: [],
      });
      setActiveScreen("battle");
    },
    [rankings, setRankings]
  );

  // User picks the NEW movie as superior → it should rank higher (lower index)
  const handlePickNew = useCallback(() => {
    if (!battle) return;
    const mid = Math.floor((battle.low + battle.high) / 2);
    const newState: BattleState = {
      ...battle,
      high: mid,
      history: [...battle.history, { low: battle.low, high: battle.high, mid }],
    };

    if (newState.low >= newState.high) {
      // Insert at position
      insertMovie(newState, newState.low);
    } else {
      setBattle(newState);
    }
  }, [battle, rankings]);

  // User picks the OPPONENT as superior → new movie goes below (higher index)
  const handlePickOpponent = useCallback(() => {
    if (!battle) return;
    const mid = Math.floor((battle.low + battle.high) / 2);
    const newState: BattleState = {
      ...battle,
      low: mid + 1,
      history: [...battle.history, { low: battle.low, high: battle.high, mid }],
    };

    if (newState.low >= newState.high) {
      insertMovie(newState, newState.low);
    } else {
      setBattle(newState);
    }
  }, [battle, rankings]);

  // Insert movie into rankings at the determined position
  const insertMovie = useCallback(
    (state: BattleState, position: number) => {
      const totalCount = rankings.length + 1;
      // Score based on position: top = highest score within vibe range, bottom = lowest
      const baseScore = vibeBaseScore(state.vibe);
      const positionFactor = 1 - position / Math.max(totalCount - 1, 1);
      const score = Math.max(
        1.0,
        Math.min(10.0, baseScore + (positionFactor - 0.5) * 2)
      );

      const newMovie: RankedMovie = {
        id: state.movie.id,
        title: state.movie.title,
        poster_path: state.movie.poster_path,
        release_date: state.movie.release_date,
        score: Math.round(score * 10) / 10,
        vibe: state.vibe,
      };

      setRankings((prev) => {
        const updated = [...prev];
        updated.splice(position, 0, newMovie);
        return updated;
      });
      setBattle(null);
      setActiveScreen("premiere");
    },
    [rankings, setRankings]
  );

  // Undo last battle decision
  const handleUndo = useCallback(() => {
    if (!battle || battle.history.length === 0) return;
    const prev = battle.history[battle.history.length - 1];
    setBattle({
      ...battle,
      low: prev.low,
      high: prev.high,
      history: battle.history.slice(0, -1),
    });
  }, [battle]);

  // Skip — insert at current midpoint
  const handleSkip = useCallback(() => {
    if (!battle) return;
    const mid = Math.floor((battle.low + battle.high) / 2);
    insertMovie(battle, mid);
  }, [battle, insertMovie]);

  // Remove from rankings
  const handleRemove = useCallback(
    (id: number) => {
      setRankings((prev) => prev.filter((m) => m.id !== id));
    },
    [setRankings]
  );

  return (
    <main className="min-h-screen velvet-bg film-grain relative max-w-md mx-auto">
      <MarqueeHeader />

      {/* Navigation tabs */}
      <nav className="flex items-center justify-center gap-1 mb-6 px-4">
        <button
          onClick={() => setActiveScreen("casting")}
          className={`nav-tab ${activeScreen === "casting" ? "nav-tab-active" : ""}`}
        >
          Search
        </button>
        <span className="text-gold/20 text-xs mx-1">/</span>
        <button
          onClick={() => {
            if (battle) setActiveScreen("battle");
          }}
          className={`nav-tab ${activeScreen === "battle" ? "nav-tab-active" : ""} ${
            !battle ? "opacity-30 cursor-not-allowed" : ""
          }`}
          disabled={!battle}
        >
          Battle
        </button>
        <span className="text-gold/20 text-xs mx-1">/</span>
        <button
          onClick={() => setActiveScreen("premiere")}
          className={`nav-tab ${activeScreen === "premiere" ? "nav-tab-active" : ""}`}
        >
          Rankings
          {rankings.length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold/20 text-gold text-[0.5rem]">
              {rankings.length}
            </span>
          )}
        </button>
      </nav>

      {/* Screen content */}
      {activeScreen === "casting" && (
        <CastingCall onVibeSelected={handleVibeSelected} />
      )}

      {activeScreen === "battle" && battle && opponent && (
        <BoxOfficeBattle
          newMovie={battle.movie}
          opponent={{
            ...opponent,
            id: opponent.id,
            title: opponent.title,
            overview: "",
            poster_path: opponent.poster_path,
            backdrop_path: null,
            release_date: opponent.release_date,
            vote_average: opponent.score,
          }}
          onPickNew={handlePickNew}
          onPickOpponent={handlePickOpponent}
          onUndo={handleUndo}
          onSkip={handleSkip}
          canUndo={battle.history.length > 0}
        />
      )}

      {activeScreen === "premiere" && (
        <GrandPremiere rankings={rankings} onRemove={handleRemove} />
      )}
    </main>
  );
}
