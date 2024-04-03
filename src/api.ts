import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const MY_KEY = '441b871e';

const API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${MY_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
