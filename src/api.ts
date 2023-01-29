import { MovieData } from './types/MovieData';
import { ResponseIsError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=59db99f1';

export function getMovie(query: string): Promise<MovieData | ResponseIsError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      IsError: 'unexpected IsError',
    }));
}
