import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = 'a461e386';
const API_URL = 'https://www.omdbapi.com/';

export function getMovie(title: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error',
    }));
}
