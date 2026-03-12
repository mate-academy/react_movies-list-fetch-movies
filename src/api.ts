import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = 'd28f3f32';

const BASE_URL = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(query)}`;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if ('Response' in data && data.Response === 'False') {
        return {
          Response: 'False',
          Error: data.Error || 'Movie not found',
        } as ResponseError;
      }
      return data as MovieData;
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}