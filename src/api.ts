import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_URL = `https://www.omdbapi.com/?apikey=d1257887`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) {
        return { Response: 'False', Error: `HTTP error: ${res.status}` };
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
