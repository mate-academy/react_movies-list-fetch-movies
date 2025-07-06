import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=466fb317';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
