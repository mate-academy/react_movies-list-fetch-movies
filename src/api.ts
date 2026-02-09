import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const API_IMDB_URL = 'https://www.imdb.com/title/';

const API_KEY = 'a217a40d';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
