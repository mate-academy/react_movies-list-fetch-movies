import { API_URL } from './constants';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
