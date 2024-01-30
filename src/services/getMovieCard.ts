import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovieCard(movieData: MovieData | null): Movie | null {
  if (!movieData) {
    return null;
  }

  const {
    Title, Plot, Poster, imdbID,
  } = movieData;

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}
