import { MovieData } from './types/MovieData';
import { ResponseError } from './types/RepsonseError';

const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(query)}`;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error, status ${res.status}`);
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
