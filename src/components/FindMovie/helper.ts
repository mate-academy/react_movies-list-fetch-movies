import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

export const normalizeMovieData = (movieData: MovieData): Movie => {
  const {
    Title,
    Plot,
    imdbID,
    Poster,
  } = movieData;

  const poster = Poster === 'N/A'
    ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
    : Poster;

  return {
    title: Title,
    description: Plot,
    imdbId: imdbID,
    imgUrl: poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  };
};
