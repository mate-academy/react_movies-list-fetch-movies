import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=a8a94b42';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const q = query.trim();
  const url = `${API_URL}&t=${encodeURIComponent(q)}`;

  return fetch(url)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
