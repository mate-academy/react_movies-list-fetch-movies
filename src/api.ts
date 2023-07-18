import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const key = '4a4ecfed';
const API_URL = 'https://www.omdbapi.com/?';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&apikey=${key}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
      Value: false,
    }));
}
