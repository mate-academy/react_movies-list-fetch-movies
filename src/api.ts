import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=2e8b33c3';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .then(res => ({
      Poster: res.Poster !== 'N/A'
        ? res.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      Title: res.Title,
      Plot: res.Plot,
      imdbID: res.imdbID,
    }))
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
