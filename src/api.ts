import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const key = 'b43f1e06';
const API_URL = 'https://www.omdbapi.com/?apikey=';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}${key}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
