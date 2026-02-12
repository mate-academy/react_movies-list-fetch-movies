import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export function getMovie(
  query: string,
  apikey: string,
): Promise<MovieData | ResponseError> {
  return fetch(`https://www.omdbapi.com/?apikey=${apikey}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
