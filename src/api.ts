import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_KEY = '99e138a4';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
