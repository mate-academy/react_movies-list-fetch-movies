import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  try {
    const safeQuery = encodeURIComponent(query.trim());
    const url = `${BASE_URL}?apikey=${API_KEY}&t=${safeQuery}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Network error: ${res.status}`);
    }

    return await res.json();
  } catch (error: unknown) {
    return {
      Response: 'False',
      Error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
