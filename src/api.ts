import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const API_URL = `https://www.omdbapi.com/?apikey=a2e75ac3`;

  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
