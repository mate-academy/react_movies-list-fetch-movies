import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_KEY = 'a63158d6';

const API_URL = `https://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
