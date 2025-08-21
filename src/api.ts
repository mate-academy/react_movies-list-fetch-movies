import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = '127bacc3';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => {
      if (!res.ok) {
        throw new Error();
      }

      return res.json();
    })
    .then(responseData => {
      const movie: MovieData = {
        Poster: responseData.Poster,
        Title: responseData.Title,
        Plot: responseData.Plot,
        imdbID: responseData.imdbID,
      };

      return movie;
    })
    .catch(() => ({
      Response: 'False',
      Error: `fetch error`,
    }));
}
