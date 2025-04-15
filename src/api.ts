import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = `https://www.omdbapi.com/?i=${import.meta.env.VITE_OMDB_USER_ID}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
