import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string;
const API_BASE = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_BASE}?apikey=${API_KEY}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
