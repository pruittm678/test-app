const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

function requireApiKey(): string {
  if (!API_KEY || API_KEY.trim() === "") {
    throw new Error("Missing TMDB API key. Add NEXT_PUBLIC_TMDB_API_KEY to .env.local");
  }
  return API_KEY;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
}

interface TMDBResponse {
  results: Movie[];
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "original" = "w500"
): string {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}

export async function fetchTrending(): Promise<Movie[]> {
  const key = requireApiKey();
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${key}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  const data: TMDBResponse = await res.json();
  return data.results;
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const key = requireApiKey();
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${key}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const key = requireApiKey();
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${key}&query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to search movies");
  const data: TMDBResponse = await res.json();
  return data.results ?? [];
}

/** TMDB movie IDs for "More to explore" — 10 picks from 2020 onward */
export const FEATURED_MOVIE_IDS = [
  508442,   // Soul (2020)
  581734,   // Nomadland (2020)
  634649,   // Spider-Man: No Way Home (2021)
  438631,   // Dune (2021)
  545611,   // Everything Everywhere All at Once (2022)
  414906,   // The Batman (2022)
  361743,   // Top Gun: Maverick (2022)
  872585,   // Oppenheimer (2023)
  846433,   // Poor Things (2023)
  840430,   // The Holdovers (2023)
];

export async function fetchMoviesByIds(ids: number[]): Promise<Movie[]> {
  const key = requireApiKey();
  const results = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${key}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data as Movie;
    })
  );
  return results.filter((m): m is Movie => m != null);
}
