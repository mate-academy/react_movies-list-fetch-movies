import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

// eslint-disable-next-line max-len
const API_URL = 'https://www.omdbapi.com/?apikey=b5e87ca0';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
