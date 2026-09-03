import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = `https://www.omdbapi.com/?apikey=7e7472ab`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
