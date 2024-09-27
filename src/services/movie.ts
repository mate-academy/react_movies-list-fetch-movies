import { Movie } from '../types/Movie';

export function haveThisMovieInList(movieList: Movie[], movie: Movie) {
  return movieList.some(movieInList => (
    movieInList.imdbId === movie.imdbId
  ));
}
