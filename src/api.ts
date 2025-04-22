import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_KEY = '2b7ff5fe';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(data => {
      if (data.Response === 'False') {
        return { 
          Response: 'False', 
          Error: data.Error || 'movies is not defined'
        };
      }
      return data;
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
