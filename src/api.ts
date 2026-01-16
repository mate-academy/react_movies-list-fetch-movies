import { MovieData } from './types/MovieData';

const API_KEY = 'b003ea58';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(title: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => response.json())
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error',
    }));
}
