import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const MOVIE_URL = 'https://www.omdbapi.com/?apikey=fcd26db7';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${MOVIE_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
