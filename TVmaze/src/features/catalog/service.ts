const API_BASE_URL = 'https://api.tvmaze.com';
const MIN_REQUEST_INTERVAL_MS = 500;

export type TvmazeShow = {
  id: number;
  name: string;
  genres: string[];
  image: { medium: string; original: string } | null;
  summary: string | null;
  premiered: string | null;
  status: string;
  rating: { average: number | null };
  network: { name: string } | null;
  webChannel: { name: string } | null;
  _embedded?: { episodes?: TvmazeEpisode[] };
};

export type TvmazeEpisode = {
  id: number;
  name: string;
  season: number;
  number: number | null;
  airdate: string | null;
  runtime: number | null;
  summary: string | null;
};

type SearchResult = {
  score: number;
  show: TvmazeShow;
};

let requestQueue: Promise<void> = Promise.resolve();
let nextRequestAt = 0;

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function fetchTvmaze<T>(path: string): Promise<T> {
  const request = requestQueue.then(async () => {
    const wait = Math.max(0, nextRequestAt - Date.now());
    if (wait > 0) {
      await delay(wait);
    }

    nextRequestAt = Date.now() + MIN_REQUEST_INTERVAL_MS;
    let response = await fetch(`${API_BASE_URL}${path}`);

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 10_000);
      nextRequestAt = Date.now() + MIN_REQUEST_INTERVAL_MS;
      response = await fetch(`${API_BASE_URL}${path}`);
    }

    if (!response.ok) {
      throw new Error(
        response.status === 429
          ? 'TVmaze limite temporairement les requêtes. Réessayez dans quelques instants.'
          : `Erreur TVmaze (${response.status}). Réessayez plus tard.`,
      );
    }

    return (await response.json()) as T;
  });

  requestQueue = request.then(
    () => undefined,
    () => undefined,
  );

  return request;
}

export function getShows(page = 0) {
  return fetchTvmaze<TvmazeShow[]>(`/shows?page=${Math.max(0, page)}`);
}

export async function searchShows(query: string) {
  const results = await fetchTvmaze<SearchResult[]>(
    `/search/shows?q=${encodeURIComponent(query.trim())}`,
  );
  return results.map(({ show }) => show);
}

export function getShow(id: number) {
  return fetchTvmaze<TvmazeShow>(`/shows/${id}?embed=episodes`);
}
