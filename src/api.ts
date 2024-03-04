import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const MY_KEY = 'a696fe37';
const API_URL = `https://www.omdbapi.com/?apikey=${MY_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
