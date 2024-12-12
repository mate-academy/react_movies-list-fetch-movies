import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
// i use MATE key my isnt working. atleast at the moment
const API_URL = 'https://www.omdbapi.com/?apikey=3ac6f8d7';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
