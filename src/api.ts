// import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
// import { MovieData } from './types/MovieData';
// import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=e5c72b87';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => {
      if (!res.ok) {
        return null;
      }

      if (res.headers.get('content-type')?.includes('application.json')) {
        return null;
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
