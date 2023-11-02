import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const prepareMovie = (data: MovieData): Movie => {
  const {
    Plot,
    Title,
    Poster,
    imdbID,
  } = data;

  const newsMovie: Movie = {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };

  return newsMovie;
};
