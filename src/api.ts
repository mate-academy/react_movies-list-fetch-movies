import { MovieData, ResponseError } from './types';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=b46131f4';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
