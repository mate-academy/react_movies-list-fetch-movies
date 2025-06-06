import { MovieData } from './types/MovieData';
import { ReponseError } from './types/ReponseError';
const API_KEY = 'bf8cc1f4';
const API_URL = 'https://www.omdbapi.com/?apikey=' + API_KEY;

export function getMovie(query: string): Promise<MovieData | ReponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
