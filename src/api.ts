import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;

if (!process.env.REACT_APP_OMDB_API_KEY) {
  console.warn('OMDb API key is missing!');
}

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
