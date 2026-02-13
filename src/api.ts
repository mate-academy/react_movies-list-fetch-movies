import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = 'b901fda8'; // або process.env.REACT_APP_OMDB_API_KEY
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error',
    }));
}
