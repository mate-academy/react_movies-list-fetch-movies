import { DEAFULT_PICTURE, IMDB_URL, NOT_AVAILABLE } from '../enums';
import { Movie, MovieData } from '../types';

export const getNormalizedMovie = (movieData: MovieData): Movie => {
  const {
    Title: title,
    Plot: description,
    Poster,
    imdbID: imdbId,
  } = movieData;

  const imgUrl = Poster === NOT_AVAILABLE
    ? DEAFULT_PICTURE
    : Poster;

  const imdbUrl = `${IMDB_URL}/${imdbId}`;

  return {
    title,
    description,
    imgUrl,
    imdbUrl,
    imdbId,
  };
};
