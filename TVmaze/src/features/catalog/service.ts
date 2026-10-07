const API_BASE_URL = 'https://api.tvmaze.com';

export type TvmazeShow = {
  id: number;
  name: string;
  genres: string[];
  image: { medium: string; original: string } | null;
  premiered: string | null;
  rating: { average: number | null };
};

async function fetchTvmaze<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erreur TVmaze (${response.status}). Réessayez plus tard.`);
  }

  return (await response.json()) as T;
}

export function getShows(page = 0) {
  return fetchTvmaze<TvmazeShow[]>(`/shows?page=${Math.max(0, page)}`);
}
