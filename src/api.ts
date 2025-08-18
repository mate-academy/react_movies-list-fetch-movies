import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=8d5fb49d';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const encodedQuery = encodeURIComponent(query.trim());

  return fetch(`${API_URL}&t=${encodedQuery}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
