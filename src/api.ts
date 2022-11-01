import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = '98ec4eff';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
