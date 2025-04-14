import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = `http://www.omdbapi.com/?i=${import.meta.env.VITE_OMDB_USER_ID}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  // eslint-disable-next-line no-console
  console.log(API_URL);

  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error('API request failed:', error);

      return {
        Response: 'False',
        Error: 'unexpected error',
      };
    });
}
