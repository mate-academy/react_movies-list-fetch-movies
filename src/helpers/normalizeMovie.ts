import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';
import { defaultImgURL } from './defalultImg';

export const normalizeMovie = (
  movieFromServer: MovieData,
): Movie => {
  const {
    Title,
    Plot,
    Poster,
    imdbID,
  } = movieFromServer;

  const imgUrl = Poster === 'N/A'
    ? defaultImgURL
    : Poster;

  const description = Plot === 'N/A'
    ? 'No description'
    : Plot;

  return {
    title: Title,
    description,
    imgUrl,
    imdbId: imdbID,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
  };
};
