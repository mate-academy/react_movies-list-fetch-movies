import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

// eslint-disable-next-line max-len
export const placeholder = 'https://via.placeholder.com/360x270.png?text=no%20preview';

const API_URL = 'https://www.omdbapi.com/?apikey=c16eac69';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
