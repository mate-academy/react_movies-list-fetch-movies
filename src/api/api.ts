import { MOVIE_URLS } from '../constants/url';
import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${MOVIE_URLS.API}&t=${query}`)
    .then(response => response.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
