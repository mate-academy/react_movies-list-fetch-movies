import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query.trim())}`)
    .then(res => {
      if (!res.ok) {
        return { Response: 'False', Error: res.statusText || 'request failed' };
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
