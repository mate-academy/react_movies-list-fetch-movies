import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

// const OMDBAPI_KEY = import.meta.env.VITE_OMDB_API_KEY;

// const API_URL = `https://www.omdbapi.com/?${OMDBAPI_KEY}`;
const API_URL = `https://www.omdbapi.com/?i=tt3896198&apikey=32027aa8`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const API_URL_READY = `${API_URL}&t=${query}`;

  return fetch(API_URL_READY)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
