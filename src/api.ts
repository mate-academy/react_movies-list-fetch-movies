import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_URL = 'https://www.omdbapi.com/?apikey=';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL + API_KEY}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
