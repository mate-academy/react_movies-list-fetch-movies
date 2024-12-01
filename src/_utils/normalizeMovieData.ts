import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export function normalizeMovieData(movieData: MovieData): Movie {
  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster !== 'N/A'
      ? movieData.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
    imdbId: movieData.imdbID,
  };
}
