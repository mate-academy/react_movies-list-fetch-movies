import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = import.meta.env.VITE_API_URL;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
