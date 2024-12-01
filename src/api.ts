import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=b6f7cb18';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const url = `${API_URL}&t=${query}`;

  return fetch(url)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(() => {
      return {
        Response: 'False',
        Error: 'unexpected error',
      };
    });
}
