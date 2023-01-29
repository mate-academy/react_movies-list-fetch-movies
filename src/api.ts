import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=261e0227';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch((error) => ({
      Response: 'False',
      Error: error,
    }));
}
