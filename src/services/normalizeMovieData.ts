import { MovieData } from '../types/MovieData';
import { Movie } from '../types/Movie';

export const normalizeMovieData = (data: MovieData): Movie => {
  const {
    Poster,
    Title,
    Plot,
    imdbID,
  } = data;

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster !== 'N/A' ? Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
};
