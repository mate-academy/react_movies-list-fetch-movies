import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview'; // eslint-disable-line

const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=a180f2a6';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
