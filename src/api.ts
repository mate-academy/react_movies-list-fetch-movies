import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=30a012aa';
export const ALTERNATIVE_IMG_URL
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
