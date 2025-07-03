import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=43a00e62';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
