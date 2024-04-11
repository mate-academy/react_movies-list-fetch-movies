import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'http://www.omdbapi.com/?';

export function getMovie(
  query: string,
): Promise<MovieData | ResponseError | null> {
  return fetch(`${API_URL}t=${query}&apikey=af34f550`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
