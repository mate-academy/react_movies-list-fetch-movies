import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

export const normalizeMovieData = (data: MovieData): Movie => {
  const {
    Title,
    Plot,
    Poster,
    imdbID,
  } = data;

  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster,
    imdbId: imdbID,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  };
};
