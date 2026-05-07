import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const BASE_URL = 'https://www.omdbapi.com';
const API_URL = '/?apikey=';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const URL = BASE_URL + API_URL + API_KEY;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
