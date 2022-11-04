import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=852d7b42';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}

export function isTheSameMovie(movies: Movie[], newMovie: Movie) {
  if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
    return true;
  }

  return false;
}
