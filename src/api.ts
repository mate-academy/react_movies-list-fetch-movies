import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=';

const KEY = import.meta.env.VITE_OMDB_API_KEY;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL + KEY}&t=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) {
        return {
          Response: 'False',
          Error: res.statusText || 'unexpected error',
        } as ResponseError;
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
