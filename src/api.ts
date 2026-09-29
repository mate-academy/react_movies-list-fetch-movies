import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

// const OMDB_API_KEY =
//   import.meta.env.VITE_OMDB_API_KEY ||
//   (typeof process !== 'undefined' && process.env?.REACT_APP_OMDB_API_KEY) ||
//   'your-key';

const API_URL = `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
