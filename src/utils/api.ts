import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=';
const KEY = '53b36665';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL + KEY}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
