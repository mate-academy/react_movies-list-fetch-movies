import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const MY_API = '2886b8cf';
const API_URL = `https://www.omdbapi.com/?apikey=${MY_API}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
