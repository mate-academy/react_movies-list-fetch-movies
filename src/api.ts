import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  if (!API_KEY) {
    return Promise.resolve({
      Response: 'False',
      Error: 'OMDB API key is missing. Check your .env file.',
    });
  }

  const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

  const encodedQuery = encodeURIComponent(query);

  return fetch(`${API_URL}&t=${encodedQuery}`)
    .then(res => {
      if (!res.ok) {
        return {
          Response: 'False',
          Error: `HTTP error: ${res.status}`,
        };
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
