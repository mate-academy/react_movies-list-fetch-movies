import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const API_URL = 'https://www.omdbapi.com';
const API_KEY = '/?apikey=37353fe0';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}${API_KEY}&t=${query}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Server error');
      }

      return res.json();
    })
    .catch(error => ({
      Response: 'False',
      Error: 'unexpected ' + error,
    }));
}
