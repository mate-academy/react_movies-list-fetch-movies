import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const API_URL = 'https://www.omdbapi.com/?apikey=ab66224e';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
