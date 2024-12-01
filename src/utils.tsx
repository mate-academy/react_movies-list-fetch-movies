import { DEFAULT_IMG, IMDB_URL } from './constants';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

export function changeMovieDataType(movie: MovieData): Movie {
  const {
    Poster,
    Title: title,
    Plot: description,
    imdbID: imdbId,
  } = movie as MovieData;

  const imgUrl = Poster.includes('https://') ? Poster : DEFAULT_IMG;

  return {
    title,
    description,
    imgUrl,
    imdbUrl: IMDB_URL + imdbId,
    imdbId,
  };
}

export function isMovieUnique(
  movies: Movie[],
  currentMovie: Movie | null,
): boolean {
  if (!currentMovie) {
    return false;
  }

  if (movies.length < 1) {
    return true;
  }

  const uniqueMovie = Boolean(
    movies.find(movie => movie.imdbId !== currentMovie.imdbId),
  );

  return uniqueMovie;
}

export function updateMovies(
  movies: Movie[],
  currentMovie: Movie | null,
): Movie[] {
  if (!isMovieUnique(movies, currentMovie)) {
    return [...movies];
  }

  return [...movies, currentMovie as Movie];
}
