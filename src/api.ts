import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_BASE = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string;

export async function getMovie(
  title: string,
): Promise<MovieData | ResponseError> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY ?? '',
      t: title,
    });

    const res = await fetch(`${API_BASE}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return (await res.json()) as MovieData | ResponseError;
  } catch {
    return { Response: 'False', Error: 'unexpected error' };
  }
}
