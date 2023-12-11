import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=d890bd78';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const BASE_URLL = `${API_URL}&t=${query}`;

  return fetch(BASE_URLL)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
