import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

// const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=f7291b05';
const API_KEY = 'f7291b05';
const BASE_URL = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${BASE_URL}?apikey=${API_KEY}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
