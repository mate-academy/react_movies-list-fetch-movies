import { MovieData, ResponseError } from './libs/types';

const API_URL = 'https://www.omdbapi.com/?apikey=24ae4fc6';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
