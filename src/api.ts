import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=bbd52085';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`).then(res => {
    if (!res.ok) {
      return Promise.reject(new Error('Movie not found'));
    }

    return res.json();
  });
}
