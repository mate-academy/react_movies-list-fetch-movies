import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

export function normalizeMovie(movie: MovieData): Movie {
  return {
    title: movie.Title,
    description: movie.Plot,
    imgUrl:
      movie.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movie.Poster,
    imdbId: movie.imdbID,
    imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
  };
}
