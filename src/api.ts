import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=8187ae7f';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
