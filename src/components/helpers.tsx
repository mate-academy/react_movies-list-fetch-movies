import { Movie } from '../types/Movie';
import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

export const isResponceOK = (responce: MovieData | ResponseError) => {
  if ('Error' in responce) {
    return false;
  }

  return true;
};

export const normalizeData = (movieData: MovieData) => {
  const {
    Poster: imgUrl,
    Title: title,
    Plot: description,
    imdbID: imdbId,
  } = movieData;

  const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

  const movie: Movie = {
    imgUrl,
    title,
    description,
    imdbId,
    imdbUrl,
  };

  if (movie.imgUrl === 'N/A') {
    movie.imgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }

  return movie;
};
