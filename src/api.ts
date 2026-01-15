import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const KEY_OMDB_API = '3d3c0be7';
const API_URL = `https://www.omdbapi.com/?apikey=${KEY_OMDB_API}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
