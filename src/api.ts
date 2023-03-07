import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = '908975fa';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const BASE_IMDB_URL = 'https://www.imdb.com/title/';

// eslint-disable-next-line max-len
export const emptyImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
