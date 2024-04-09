import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=c0016af8';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .then(data => ({
      Poster: data.Poster,
      Title: data.Title,
      Plot: data.Plot,
      imdbID: data.imdbID,
    }))
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
