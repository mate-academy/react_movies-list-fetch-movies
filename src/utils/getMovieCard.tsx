import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

// eslint-disable-next-line
const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovieCard(movieData: MovieData | null): Movie | null {
  if (!movieData) {
    return null;
  }

  const { Poster, Title, Plot, imdbID } = movieData;

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? DEFAULT_POSTER : Poster,
    imdbId: imdbID,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  };
}
