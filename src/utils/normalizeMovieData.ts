import { MovieData } from '../types/MovieData';
import { Movie } from '../types/Movie';

const PLACEHOLDER = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function normalizeMovieData(movieData: MovieData): Movie {
  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster || PLACEHOLDER,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
    imdbId: movieData.imdbID,
  };
}
