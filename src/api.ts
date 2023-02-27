import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { KEY } from './utils/KEY';

const API_URL = `https://www.omdbapi.com/?apikey=${KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
