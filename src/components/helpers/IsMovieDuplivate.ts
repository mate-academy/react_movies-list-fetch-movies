import { Movie } from '../../types/Movie';

export function isMovieDuplicate(
  arrayMovies: Movie[],
  movie: Movie | null,
) {
  if (movie) {
    return arrayMovies.some(({ imdbId }) => imdbId === movie.imdbId);
  }

  return null;
}
