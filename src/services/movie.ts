import { Movie } from '../types/Movie';

export function checkMovie(id: string, moviesList: Movie[]) {
  return moviesList.some((movie: Movie) => movie.imdbId === id);
}
