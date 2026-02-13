const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

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
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  const data: TMDBResponse = await res.json();
  return data.results;
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
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
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to search movies");
  const data: TMDBResponse = await res.json();
  return data.results;
}
