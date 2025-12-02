import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = '9c8cc571';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const DEFAULT_POSTER_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
