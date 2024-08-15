import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

const API_KEY = '93cee904';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(error => {
      return {
        Response: 'False',
        Error: error.message,
      };
    });
}
