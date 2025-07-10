import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = import.meta.env.VITE_MY_API_KEY;

const API_URL = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const url = `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(query)}`;

  return fetch(url)
    .then(res => res.json())
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '';

      return { Response: 'False', Error: errorMessage || 'Failed to fetch' };
    });
}
