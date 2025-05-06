import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = '310216a';
const BASE_URL = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${BASE_URL}?apikey=${API_KEY}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
