import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

// const API_URL = 'http://www.omdbapi.com/?apikey=58f0bd6b';
const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=58f0bd6b';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
